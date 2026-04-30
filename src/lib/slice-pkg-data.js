/**
 * Parse the `paths` action input into a list of `{ label, prefix }` entries.
 *
 * Input is a newline-separated list. Each line may optionally use a
 * `Label: prefix` form to provide a friendly heading. Lines that are empty
 * or start with `#` are ignored.
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

		const colonIndex = line.indexOf(':');
		let label;
		let prefix;
		if (colonIndex > -1) {
			label = line.slice(0, colonIndex).trim();
			prefix = line.slice(colonIndex + 1).trim();
		} else {
			prefix = line;
			label = line;
		}

		// Normalize: drop trailing slashes so "dist/dev/" matches "dist/dev/foo.js"
		prefix = prefix.replace(/\/+$/, '');

		if (!prefix) {
			continue;
		}

		if (!label) {
			label = prefix;
		}

		entries.push({ label, prefix });
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
 * Slice a `pkgData` object down to only the files that fall under `prefix`,
 * recomputing the aggregated size totals (`size`, `sizeGzip`, `sizeBrotli`).
 *
 * `tarballSize` is package-level and cannot be derived from a subset of files,
 * so it is preserved from the input.
 *
 * @param {object} pkgData
 * @param {string} prefix
 * @returns {object} A new pkgData-shaped object.
 */
function slicePkgData(pkgData, prefix) {
	const files = pkgData.files.filter(file => matchesPrefix(file.path, prefix));

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

export { parsePathsInput, matchesPrefix, slicePkgData };
export default slicePkgData;
