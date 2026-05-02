import { setOutput } from '@actions/core';
import byteSize from 'byte-size';
import { regressionReportTemplate, headOnlyReportTemplate } from '../report-templates/index.js';
import isBaseDiffFromHead from './is-base-diff-from-head.js';
import buildRef from './build-ref.js';
import { slicePkgData } from './slice-pkg-data.js';
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

	const sections = paths.map(({ label, prefix }) => headOnlyReportTemplate({
		headPkgData: slicePkgData(headPkgData, prefix),
		displaySize,
		sortBy,
		sortOrder,
		hideFiles,
		autoCollapse,
		title: label,
		includeTarball: false,
	}));

	// Append a single tarball-size note since it's a package-level value and
	// cannot be meaningfully split across paths.
	sections.push(`**Tarball size:** ${byteSize(headPkgData.tarballSize)}`);

	return `## 📊 Size report\n\n${sections.join('\n\n---\n\n')}`;
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

	const sections = paths.map(({ label, prefix }) => regressionReportTemplate({
		headPkgData: slicePkgData(headPkgData, prefix),
		basePkgData: slicePkgData(basePkgData, prefix),
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
	}));

	const headTarball = headPkgData.tarballSize;
	const baseTarball = basePkgData.tarballSize;
	const tarballDelta = headTarball - baseTarball;
	const tarballNote = tarballDelta === 0
		? `**Tarball size:** ${byteSize(headTarball)} (no change)`
		: `**Tarball size:** ${byteSize(headTarball)} (was ${byteSize(baseTarball)}, ${tarballDelta > 0 ? '+' : '-'}${byteSize(Math.abs(tarballDelta))})`;
	sections.push(tarballNote);

	return `## 📊 Size report\n\n${sections.join('\n\n---\n\n')}`;
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
