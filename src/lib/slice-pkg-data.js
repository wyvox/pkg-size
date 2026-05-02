/**
 * Parse the `paths` action input into a list of `{ label, prefix }` entries.
 *
 * Input is a newline-separated list of path prefixes. Lines that are empty or
 * start with `#` are ignored. The `label` is always the prefix itself — the
 * heading is derived from the filter so it can be trusted to reflect what was
 * actually matched.
 *
 * @param {string | undefined | null} input
 * @returns {Array<{ label: string, prefix: string }>}
 */
function parsePathsInput(input) {
	if (!input) {
		return [];
	}

	const entries = [];
	for (const rawLine of String(input).split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) {
			continue;
		}

		// Normalize: drop trailing slashes so "dist/dev/" matches "dist/dev/foo.js"
		const prefix = line.replace(/\/+$/, '');
		if (!prefix) {
			continue;
		}

		entries.push({ label: prefix, prefix });
	}

	return entries;
}

/**
 * Return true if `filePath` falls under the given `prefix`. Matches when the
 * path is exactly equal to the prefix or is a child path (i.e. starts with
 * `prefix + "/"`).
 *
 * @param {string} filePath
 * @param {string} prefix
 * @returns {boolean}
 */
function matchesPrefix(filePath, prefix) {
	if (!prefix) {
		return false;
	}
	if (filePath === prefix) {
		return true;
	}
	return filePath.startsWith(`${prefix}/`);
}

/**
 * Compute a path relative to the given prefix, prepended with `./`.
 *
 * - For an exact match, returns `./`.
 * - For child paths, returns `./` plus the portion after `prefix/`.
 * - For paths that don't fall under the prefix, returns the original path.
 *
 * @param {string} filePath
 * @param {string} prefix
 * @returns {string}
 */
function relativeToPrefix(filePath, prefix) {
	if (!prefix) {
		return filePath;
	}
	if (filePath === prefix) {
		return './';
	}
	if (filePath.startsWith(`${prefix}/`)) {
		return `./${filePath.slice(prefix.length + 1)}`;
	}
	return filePath;
}

/**
 * Rewrite a file label produced by `build-ref` so its visible text shows
 * `visibleText` while preserving the link href when one is present.
 *
 * Input shape is one of:
 *   - `` `<path>` ``
 *   - `` [`<path>`](<href>) ``
 *
 * Anything else is returned unchanged.
 *
 * @param {string} label
 * @param {string} visibleText
 * @returns {string}
 */
function rewriteLabelVisibleText(label, visibleText) {
	if (typeof label !== 'string') {
		return label;
	}
	const linkMatch = label.match(/^\[`([^`]+)`\]\((.+)\)$/);
	if (linkMatch) {
		return `[\`${visibleText}\`](${linkMatch[2]})`;
	}
	const codeMatch = label.match(/^`([^`]+)`$/);
	if (codeMatch) {
		return `\`${visibleText}\``;
	}
	return label;
}

/**
 * Slice a `pkgData` object down to only the files that fall under `prefix`,
 * recomputing the aggregated size totals (`size`, `sizeGzip`, `sizeBrotli`).
 *
 * Each file in the returned slice gets a `relativePath` (path relative to
 * `prefix`, with a `./` leader) and a `label` rewritten to show that relative
 * path. The original `path` is preserved so cross-section behavior, sorting,
 * and any external `pathsReports` output stay stable.
 *
 * `tarballSize` is package-level and cannot be derived from a subset of files,
 * so it is preserved from the input.
 *
 * @param {object} pkgData
 * @param {string} prefix
 * @returns {object} A new pkgData-shaped object.
 */
function slicePkgData(pkgData, prefix) {
	const files = pkgData.files
		.filter(file => matchesPrefix(file.path, prefix))
		.map((file) => {
			const relativePath = relativeToPrefix(file.path, prefix);
			return {
				...file,
				relativePath,
				label: rewriteLabelVisibleText(file.label, relativePath),
			};
		});

	let size = 0;
	let sizeGzip = 0;
	let sizeBrotli = 0;
	for (const file of files) {
		size += file.size || 0;
		sizeGzip += file.sizeGzip || 0;
		sizeBrotli += file.sizeBrotli || 0;
	}

	return {
		...pkgData,
		files,
		size,
		sizeGzip,
		sizeBrotli,
	};
}

export {
	parsePathsInput, matchesPrefix, slicePkgData, relativeToPrefix, rewriteLabelVisibleText,
};
export default slicePkgData;
