import { setOutput } from '@actions/core';
import byteSize from 'byte-size';
import { markdownTable } from 'markdown-table';
import outdent from 'outdent';
import {
	c, sub, sup, strong,
} from '../../lib/markdown.js';
import {
	getSizeLabels,
	parseDisplaySize,
	listSizes,
} from '../utils.js';
import comparePackages from './compare-packages.js';

const directionSymbol = (value) => {
	if (value < 0) {
		return '↓';
	}

	if (value > 0) {
		return '↑';
	}

	return '';
};

const formatDelta = ({ delta, percent }) => (delta ? (percent + directionSymbol(delta)) : '');

const AUTO_COLLAPSE_THRESHOLD = 20;

function generateComment({
	headPkgData,
	basePkgData,
	sortBy,
	sortOrder,
	hideFiles,
	unchangedFiles,
	displaySize,
	ignoreThreshold,
	autoCollapse,
	stripHash,
	title,
	includeTarball = true,
}) {
	const regressionData = comparePackages(headPkgData, basePkgData, {
		sortBy,
		sortOrder,
		hideFiles,
		ignoreThreshold,
		stripHash,
	});

	setOutput('regressionData', regressionData);

	const { changed, unchanged, hidden } = regressionData.files;
	const displaySizes = parseDisplaySize(displaySize);
	const sizeHeadingLabel = getSizeLabels(displaySizes);

	const fileRows = [
		...changed,
		...(unchangedFiles === 'show' ? unchanged : []),
	];

	const mapFileRow = file => [
		file.label,
		file.base && file.base.size
			? listSizes(displaySizes, p => c(byteSize(file.base[p])))
			: '—',
		file.head && file.head.size
			? listSizes(
				displaySizes,
				p => (file.base && file.base[p] ? sup(formatDelta(file.diff[p])) : '') + c(byteSize(file.head[p])),
			)
			: '—',
	];

	const totalRows = [
		[
			`${strong('Total')} ${(unchangedFiles === 'show' ? '' : sub('_(Includes all files)_'))}`,
			listSizes(displaySizes, p => c(byteSize(regressionData.base[p]))),
			listSizes(displaySizes, p => (
				sup(formatDelta(regressionData.diff[p]))
				+ c(byteSize(regressionData.head[p]))
			)),
		],
		...(includeTarball ? [[
			strong('Tarball size'),
			c(byteSize(regressionData.base.tarballSize)),
			(
				sup(formatDelta(regressionData.diff.tarballSize))
				+ c(byteSize(regressionData.head.tarballSize))
			),
		]] : []),
	];

	const shouldAutoCollapse = autoCollapse && fileRows.length > AUTO_COLLAPSE_THRESHOLD;

	let table;
	let autoCollapseSection = '';

	if (shouldAutoCollapse) {
		table = markdownTable([
			['File', `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
			...totalRows,
		], {
			align: ['', 'r', 'r'],
		});

		const filesTable = markdownTable([
			['File', `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
			...fileRows.map(mapFileRow),
		], {
			align: ['', 'r', 'r'],
		});

		autoCollapseSection = `<details><summary>Show files (${fileRows.length} files)</summary>\n\n${filesTable}\n</details>`;
	} else {
		table = markdownTable([
			['File', `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
			...fileRows.map(mapFileRow),
			...totalRows,
		], {
			align: ['', 'r', 'r'],
		});
	}

	let unchangedTable = '';
	if (unchangedFiles === 'collapse' && unchanged.length > 0) {
		unchangedTable = markdownTable([
			['File', `Size${sizeHeadingLabel}`],
			...unchanged.map(file => [
				file.label,
				listSizes(displaySizes, p => c(byteSize(file.base[p]))),
			]),
		], {
			align: ['', 'r'],
		});

		unchangedTable = `<details><summary>Unchanged files</summary>\n\n${unchangedTable}\n</details>`;
	}

	let hiddenTable = '';
	if (hidden.length > 0) {
		hiddenTable = markdownTable([
			['File', `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
			...hidden.map(file => [
				file.label,
				file.base && file.base.size
					? listSizes(displaySizes, p => c(byteSize(file.base[p])))
					: '—',
				file.head && file.head.size
					? listSizes(
						displaySizes,
						p => (file.base && file.base[p] ? sup(formatDelta(file.diff[p])) : '') + c(byteSize(file.head[p])),
					)
					: '—',
			]),
		], {
			align: ['', 'r', 'r'],
		});

		hiddenTable = `<details><summary>Hidden files</summary>\n\n${hiddenTable}\n</details>`;
	}

	const heading = title || '📊 Package size report';

	return outdent`
	### ${heading}&nbsp;&nbsp;&nbsp;<kbd>${formatDelta(regressionData.diff.size) || 'No changes'}</kbd>

	${table}

	${autoCollapseSection}

	${unchangedTable}

	${hiddenTable}
	`;
}

export default generateComment;
