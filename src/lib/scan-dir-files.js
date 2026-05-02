import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import zlib from 'zlib';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

async function measureFile(absPath) {
const content = await fs.promises.readFile(absPath);
const [gzipBuf, brotliBuf] = await Promise.all([
gzip(content),
brotliCompress(content),
]);
return {
size: content.length,
sizeGzip: gzipBuf.length,
sizeBrotli: brotliBuf.length,
};
}

async function collectFiles(absDir) {
const results = [];
const entries = await fs.promises.readdir(absDir, { withFileTypes: true });
for (const entry of entries) {
const fullPath = path.join(absDir, entry.name);
if (entry.isDirectory()) {
// eslint-disable-next-line no-await-in-loop
results.push(...(await collectFiles(fullPath)));
} else if (entry.isFile()) {
results.push(fullPath);
}
}
return results;
}

/**
 * Scan the filesystem under the given path prefixes (relative to cwd) and
 * return an array of `{ path, size, sizeGzip, sizeBrotli }` objects.
 * Paths that do not exist are silently skipped. Duplicate files (from
 * overlapping prefixes) are de-duplicated by relative path.
 *
 * @param {string[]} prefixes - Array of path prefixes relative to cwd
 * @param {string} cwd - Base directory
 * @returns {Promise<Array<{path: string, size: number, sizeGzip: number, sizeBrotli: number}>>}
 */
async function scanDirFiles(prefixes, cwd) {
const seen = new Set();
const files = [];

for (const prefix of prefixes) {
const absPrefix = path.resolve(cwd, prefix);
// eslint-disable-next-line no-await-in-loop
const stat = await fs.promises.stat(absPrefix).catch(() => null);
if (!stat) {
continue;
}

// eslint-disable-next-line no-await-in-loop
const absPaths = stat.isFile() ? [absPrefix] : (await collectFiles(absPrefix));

// eslint-disable-next-line no-await-in-loop
await Promise.all(absPaths.map(async (absFile) => {
const relPath = path.relative(cwd, absFile).replace(/\\/g, '/');
if (seen.has(relPath)) {
return;
}
seen.add(relPath);
const sizes = await measureFile(absFile);
files.push({ path: relPath, ...sizes });
}));
}

return files;
}

export default scanDirFiles;
