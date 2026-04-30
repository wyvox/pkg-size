import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePathsInput, matchesPrefix, slicePkgData } from './slice-pkg-data.js';

test('parsePathsInput: returns [] for empty/falsy input', () => {
	assert.deepEqual(parsePathsInput(''), []);
	assert.deepEqual(parsePathsInput(undefined), []);
	assert.deepEqual(parsePathsInput(null), []);
});

test('parsePathsInput: parses bare prefixes', () => {
	const result = parsePathsInput('dist/dev\ndist/prod');
	assert.deepEqual(result, [
		{ label: 'dist/dev', prefix: 'dist/dev' },
		{ label: 'dist/prod', prefix: 'dist/prod' },
	]);
});

test('parsePathsInput: ignores blank lines and # comments', () => {
	const result = parsePathsInput('\n# comment\ndist/dev\n   \n');
	assert.deepEqual(result, [{ label: 'dist/dev', prefix: 'dist/dev' }]);
});

test('parsePathsInput: strips trailing slashes from prefix', () => {
	const result = parsePathsInput('dist/dev/\nfoo/');
	assert.deepEqual(result, [
		{ label: 'dist/dev', prefix: 'dist/dev' },
		{ label: 'foo', prefix: 'foo' },
	]);
});

test('parsePathsInput: handles CRLF line endings', () => {
	const result = parsePathsInput('dist/dev\r\ndist/prod');
	assert.equal(result.length, 2);
	assert.equal(result[1].prefix, 'dist/prod');
});

test('matchesPrefix: exact equality matches', () => {
	assert.equal(matchesPrefix('dist/dev', 'dist/dev'), true);
});

test('matchesPrefix: child paths match', () => {
	assert.equal(matchesPrefix('dist/dev/index.js', 'dist/dev'), true);
	assert.equal(matchesPrefix('dist/dev/sub/a.js', 'dist/dev'), true);
});

test('matchesPrefix: sibling paths with shared name prefix do NOT match', () => {
	// Without "/" boundary, `dist/dev2/...` would erroneously match `dist/dev`.
	assert.equal(matchesPrefix('dist/dev2/index.js', 'dist/dev'), false);
	assert.equal(matchesPrefix('dist/development.js', 'dist/dev'), false);
});

test('matchesPrefix: empty prefix never matches', () => {
	assert.equal(matchesPrefix('anything.js', ''), false);
});

test('slicePkgData: filters files and recomputes totals', () => {
	const pkgData = {
		files: [
			{ path: 'dist/dev/a.js', size: 100, sizeGzip: 40, sizeBrotli: 30 },
			{ path: 'dist/dev/b.js', size: 200, sizeGzip: 80, sizeBrotli: 60 },
			{ path: 'dist/prod/a.js', size: 1000, sizeGzip: 400, sizeBrotli: 300 },
			{ path: 'dist/prod/b.js', size: 2000, sizeGzip: 800, sizeBrotli: 600 },
		],
		size: 3300,
		sizeGzip: 1320,
		sizeBrotli: 990,
		tarballSize: 5000,
	};

	const dev = slicePkgData(pkgData, 'dist/dev');
	assert.equal(dev.files.length, 2);
	assert.equal(dev.size, 300);
	assert.equal(dev.sizeGzip, 120);
	assert.equal(dev.sizeBrotli, 90);
	// tarballSize is package-level and preserved as-is.
	assert.equal(dev.tarballSize, 5000);

	const prod = slicePkgData(pkgData, 'dist/prod');
	assert.equal(prod.files.length, 2);
	assert.equal(prod.size, 3000);
	assert.equal(prod.sizeGzip, 1200);
	assert.equal(prod.sizeBrotli, 900);
});

test('slicePkgData: returns empty file list when nothing matches', () => {
	const pkgData = {
		files: [{ path: 'dist/dev/a.js', size: 100, sizeGzip: 40, sizeBrotli: 30 }],
		size: 100,
		sizeGzip: 40,
		sizeBrotli: 30,
		tarballSize: 1000,
	};
	const result = slicePkgData(pkgData, 'dist/missing');
	assert.deepEqual(result.files, []);
	assert.equal(result.size, 0);
	assert.equal(result.sizeGzip, 0);
	assert.equal(result.sizeBrotli, 0);
});

test('slicePkgData: preserves additional pkgData fields (e.g. ref)', () => {
	const pkgData = {
		files: [{ path: 'dist/dev/a.js', size: 100, sizeGzip: 40, sizeBrotli: 30 }],
		size: 100,
		sizeGzip: 40,
		sizeBrotli: 30,
		tarballSize: 1000,
		ref: { sha: 'abc' },
	};
	const result = slicePkgData(pkgData, 'dist/dev');
	assert.deepEqual(result.ref, { sha: 'abc' });
});
