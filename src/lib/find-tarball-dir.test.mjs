import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import findTarballDir from './find-tarball-dir.js';

async function makeTmpDir() {
	return fs.promises.mkdtemp(path.join(os.tmpdir(), 'pkg-size-test-'));
}

async function writeFile(dir, relPath, content = '') {
	const abs = path.join(dir, relPath);
	await fs.promises.mkdir(path.dirname(abs), { recursive: true });
	await fs.promises.writeFile(abs, content);
}

test('findTarballDir: finds package.json at the prefix itself', async () => {
	const cwd = await makeTmpDir();
	await writeFile(cwd, 'packages/pkg-a/package.json', '{}');
	const result = await findTarballDir('packages/pkg-a', cwd);
	assert.equal(result, 'packages/pkg-a');
	await fs.promises.rm(cwd, { recursive: true });
});

test('findTarballDir: finds package.json in ancestor of prefix', async () => {
	const cwd = await makeTmpDir();
	await writeFile(cwd, 'packages/pkg-a/package.json', '{}');
	const result = await findTarballDir('packages/pkg-a/dist', cwd);
	assert.equal(result, 'packages/pkg-a');
	await fs.promises.rm(cwd, { recursive: true });
});

test('findTarballDir: finds package.json in deeply nested ancestor', async () => {
	const cwd = await makeTmpDir();
	await writeFile(cwd, 'packages/pkg-a/package.json', '{}');
	const result = await findTarballDir('packages/pkg-a/dist/esm/utils', cwd);
	assert.equal(result, 'packages/pkg-a');
	await fs.promises.rm(cwd, { recursive: true });
});

test('findTarballDir: returns "." for prefix within the root package', async () => {
	const cwd = await makeTmpDir();
	await writeFile(cwd, 'package.json', '{}');
	const result = await findTarballDir('dist', cwd);
	assert.equal(result, '.');
	await fs.promises.rm(cwd, { recursive: true });
});

test('findTarballDir: prefers nearest package.json (sub-package over root)', async () => {
	const cwd = await makeTmpDir();
	await writeFile(cwd, 'package.json', '{}');
	await writeFile(cwd, 'packages/pkg-a/package.json', '{}');
	const result = await findTarballDir('packages/pkg-a/dist', cwd);
	assert.equal(result, 'packages/pkg-a');
	await fs.promises.rm(cwd, { recursive: true });
});

test('findTarballDir: returns null when no package.json found', async () => {
	const cwd = await makeTmpDir();
	const result = await findTarballDir('some/random/path', cwd);
	assert.equal(result, null);
	await fs.promises.rm(cwd, { recursive: true });
});
