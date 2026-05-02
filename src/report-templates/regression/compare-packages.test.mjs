import { test } from 'node:test';
import assert from 'node:assert/strict';
import comparePackages from './compare-packages.js';

function makePkgData(files, totals = {}) {
	return {
		files: files.map(([path, size = 1000, sizeGzip = 500, sizeBrotli = 400]) => ({
			path,
			label: path,
			size,
			sizeGzip,
			sizeBrotli,
		})),
		size: totals.size ?? 1000,
		sizeGzip: totals.sizeGzip ?? 500,
		sizeBrotli: totals.sizeBrotli ?? 400,
		tarballSize: totals.tarballSize ?? 2000,
	};
}

test('comparePackages without stripHash structurally pairs unambiguous hashed pairs', () => {
	const head = makePkgData([['assets/app-NewHash1.js', 1100]]);
	const base = makePkgData([['assets/app-OldHash1.js', 1000]]);

	const result = comparePackages(head, base);
	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	// Even without stripHash, the structural fallback pairs up the
	// unambiguous head-only/base-only pair so the report shows a single row.
	assert.equal(allFiles.length, 1);
	assert.equal(allFiles[0].diff.size.delta, 100);
});

test('comparePackages with stripHash matches files differing only in hash', () => {
	const head = makePkgData([['assets/app-NewHash1.js', 1100]]);
	const base = makePkgData([['assets/app-OldHash1.js', 1000]]);

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 0,
	});

	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	// With stripHash, both resolve to same normalized key — one entry with a diff
	assert.equal(allFiles.length, 1);
	assert.equal(allFiles[0].diff.size.delta, 100);
});

test('comparePackages rewrites label to use {hash} placeholder when stripHash pairs different paths', () => {
	const head = makePkgData([['assets/app-NewHash1.js', 1100]]);
	const base = makePkgData([['assets/app-OldHash1.js', 1000]]);

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 0,
	});

	const file = result.files.changed[0];
	// The entry's `path` keeps the HEAD file's original path, but `label`
	// shows the canonical `{hash}` form so reviewers see one row per file.
	assert.equal(file.path, 'assets/app-NewHash1.js');
	assert.equal(file.label, '`assets/app-{hash}.js`');
});

test('comparePackages keeps original label when head and base paths are identical', () => {
	const head = makePkgData([['dist/main.js', 1100]]);
	const base = makePkgData([['dist/main.js', 1000]]);

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 0,
	});

	const file = result.files.changed[0];
	// Same path on both sides — no rewrite, original label preserved.
	assert.equal(file.label, 'dist/main.js');
});

test('comparePackages structural fallback uses {hash} placeholder in label', () => {
	const head = makePkgData([['assets/app-NewHash1.js', 1100]]);
	const base = makePkgData([['assets/app-OldHash1.js', 1000]]);

	const result = comparePackages(head, base, { ignoreThreshold: 0 });
	const file = result.files.changed[0];

	assert.equal(file.label, '`assets/app-{hash}.js`');
});

test('comparePackages structural fallback does not pair when bucket is ambiguous', () => {
	// Two head-only and two base-only files share the same structural
	// bucket — we cannot tell which goes with which, so leave them apart.
	const head = makePkgData([
		['assets/app-AAAAAAAA.js', 1000],
		['assets/app-BBBBBBBB.js', 1000],
	]);
	const base = makePkgData([
		['assets/app-CCCCCCCC.js', 1000],
		['assets/app-DDDDDDDD.js', 1000],
	]);

	const result = comparePackages(head, base, { ignoreThreshold: 0 });
	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	// All four entries remain — none paired up.
	assert.equal(allFiles.length, 4);
	for (const file of allFiles) {
		assert.ok(!file.diff, 'unmatched entries should have no diff');
	}
});

test('comparePackages structural fallback does not pair files with different stems', () => {
	const head = makePkgData([['dist/foo.js', 1000]]);
	const base = makePkgData([['dist/bar.js', 1000]]);

	const result = comparePackages(head, base, { ignoreThreshold: 0 });
	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	// Different stems → different structural keys → no pair.
	assert.equal(allFiles.length, 2);
});

test('comparePackages structural fallback complements stripHash for missed cases', () => {
	// `app-abc1` is too short for the default 8-char stripHash regex.
	// The structural fallback (4-char threshold) catches it.
	const head = makePkgData([
		['assets/main-abc1.js', 1100],
		['assets/other.js', 1000],
	]);
	const base = makePkgData([
		['assets/main-xyz9.js', 1000],
		['assets/other.js', 1000],
	]);

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 0,
	});
	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	// `other.js` matches by exact path, the hashed pair matches via fallback.
	assert.equal(allFiles.length, 2);
	const hashed = allFiles.find(f => f.label.includes('{hash}'));
	assert.ok(hashed, 'fallback-paired entry should use {hash} placeholder');
	assert.equal(hashed.diff.size.delta, 100);
});

test('comparePackages with relativePath uses it for the {hash} label', () => {
	const head = {
		files: [{
			path: 'smoke-tests/dist/assets/main-NewHash1.js',
			relativePath: './assets/main-NewHash1.js',
			label: '`./assets/main-NewHash1.js`',
			size: 1100,
			sizeGzip: 500,
			sizeBrotli: 400,
		}],
		size: 1100,
		sizeGzip: 500,
		sizeBrotli: 400,
		tarballSize: 2000,
	};
	const base = {
		files: [{
			path: 'smoke-tests/dist/assets/main-OldHash1.js',
			relativePath: './assets/main-OldHash1.js',
			label: '`./assets/main-OldHash1.js`',
			size: 1000,
			sizeGzip: 500,
			sizeBrotli: 400,
		}],
		size: 1000,
		sizeGzip: 500,
		sizeBrotli: 400,
		tarballSize: 2000,
	};

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 0,
	});

	const file = result.files.changed[0];
	assert.equal(file.label, '`./assets/main-{hash}.js`');
});

test('comparePackages with stripHash still shows diff for files unchanged by hash', () => {
	const head = makePkgData([
		['assets/app-NewHash1.js', 1000],
		['assets/other.js', 1000],
	]);
	const base = makePkgData([
		['assets/app-OldHash1.js', 1000],
		['assets/other.js', 1000],
	]);

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 100,
	});

	// Both files have same size, so both should be unchanged
	assert.equal(result.files.changed.length, 0);
	assert.equal(result.files.unchanged.length, 2);
});

test('comparePackages without stripHash option uses file paths as-is', () => {
	const head = makePkgData([['dist/main.js', 1100]]);
	const base = makePkgData([['dist/main.js', 1000]]);

	const result = comparePackages(head, base, { ignoreThreshold: 0 });
	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	assert.equal(allFiles.length, 1);
	assert.equal(allFiles[0].diff.size.delta, 100);
});
