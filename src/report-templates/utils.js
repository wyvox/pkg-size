import { partition } from 'lodash-es';
import globToRegExp from 'glob-to-regexp';

function partionHidden(hideFilesGlob, files) {
	if (!hideFilesGlob) {
		return [[], files];
	}
	const hideFilesPtrn = globToRegExp(hideFilesGlob, { extended: true });
	return partition(files, file => hideFilesPtrn.test(file.path));
}

/**
 * Create a function that strips hashes from file paths for comparison purposes.
 * @param {string} [regex] - Regular expression pattern to match hashes
 * @returns {((filePath: string) => string) | undefined}
 */
function createStripHash(regex) {
	if (!regex) {
		return undefined;
	}
	const pattern = new RegExp(regex);
	return function (filePath) {
		return filePath.replace(pattern, (str, ...hashes) => {
			hashes = hashes.slice(0, -2).filter(c => c != null);
			if (hashes.length) {
				for (let i = 0; i < hashes.length; i++) {
					const hash = hashes[i] || '';
					str = str.replace(hash, '*'.repeat(hash.length));
				}
				return str;
			}
			return '';
		});
	};
}

function getSizeLabels(displaySizes) {
	if (displaySizes.length === 1 && displaySizes[0].property === 'size') {
		return '';
	}
	return ` (${displaySizes.map(s => s.label).join(' / ')})`;
}

const supportedSizes = {
	uncompressed: {
		label: 'Size',
		property: 'size',
	},
	gzip: {
		label: 'Gzip',
		property: 'sizeGzip',
	},
	brotli: {
		label: 'Brotli',
		property: 'sizeBrotli',
	},
};

function parseDisplaySize(displaySize) {
	return displaySize
		.split(',')
		.map(s => s.trim())
		.filter(s => supportedSizes.hasOwnProperty(s)) // eslint-disable-line no-prototype-builtins
		.map(s => supportedSizes[s]);
}

const listSizes = (displaySizes, callback) => displaySizes
	.map(({ property }) => callback(property))
	.join(' / ');

function sortFiles(files, sortBy, sortOrder) {
	files.sort((a, b) => (b[sortBy] - a[sortBy]) || (a.path.localeCompare(b.path)));
	if (sortOrder === 'asc') {
		files.reverse();
	}
}

export {
	partionHidden,
	getSizeLabels,
	parseDisplaySize,
	listSizes,
	sortFiles,
	createStripHash,
};
