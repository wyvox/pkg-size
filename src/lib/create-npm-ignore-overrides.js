import fs from 'fs';
import path from 'path';
import * as log from './log.js';

/**
 * Some tools (e.g. wasm-pack) generate a .gitignore inside a subdirectory that
 * is listed in the package.json "files" field. npm-packlist respects nested
 * .gitignore files and will exclude those files even when they are explicitly
 * included via the "files" field. Creating an empty .npmignore in those
 * directories overrides the .gitignore so that npm-packlist includes the files.
 *
 * Returns the list of .npmignore files that were created so callers can clean
 * them up if needed (they are also removed automatically by `git clean -dfx`).
 *
 * @param {string} cwd - The working directory containing package.json
 * @returns {string[]} List of .npmignore file paths that were created
 */
function createNpmIgnoreOverrides(cwd) {
	let pkgJson;
	try {
		pkgJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
	} catch {
		return [];
	}

	if (!Array.isArray(pkgJson.files) || pkgJson.files.length === 0) {
		return [];
	}

	const created = [];
	for (const entry of pkgJson.files) {
		const dirPath = path.join(cwd, entry);
		let stat;
		try {
			stat = fs.statSync(dirPath);
		} catch {
			continue;
		}

		if (!stat.isDirectory()) {
			continue;
		}

		const gitignorePath = path.join(dirPath, '.gitignore');
		const npmignorePath = path.join(dirPath, '.npmignore');

		if (fs.existsSync(gitignorePath) && !fs.existsSync(npmignorePath)) {
			fs.writeFileSync(npmignorePath, '');
			created.push(npmignorePath);
			log.info(`Created temporary ${npmignorePath} to override .gitignore for npm packlist`);
		}
	}

	return created;
}

export default createNpmIgnoreOverrides;
