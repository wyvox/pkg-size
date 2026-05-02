import fs from 'fs';
import path from 'path';
import * as log from './log.js';
import exec from './exec.js';
import npmCi from './npm-ci.js';
import isFileTracked from './is-file-tracked.js';
import { c, link } from './markdown.js';
import scanDirFiles from './scan-dir-files.js';
import findTarballDir from './find-tarball-dir.js';
import { matchesPrefix } from './slice-pkg-data.js';

let pkgSizeInstalled = false;

async function buildRef({
	checkoutRef,
	refData,
	buildCommand,
	paths,
}) {
	const cwd = process.cwd();

	log.info(`Current working directory: ${cwd}`);

	if (checkoutRef) {
		// const temporaryDir = await createTempDirectory();
		log.info(`Checking out ref '${checkoutRef}'`);
		await exec(`git checkout -f ${checkoutRef}`);
		/*
		 * For parallel builds
		 * Since this doesn't make it a git repo, installing some deps like husky fails
		 */
		// await exec(`git --work-tree="${temporaryDir}" checkout -f origin/${ref} -- .`);

		// cwd = temporaryDir;
		// log.info('Changed working directory', cwd);
	}

	if (buildCommand !== 'false') {
		if (!buildCommand) {
			let pkgJson;
			try {
				pkgJson = JSON.parse(fs.readFileSync('./package.json'));
			} catch (error) {
				log.warning('Error reading package.json', error);
			}

			if (pkgJson && pkgJson.scripts && pkgJson.scripts.build) {
				log.info('Build script found in package.json');
				buildCommand = 'npm run build';
			}
		}

		if (buildCommand) {
			await npmCi({ cwd }).catch((error) => {
				throw new Error(`Failed to install dependencies:\n${error.message}`);
			});

			log.info(`Running build command: ${buildCommand}`);
			const buildStart = Date.now();
			await exec(buildCommand, { cwd }).catch((error) => {
				throw new Error(`Failed to run build command: ${buildCommand}\n${error.message}`);
			});
			log.info(`Build completed in ${(Date.now() - buildStart) / 1000}s`);
		}
	}

	let pkgDataBase;
	if (paths && paths.length > 0) {
		log.info('Scanning filesystem for specified paths');

		// Find which package (tarball) each prefix belongs to
		const pathTarballs = {};
		for (const { prefix } of paths) {
			// eslint-disable-next-line no-await-in-loop
			pathTarballs[prefix] = await findTarballDir(prefix, cwd);
		}

		// Run pkg-size once per unique tarball dir to get tarball sizes
		const tarballDirs = [...new Set(Object.values(pathTarballs).filter(Boolean))];
		const tarballs = {};
		if (tarballDirs.length > 0) {
			if (!pkgSizeInstalled) {
				log.info('Installing pkg-size globally');
				await exec('npm i -g pkg-size');
				pkgSizeInstalled = true;
			}
			for (const tarballDir of tarballDirs) {
				log.info(`Getting package size for ${tarballDir}`);
				// eslint-disable-next-line no-await-in-loop
				const result = await exec('pkg-size --json', { cwd: path.resolve(cwd, tarballDir) }).catch((error) => {
					throw new Error(`Failed to determine package size for ${tarballDir}: ${error.message}`);
				});
				const pkgSizeData = JSON.parse(result.stdout);
				tarballs[tarballDir] = {
					tarballSize: pkgSizeData.tarballSize,
					files: pkgSizeData.files,
				};
			}
		}

		// A prefix is only "in" a tarball if the tarball actually contains files
		// under that prefix. Without this check, a prefix like `smoke-tests/` would
		// incorrectly be associated with the root package whose package.json sits
		// above it in the directory tree.
		for (const { prefix } of paths) {
			const tarballDir = pathTarballs[prefix];
			if (tarballDir && tarballs[tarballDir]) {
				const inTarball = tarballs[tarballDir].files.some(
					file => matchesPrefix(file.path, prefix),
				);
				if (!inTarball) {
					pathTarballs[prefix] = null;
				}
			}
		}

		pkgDataBase = {
			files: await scanDirFiles(paths.map(p => p.prefix), cwd),
			tarballSize: 0,
			tarballs,
			pathTarballs,
		};
	} else {
		if (!pkgSizeInstalled) {
			log.info('Installing pkg-size globally');
			await exec('npm i -g pkg-size');
			pkgSizeInstalled = true;
		}

		log.info('Getting package size');
		const result = await exec('pkg-size --json', { cwd }).catch((error) => {
			throw new Error(`Failed to determine package size: ${error.message}`);
		});
		log.debug(JSON.stringify(result, null, 4));
		pkgDataBase = JSON.parse(result.stdout);
	}

	const pkgData = {
		...pkgDataBase,
		ref: refData,
		size: 0,
		sizeGzip: 0,
		sizeBrotli: 0,
	};

	await Promise.all(pkgData.files.map(async (file) => {
		pkgData.size += file.size;
		pkgData.sizeGzip += file.sizeGzip;
		pkgData.sizeBrotli += file.sizeBrotli;

		const isTracked = await isFileTracked(file.path);
		file.isTracked = isTracked;
		file.label = (
			isTracked
				? link(c(file.path), `${refData.repo.html_url}/blob/${refData.ref}/${file.path}`)
				: c(file.path)
		);
	}));

	log.info('Cleaning up');
	await exec('git reset --hard'); // Reverts changed files
	const { stdout: cleanList } = await exec('git clean -dfx'); // Deletes untracked & ignored files
	log.debug(cleanList);

	return pkgData;
}

export default buildRef;
