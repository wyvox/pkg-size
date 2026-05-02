import fs from 'fs';
import path from 'path';

/**
 * Find the nearest ancestor directory (starting from `prefix` and walking up
 * to the repository root at `cwd`) that contains a `package.json`. Returns
 * the relative path of that directory (e.g. `'packages/pkg-a'` or `'.'`), or
 * `null` if no `package.json` is found.
 *
 * @param {string} prefix - Path prefix relative to cwd
 * @param {string} cwd - Base directory (repository root)
 * @returns {Promise<string | null>}
 */
async function findTarballDir(prefix, cwd) {
	const parts = prefix.split('/').filter(Boolean);
	for (let i = parts.length; i >= 0; i--) {
		const dir = parts.slice(0, i).join('/') || '.';
		// eslint-disable-next-line no-await-in-loop
		const exists = await fs.promises.access(path.join(cwd, dir, 'package.json')).then(() => true, () => false);
		if (exists) {
			return dir;
		}
	}
	return null;
}

export default findTarballDir;
