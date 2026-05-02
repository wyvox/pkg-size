import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import scanDirFiles from './scan-dir-files.js';

function makeTree(base, files) {
	for (const [relPath, content] of Object.entries(files)) {
		const abs = path.join(base, relPath);
		fs.mkdirSync(path.dirname(abs), { recursive: true });
		fs.writeFileSync(abs, content);
	}
}

test('scanDirFiles: returns files with size/gzip/brotli measurements', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
	makeTree(tmp, {
		'dist/a.js': 'console.log("hello")',
		'dist/b.js': 'console.log("world")',
	});

	const files = await scanDirFiles(['dist'], tmp);
	assert.equal(files.length, 2);
	for (const f of files) {
		assert.ok(f.path.startsWith('dist/'), `path should start with dist/: ${f.path}`);
		assert.ok(f.size > 0, 'size should be > 0');
		assert.ok(f.sizeGzip > 0, 'sizeGzip should be > 0');
		assert.ok(f.sizeBrotli > 0, 'sizeBrotli should be > 0');
	}

	fs.rmSync(tmp, { recursive: true });
});

test('scanDirFiles: scans files outside the npm package boundary', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
	makeTree(tmp, {
		'smoke-tests/app/dist/index.js': 'export default {}',
		'smoke-tests/app/dist/vendor.js': 'export default {}',
	});

	const files = await scanDirFiles(['smoke-tests/app/dist'], tmp);
	assert.equal(files.length, 2);
	assert.ok(files.every(f => f.path.startsWith('smoke-tests/app/dist/')));

	fs.rmSync(tmp, { recursive: true });
});

test('scanDirFiles: skips prefixes that do not exist', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
	makeTree(tmp, { 'dist/a.js': 'x' });

	const files = await scanDirFiles(['dist', 'nonexistent'], tmp);
	assert.equal(files.length, 1);

	fs.rmSync(tmp, { recursive: true });
});

test('scanDirFiles: deduplicates files from overlapping prefixes', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
	makeTree(tmp, {
		'dist/dev/a.js': 'a',
		'dist/prod/b.js': 'b',
	});

	// 'dist' covers both children; listing all three should not duplicate
	const files = await scanDirFiles(['dist', 'dist/dev', 'dist/prod'], tmp);
	assert.equal(files.length, 2);
	const paths = files.map(f => f.path);
	assert.ok(paths.includes('dist/dev/a.js'));
	assert.ok(paths.includes('dist/prod/b.js'));

	fs.rmSync(tmp, { recursive: true });
});

test('scanDirFiles: handles multiple disjoint prefixes', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
	makeTree(tmp, {
		'dist/dev/a.js': 'dev',
		'dist/prod/b.js': 'prod',
		'other/c.js': 'other',
	});

	const files = await scanDirFiles(['dist/dev', 'dist/prod'], tmp);
	assert.equal(files.length, 2);
	assert.ok(files.some(f => f.path === 'dist/dev/a.js'));
	assert.ok(files.some(f => f.path === 'dist/prod/b.js'));
	assert.ok(!files.some(f => f.path === 'other/c.js'));

	fs.rmSync(tmp, { recursive: true });
});

test('scanDirFiles: returns empty array when no prefixes given', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
	const files = await scanDirFiles([], tmp);
	assert.deepEqual(files, []);
	fs.rmSync(tmp, { recursive: true });
});
