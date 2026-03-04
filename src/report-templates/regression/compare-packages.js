import {
	partitionHidden,
	sortFiles,
	createStripHash,
} from '../utils.js';

const round = (number, precision) => {
	const factor = 10 ** precision;
	return Math.round(number * factor) / factor;
};

const percent = (fraction) => {
	if (fraction < 0.001) { // 0.09% and lower
		fraction = round(fraction, 4);
	} else if (fraction < 0.01) { // 0.9% and lower
		fraction = round(fraction, 3);
	} else { // 1% and higher
		fraction = round(fraction, 2);
	}

	return fraction.toLocaleString(undefined, {
		style: 'percent',
		maximumSignificantDigits: 3,
	});
};

function calculateDiffBy(head, base, property) {
	const delta = head[property] - base[property];
	return {
		delta,
		percent: percent(delta / base[property]),
	};
}

function calculateDiff(head, base) {
	return {
		size: calculateDiffBy(head, base, 'size'),
		sizeGzip: calculateDiffBy(head, base, 'sizeGzip'),
		sizeBrotli: calculateDiffBy(head, base, 'sizeBrotli'),
	};
}

function processPkgFiles(fileMap, type, pkgData, normalizeFilePath) {
	for (const file of pkgData.files) {
		const key = normalizeFilePath ? normalizeFilePath(file.path) : file.path;
		if (!fileMap[key]) {
			fileMap[key] = {
				path: file.path,
				label: file.label,
			};
		}

		const entry = fileMap[key];
		entry[type] = file;

		if (entry.head && entry.base) {
			entry.diff = calculateDiff(entry.head, entry.base);
		}
	}
}

function comparePackages(head, base, {
	sortBy,
	sortOrder,
	hideFiles,
	ignoreThreshold = 100,
	stripHash,
} = {}) {
	const fileMap = {};
	const normalizeFilePath = createStripHash(stripHash);
	processPkgFiles(fileMap, 'head', head, normalizeFilePath);
	processPkgFiles(fileMap, 'base', base, normalizeFilePath);

	const allFiles = Object.values(fileMap);

	sortFiles(allFiles, sortBy, sortOrder);

	const [hidden, files] = partitionHidden(hideFiles, allFiles);
	const unchanged = [];
	const changed = [];
	for (const file of files) {
		(file.diff && file.diff.size && Math.abs(file.diff.size.delta) < ignoreThreshold ? unchanged : changed).push(file);
	}

	return {
		head,
		base,
		diff: {
			...calculateDiff(head, base),
			tarballSize: calculateDiffBy(head, base, 'tarballSize'),
		},
		files: {
			changed,
			unchanged,
			hidden,
		},
	};
}

export default comparePackages;
