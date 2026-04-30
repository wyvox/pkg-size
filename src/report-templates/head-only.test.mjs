import { test } from 'node:test';
import assert from 'node:assert/strict';
import headOnly from './head-only.js';

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

function makeFiles(count, prefix = 'file') {
	return Array.from({ length: count }, (_, i) => [`dist/${prefix}${i}.js`]);
}

test('head-only: auto-collapse is not triggered when files <= 20', () => {
	const headPkgData = makePkgData(makeFiles(20));

	const output = headOnly({
		headPkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		autoCollapse: true,
	});

	assert.ok(!output.includes('<details><summary>Show files'), 'Should not auto-collapse when <= 20 files');
	assert.ok(output.includes('**Total**'), 'Total row should be present');
	assert.ok(output.includes('**Tarball size**'), 'Tarball size row should be present');
});

test('head-only: auto-collapse is triggered when files > 20', () => {
	const headPkgData = makePkgData(makeFiles(21));

	const output = headOnly({
		headPkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		autoCollapse: true,
	});

	assert.ok(output.includes('<details><summary>Show files (21 files)</summary>'), 'Should auto-collapse when > 20 files');
	assert.ok(output.includes('**Total**'), 'Total row should always be visible');
	assert.ok(output.includes('**Tarball size**'), 'Tarball size row should always be visible');
});

test('head-only: auto-collapse is not triggered when autoCollapse is false, even with > 20 files', () => {
	const headPkgData = makePkgData(makeFiles(25));

	const output = headOnly({
		headPkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		autoCollapse: false,
	});

	assert.ok(!output.includes('<details><summary>Show files'), 'Should not auto-collapse when autoCollapse is false');
	assert.ok(output.includes('**Total**'), 'Total row should be present');
	assert.ok(output.includes('**Tarball size**'), 'Tarball size row should be present');
});

test('head-only: total rows appear outside the details section when auto-collapsing', () => {
	const headPkgData = makePkgData(makeFiles(21));

	const output = headOnly({
		headPkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		autoCollapse: true,
	});

	const detailsIndex = output.indexOf('<details>');
	const totalIndex = output.indexOf('**Total**');
	const tarballIndex = output.indexOf('**Tarball size**');

	assert.ok(totalIndex < detailsIndex, 'Total row should appear before the collapsed details section');
	assert.ok(tarballIndex < detailsIndex, 'Tarball size row should appear before the collapsed details section');
});

test('head-only: file names appear inside the details section when auto-collapsing', () => {
	const headPkgData = makePkgData(makeFiles(21));

	const output = headOnly({
		headPkgData,
		displaySize: 'uncompressed',
		sortBy: 'delta',
		sortOrder: 'desc',
		autoCollapse: true,
	});

	const detailsStart = output.indexOf('<details><summary>Show files');
	const detailsEnd = output.indexOf('</details>');
	const detailsContent = output.slice(detailsStart, detailsEnd);

	assert.ok(detailsContent.includes('dist/file0.js'), 'File names should appear inside the details section');
});

test('head-only: title overrides default heading and includeTarball=false hides tarball row', () => {
const headPkgData = makePkgData([['dist/dev/a.js']]);

const output = headOnly({
headPkgData,
displaySize: 'uncompressed',
sortBy: 'delta',
sortOrder: 'desc',
autoCollapse: true,
title: '📊 Package size report — Dev',
includeTarball: false,
});

assert.ok(output.includes('📊 Package size report — Dev'), 'Custom title should be rendered');
assert.ok(output.includes('**Total**'), 'Total row should still be present');
assert.ok(!output.includes('**Tarball size**'), 'Tarball size row should be omitted');
});
