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

/**
 * Like `createStripHash`, but produces a human-readable path where every
 * captured hash is replaced with the literal string `{hash}` (or, if the
 * pattern has no capture group, the entire matched portion is replaced with
 * `{hash}`). Used for visible labels when head/base paths only differ by a
 * hash, so the row reads e.g. `./assets/main-{hash}.js`.
 *
 * @param {string} filePath
 * @param {string} [regex]
 * @returns {string}
 */
function formatHashedPath(filePath, regex) {
	if (!regex) {
		return filePath;
	}
	const pattern = new RegExp(regex);
	return filePath.replace(pattern, (str, ...hashes) => {
		hashes = hashes.slice(0, -2).filter(c => c != null);
		if (hashes.length) {
			for (let i = 0; i < hashes.length; i++) {
				const hash = hashes[i] || '';
				if (hash) {
					str = str.replace(hash, '{hash}');
				}
			}
			return str;
		}
		return '{hash}';
	});
}

/**
 * Structural-fallback hash collapser used to pair up files that the
 * configured `strip-hash` regex didn't match. Replaces any run of
 * `[A-Za-z0-9_-]{4,}` that is preceded by `.` or `-` (and followed by `.`,
 * `-`, or end-of-string) with a placeholder. The same shape is used both as
 * a structural pairing key and (with `placeholder = '{hash}'`) for the
 * visible label of a structurally-paired entry.
 *
 * @param {string} filePath
 * @param {string} [placeholder]
 * @returns {string}
 */
function structuralHashKey(filePath, placeholder = '*') {
	return filePath.replace(/([.-])[A-Za-z0-9_-]{4,}(?=[.-]|$)/g, `$1${placeholder}`);
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
	formatHashedPath,
	structuralHashKey,
};
