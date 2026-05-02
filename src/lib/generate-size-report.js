import { setOutput } from '@actions/core';
import byteSize from 'byte-size';
import { regressionReportTemplate, headOnlyReportTemplate } from '../report-templates/index.js';
import isBaseDiffFromHead from './is-base-diff-from-head.js';
import buildRef from './build-ref.js';
import { slicePkgData } from './slice-pkg-data.js';
import { c, strong } from './markdown.js';
import * as log from './log.js';

function renderHeadOnly(headPkgData, opts, paths) {
	const {
		displaySize,
		sortBy,
		sortOrder,
		hideFiles,
		autoCollapse,
	} = opts;

	if (!paths || paths.length === 0) {
		return headOnlyReportTemplate({
			headPkgData,
			displaySize,
			sortBy,
			sortOrder,
			hideFiles,
			autoCollapse,
		});
	}

	const seenTarballDirs = new Set();
	const blocks = [];
	for (const { label, prefix } of paths) {
		const tarballDir = headPkgData.pathTarballs?.[prefix] ?? null;
		if (tarballDir && !seenTarballDirs.has(tarballDir)) {
			seenTarballDirs.add(tarballDir);
			const tarballSize = headPkgData.tarballs?.[tarballDir]?.tarballSize ?? 0;
			blocks.push({ isTarball: true, content: `${strong('Tarball size')} — ${c(byteSize(tarballSize))}` });
		}
		blocks.push({
			isTarball: false,
			content: headOnlyReportTemplate({
				headPkgData: { ...slicePkgData(headPkgData, prefix), tarballSize: 0 },
				displaySize,
				sortBy,
				sortOrder,
				hideFiles,
				autoCollapse,
				title: label,
				includeTarball: false,
			}),
		});
	}

	let output = '';
	for (let i = 0; i < blocks.length; i++) {
		if (i > 0) {
			// No horizontal rule between a tarball heading and the first section it introduces
			output += (blocks[i - 1].isTarball && !blocks[i].isTarball) ? '\n\n' : '\n\n---\n\n';
		}
		output += blocks[i].content;
	}

	return `## 📊 Size report\n\n${output}`;
}

function renderRegression(headPkgData, basePkgData, opts, paths) {
	const {
		displaySize,
		sortBy,
		sortOrder,
		hideFiles,
		unchangedFiles,
		ignoreThreshold,
		autoCollapse,
		stripHash,
	} = opts;

	if (!paths || paths.length === 0) {
		return regressionReportTemplate({
			headPkgData,
			basePkgData,
			displaySize,
			sortBy,
			sortOrder,
			hideFiles,
			unchangedFiles,
			ignoreThreshold,
			autoCollapse,
			stripHash,
		});
	}

	const seenTarballDirs = new Set();
	const blocks = [];
	for (const { label, prefix } of paths) {
		const tarballDir = headPkgData.pathTarballs?.[prefix] ?? null;
		if (tarballDir && !seenTarballDirs.has(tarballDir)) {
			seenTarballDirs.add(tarballDir);
			const headTarballSize = headPkgData.tarballs?.[tarballDir]?.tarballSize ?? 0;
			const baseTarballSize = basePkgData.tarballs?.[tarballDir]?.tarballSize ?? 0;
			const heading = headTarballSize !== baseTarballSize
				? `${strong('Tarball size')} — ${c(byteSize(baseTarballSize))} → ${c(byteSize(headTarballSize))}`
				: `${strong('Tarball size')} — ${c(byteSize(headTarballSize))}`;
			blocks.push({ isTarball: true, content: heading });
		}
		blocks.push({
			isTarball: false,
			content: regressionReportTemplate({
				headPkgData: { ...slicePkgData(headPkgData, prefix), tarballSize: 0 },
				basePkgData: { ...slicePkgData(basePkgData, prefix), tarballSize: 0 },
				displaySize,
				sortBy,
				sortOrder,
				hideFiles,
				unchangedFiles,
				ignoreThreshold,
				autoCollapse,
				stripHash,
				title: label,
				includeTarball: false,
			}),
		});
	}

	let output = '';
	for (let i = 0; i < blocks.length; i++) {
		if (i > 0) {
			// No horizontal rule between a tarball heading and the first section it introduces
			output += (blocks[i - 1].isTarball && !blocks[i].isTarball) ? '\n\n' : '\n\n---\n\n';
		}
		output += blocks[i].content;
	}

	return `## 📊 Size report\n\n${output}`;
}

async function generateSizeReport({
	pr,
	buildCommand,
	commentReport,
	mode,
	unchangedFiles,
	hideFiles,
	sortBy,
	sortOrder,
	displaySize,
	ignoreThreshold,
	autoCollapse,
	stripHash,
	paths,
}) {
	log.startGroup('Build HEAD');
	const headPkgData = await buildRef({
		refData: pr.head,
		buildCommand,
		paths,
	});
	setOutput('headPkgData', headPkgData);
	log.endGroup();

	const opts = {
		unchangedFiles,
		hideFiles,
		sortBy,
		sortOrder,
		displaySize,
		ignoreThreshold,
		autoCollapse,
		stripHash,
	};

	if (mode === 'head-only') {
		if (paths && paths.length > 0) {
			setOutput('pathsReports', paths.map(({ label, prefix }) => ({
				label,
				prefix,
				head: slicePkgData(headPkgData, prefix),
			})));
		}

		if (commentReport !== 'false') {
			return renderHeadOnly(headPkgData, opts, paths);
		}
		return false;
	}

	const { ref: baseRef } = pr.base;
	let basePkgData;
	if (await isBaseDiffFromHead(baseRef)) {
		log.info('HEAD is different from BASE. Triggering build.');
		log.startGroup('Build BASE');
		basePkgData = await buildRef({
			checkoutRef: baseRef,
			refData: pr.base,
			buildCommand,
			paths,
		});
		log.endGroup();
	} else {
		log.info('HEAD is identical to BASE. Skipping base build.');
		basePkgData = {
			...headPkgData,
			ref: pr.base,
		};
	}
	setOutput('basePkgData', basePkgData);

	if (paths && paths.length > 0) {
		setOutput('pathsReports', paths.map(({ label, prefix }) => ({
			label,
			prefix,
			head: slicePkgData(headPkgData, prefix),
			base: slicePkgData(basePkgData, prefix),
		})));
	}

	if (commentReport !== 'false') {
		return renderRegression(headPkgData, basePkgData, opts, paths);
	}

	return false;
}

export default generateSizeReport;
