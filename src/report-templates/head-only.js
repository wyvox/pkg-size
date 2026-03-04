import byteSize from 'byte-size';
import { markdownTable } from 'markdown-table';
import outdent from 'outdent';
import { c, strong } from '../lib/markdown.js';
import {
	partionHidden,
	getSizeLabels,
	parseDisplaySize,
	listSizes,
	sortFiles,
} from './utils.js';

const AUTO_COLLAPSE_THRESHOLD = 20;

function headOnly({
	headPkgData,
	hideFiles,
	displaySize,
	sortBy,
	sortOrder,
	autoCollapse,
}) {
	const displaySizes = parseDisplaySize(displaySize);
	const sizeHeadingLabel = getSizeLabels(displaySizes);

	sortFiles(headPkgData.files, sortBy, sortOrder);
	const [hidden, files] = partionHidden(hideFiles, headPkgData.files);

	const mapFileRow = file => [
		file.label,
		listSizes(displaySizes, p => c(byteSize(file[p]))),
	];

	const totalRows = [
		[
			strong('Total'),
			listSizes(displaySizes, p => c(byteSize(headPkgData[p]))),
		],
		[
			strong('Tarball size'),
			c(byteSize(headPkgData.tarballSize)),
		],
	];

	const shouldAutoCollapse = autoCollapse && files.length > AUTO_COLLAPSE_THRESHOLD;

	let table;
	let autoCollapseSection = '';

	if (shouldAutoCollapse) {
		table = markdownTable([
			['File', `Size${sizeHeadingLabel}`],
			...totalRows,
		], {
			align: ['', 'r'],
		});

		const filesTable = markdownTable([
			['File', `Size${sizeHeadingLabel}`],
			...files.map(mapFileRow),
		], {
			align: ['', 'r'],
		});

		autoCollapseSection = `<details><summary>Show files (${files.length} files)</summary>\n\n${filesTable}\n</details>`;
	} else {
		table = markdownTable([
			['File', `Size${sizeHeadingLabel}`],
			...files.map(mapFileRow),
			...totalRows,
		], {
			align: ['', 'r'],
		});
	}

	let hiddenTable = '';
	if (hidden.length > 0) {
		hiddenTable = markdownTable([
			['File', `Size${sizeHeadingLabel}`],
			...hidden.map(file => [
				file.label,
				listSizes(displaySizes, p => c(byteSize(file[p]))),
			]),
		], {
			align: ['', 'r'],
		});

		hiddenTable = `<details><summary>Hidden files</summary>\n\n${hiddenTable}\n</details>`;
	}

	return outdent`
	### 📊 Package size report

	${table}

	${autoCollapseSection}

	${hiddenTable}
	`;
}

export default headOnly;
