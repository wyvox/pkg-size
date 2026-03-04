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

test('comparePackages without stripHash treats hashed filenames as separate files', () => {
	const head = makePkgData([['assets/app-NewHash1.js', 1100]]);
	const base = makePkgData([['assets/app-OldHash1.js', 1000]]);

	const result = comparePackages(head, base);
	const allFiles = [
		...result.files.changed,
		...result.files.unchanged,
	];

	// Without stripHash, HEAD file (added) and BASE file (removed) are separate entries
	assert.equal(allFiles.length, 2);
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

test('comparePackages preserves original HEAD path/label when stripHash matches', () => {
	const head = makePkgData([['assets/app-NewHash1.js', 1100]]);
	const base = makePkgData([['assets/app-OldHash1.js', 1000]]);

	const result = comparePackages(head, base, {
		stripHash: '[.-]([0-9a-zA-Z]{8,})[.-]',
		ignoreThreshold: 0,
	});

	const file = result.files.changed[0];
	// The entry uses the HEAD file's original path/label
	assert.equal(file.path, 'assets/app-NewHash1.js');
	assert.equal(file.label, 'assets/app-NewHash1.js');
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
