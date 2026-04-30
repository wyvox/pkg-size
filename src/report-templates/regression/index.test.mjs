import { test } from 'node:test';
import assert from 'node:assert/strict';
import generateComment from './index.js';

function makePkgData(files, totals = {}) {
	return {
		files: files.map(([path, size = 1000, sizeGzip = 500, sizeBrotli = 400]) => ({
			path,
			label: path,
			size,
			sizeGzip,
			sizeBrotli,
		})),
		size: totals.size ?? files.reduce((sum, [, s = 1000]) => sum + s, 0),
		sizeGzip: totals.sizeGzip ?? 500,
		sizeBrotli: totals.sizeBrotli ?? 400,
		tarballSize: totals.tarballSize ?? 2000,
	};
}

function makeFiles(count, prefix = 'file', sizeDelta = 200) {
	return Array.from({ length: count }, (_, i) => [`dist/${prefix}${i}.js`, 1000 + sizeDelta, 500, 400]);
}

test('regression: auto-collapse is not triggered when file rows <= 20', () => {
	const headPkgData = makePkgData(makeFiles(20));
	const basePkgData = makePkgData(makeFiles(20, 'file', 0));

	const output = generateComment({
		headPkgData,
		basePkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		unchangedFiles: 'collapse',
		ignoreThreshold: 0,
		autoCollapse: true,
	});

	assert.ok(!output.includes('<details><summary>Show files'), 'Should not auto-collapse when <= 20 rows');
	assert.ok(output.includes('**Total**'), 'Total row should be present');
	assert.ok(output.includes('**Tarball size**'), 'Tarball size row should be present');
});

test('regression: auto-collapse is triggered when file rows > 20', () => {
	const headPkgData = makePkgData(makeFiles(21));
	const basePkgData = makePkgData(makeFiles(21, 'file', 0));

	const output = generateComment({
		headPkgData,
		basePkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		unchangedFiles: 'collapse',
		ignoreThreshold: 0,
		autoCollapse: true,
	});

	assert.ok(output.includes('<details><summary>Show files (21 files)</summary>'), 'Should auto-collapse when > 20 rows');
	assert.ok(output.includes('**Total**'), 'Total row should always be visible');
	assert.ok(output.includes('**Tarball size**'), 'Tarball size row should always be visible');
});

test('regression: auto-collapse is not triggered when autoCollapse is false, even with > 20 rows', () => {
	const headPkgData = makePkgData(makeFiles(25));
	const basePkgData = makePkgData(makeFiles(25, 'file', 0));

	const output = generateComment({
		headPkgData,
		basePkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		unchangedFiles: 'collapse',
		ignoreThreshold: 0,
		autoCollapse: false,
	});

	assert.ok(!output.includes('<details><summary>Show files'), 'Should not auto-collapse when autoCollapse is false');
	assert.ok(output.includes('**Total**'), 'Total row should be present');
	assert.ok(output.includes('**Tarball size**'), 'Tarball size row should be present');
});

test('regression: total rows appear outside the details section when auto-collapsing', () => {
	const headPkgData = makePkgData(makeFiles(21));
	const basePkgData = makePkgData(makeFiles(21, 'file', 0));

	const output = generateComment({
		headPkgData,
		basePkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		unchangedFiles: 'collapse',
		ignoreThreshold: 0,
		autoCollapse: true,
	});

	// The total rows should appear before the <details> section
	const detailsIndex = output.indexOf('<details>');
	const totalIndex = output.indexOf('**Total**');
	const tarballIndex = output.indexOf('**Tarball size**');

	assert.ok(totalIndex < detailsIndex, 'Total row should appear before the collapsed details section');
	assert.ok(tarballIndex < detailsIndex, 'Tarball size row should appear before the collapsed details section');
});

test('regression: file names appear inside the details section when auto-collapsing', () => {
	const headPkgData = makePkgData(makeFiles(21));
	const basePkgData = makePkgData(makeFiles(21, 'file', 0));

	const output = generateComment({
		headPkgData,
		basePkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		unchangedFiles: 'collapse',
		ignoreThreshold: 0,
		autoCollapse: true,
	});

	const detailsStart = output.indexOf('<details><summary>Show files');
	const detailsEnd = output.indexOf('</details>');
	const detailsContent = output.slice(detailsStart, detailsEnd);

	assert.ok(detailsContent.includes('dist/file0.js'), 'File names should appear inside the details section');
});

test('regression: title overrides default heading and includeTarball=false hides tarball row', () => {
const headPkgData = makePkgData([['dist/dev/a.js', 1200]]);
const basePkgData = makePkgData([['dist/dev/a.js', 1000]]);

const output = generateComment({
headPkgData,
basePkgData,
displaySize: 'uncompressed',
sortBy: 'delta',
sortOrder: 'desc',
unchangedFiles: 'collapse',
ignoreThreshold: 0,
autoCollapse: true,
title: '📊 Package size report — Dev',
includeTarball: false,
});

assert.ok(output.includes('📊 Package size report — Dev'), 'Custom title should be rendered');
assert.ok(output.includes('**Total**'), 'Total row should still be present');
assert.ok(!output.includes('**Tarball size**'), 'Tarball size row should be omitted');
});
