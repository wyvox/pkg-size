import globToRegExp from 'glob-to-regexp';

function partitionHidden(hideFilesGlob, files) {
	if (!hideFilesGlob) {
		return [[], files];
	}
	const hideFilesPtrn = globToRegExp(hideFilesGlob, { extended: true });
	const hidden = [];
	const visible = [];
	for (const file of files) {
		(hideFilesPtrn.test(file.path) ? hidden : visible).push(file);
	}
	return [hidden, visible];
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
		return filePath.replace(pattern, (match, ...args) => {
			const captureGroups = args.slice(0, -2).filter(g => g != null);
			if (captureGroups.length) {
				let result = match;
				for (const group of captureGroups) {
					result = result.replace(group, '*'.repeat(group.length));
				}
				return result;
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
		.filter(s => Object.hasOwn(supportedSizes, s))
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
	partitionHidden,
	getSizeLabels,
	parseDisplaySize,
	listSizes,
	sortFiles,
	createStripHash,
};
