import { partition, round } from 'lodash-es';
import {
	partionHidden,
	sortFiles,
	createStripHash,
	formatHashedPath,
	structuralHashKey,
} from '../utils.js';

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

const c = string => `\`${string}\``;

/**
 * Display path used to build a visible label. Prefers `relativePath`
 * (set by `slicePkgData`) so labels in path-scoped sections render
 * relative to the section's prefix, falling back to the cwd-relative
 * `path` when no slicing happened.
 */
function displayPathFor(file) {
	return file.relativePath || file.path;
}

function processPkgFiles(fileMap, type, pkgData, normalizeFilePath, stripHash) {
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

			// When the configured strip-hash regex collapsed two different
			// paths into one entry, rewrite the visible label to use the
			// `{hash}` placeholder so reviewers see a single canonical row
			// rather than the HEAD path's specific hash.
			if (stripHash && entry.head.path !== entry.base.path) {
				const headDisplay = displayPathFor(entry.head);
				entry.label = c(formatHashedPath(headDisplay, stripHash));
			}
		}
	}
}

/**
 * Pair up entries that ended up with only `head` or only `base` (i.e. files
 * the primary strip-hash pass did not match) when their structural shape is
 * unambiguously the same. Two entries are paired iff:
 *
 *   - their parent directory and extension match, and
 *   - their filenames agree after collapsing any `[.-]<hashy-run>` segments,
 *     and
 *   - exactly one head-only and one base-only entry share that bucket.
 *
 * If a bucket has more than one head-only or more than one base-only entry,
 * leaving them alone is the safe choice — that's the "possible collision"
 * case we want to avoid mismatching.
 */
function structurallyPairUnmatched(fileMap) {
	const buckets = new Map();
	const keysByEntry = new Map();

	for (const [key, entry] of Object.entries(fileMap)) {
		if (entry.head && entry.base) {
			continue;
		}
		const side = entry.head ? 'head' : 'base';
		const file = entry[side];
		const bucketKey = structuralHashKey(file.path);
		let bucket = buckets.get(bucketKey);
		if (!bucket) {
			bucket = { head: [], base: [] };
			buckets.set(bucketKey, bucket);
		}
		bucket[side].push(key);
		keysByEntry.set(key, bucketKey);
	}

	for (const bucket of buckets.values()) {
		if (bucket.head.length !== 1 || bucket.base.length !== 1) {
			continue;
		}

		const headKey = bucket.head[0];
		const baseKey = bucket.base[0];
		const headEntry = fileMap[headKey];
		const baseEntry = fileMap[baseKey];

		// Merge into the head entry, drop the base entry.
		headEntry.base = baseEntry.base;
		headEntry.diff = calculateDiff(headEntry.head, headEntry.base);
		const headDisplay = displayPathFor(headEntry.head);
		headEntry.label = c(structuralHashKey(headDisplay, '{hash}'));
		headEntry.path = headEntry.head.path;
		delete fileMap[baseKey];
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
	processPkgFiles(fileMap, 'head', head, normalizeFilePath, stripHash);
	processPkgFiles(fileMap, 'base', base, normalizeFilePath, stripHash);

	// Safety net: pair up any leftover added/removed files whose structural
	// shape unambiguously matches. Catches hashes the configured `strip-hash`
	// regex didn't recognize.
	structurallyPairUnmatched(fileMap);

	const allFiles = Object.values(fileMap);

	sortFiles(allFiles, sortBy, sortOrder);

	const [hidden, files] = partionHidden(hideFiles, allFiles);
	const [unchanged, changed] = partition(
		files,
		file => (file.diff && file.diff.size && Math.abs(file.diff.size.delta) < ignoreThreshold),
	);

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
