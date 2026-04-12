import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import createNpmIgnoreOverrides from './create-npm-ignore-overrides.js';

let tmpDir;

before(() => {
	tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-npm-ignore-overrides-test-'));
});

after(() => {
	fs.rmSync(tmpDir, { recursive: true, force: true });
});

function makeProject(name, { files, subdirs = [] } = {}) {
	const projectDir = path.join(tmpDir, name);
	fs.mkdirSync(projectDir, { recursive: true });
	const pkgJson = { name, version: '1.0.0' };
	if (files) {
		pkgJson.files = files;
	}
	fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(pkgJson));
	for (const { name: subName, gitignore, npmignore, files: subFiles = [] } of subdirs) {
		const subDir = path.join(projectDir, subName);
		fs.mkdirSync(subDir, { recursive: true });
		if (gitignore !== undefined) {
			fs.writeFileSync(path.join(subDir, '.gitignore'), gitignore);
		}
		if (npmignore !== undefined) {
			fs.writeFileSync(path.join(subDir, '.npmignore'), npmignore);
		}
		for (const fileName of subFiles) {
			fs.writeFileSync(path.join(subDir, fileName), '');
		}
	}
	return projectDir;
}

test('returns empty array when no package.json exists', () => {
	const dir = path.join(tmpDir, 'no-pkg-json');
	fs.mkdirSync(dir, { recursive: true });
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('returns empty array when package.json has no files field', () => {
	const dir = makeProject('no-files-field');
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('returns empty array when files field is empty', () => {
	const dir = makeProject('empty-files-field', { files: [] });
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('returns empty array when files entries are not directories', () => {
	const dir = makeProject('file-entry', { files: ['index.js'] });
	fs.writeFileSync(path.join(dir, 'index.js'), '');
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('returns empty array when files directory does not exist', () => {
	const dir = makeProject('missing-dir', { files: ['nonexistent'] });
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('returns empty array when subdirectory has .gitignore but also has .npmignore', () => {
	const dir = makeProject('has-npmignore', {
		files: ['pkg'],
		subdirs: [{ name: 'pkg', gitignore: '*', npmignore: '' }],
	});
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('returns empty array when subdirectory has no .gitignore', () => {
	const dir = makeProject('no-gitignore', {
		files: ['pkg'],
		subdirs: [{ name: 'pkg', files: ['module.wasm'] }],
	});
	const result = createNpmIgnoreOverrides(dir);
	assert.deepEqual(result, []);
});

test('creates .npmignore when subdirectory has .gitignore but no .npmignore (wasm-pack scenario)', () => {
	const dir = makeProject('wasm-pack', {
		files: ['pkg'],
		subdirs: [{ name: 'pkg', gitignore: '*', files: ['module_bg.wasm', 'module.js'] }],
	});

	const result = createNpmIgnoreOverrides(dir);

	const expectedNpmignore = path.join(dir, 'pkg', '.npmignore');
	assert.deepEqual(result, [expectedNpmignore]);
	assert.ok(fs.existsSync(expectedNpmignore), '.npmignore should be created');
	assert.equal(fs.readFileSync(expectedNpmignore, 'utf8'), '', '.npmignore should be empty');
});

test('creates .npmignore for multiple subdirectories with .gitignore', () => {
	const dir = makeProject('multi-subdirs', {
		files: ['pkg1', 'pkg2'],
		subdirs: [
			{ name: 'pkg1', gitignore: '*' },
			{ name: 'pkg2', gitignore: '*' },
		],
	});

	const result = createNpmIgnoreOverrides(dir);

	assert.equal(result.length, 2);
	assert.ok(fs.existsSync(path.join(dir, 'pkg1', '.npmignore')));
	assert.ok(fs.existsSync(path.join(dir, 'pkg2', '.npmignore')));
});

test('only creates .npmignore for subdirectories with .gitignore, skips others', () => {
	const dir = makeProject('mixed', {
		files: ['pkg', 'dist'],
		subdirs: [
			{ name: 'pkg', gitignore: '*' },
			{ name: 'dist' }, // no .gitignore
		],
	});

	const result = createNpmIgnoreOverrides(dir);

	assert.equal(result.length, 1);
	assert.ok(fs.existsSync(path.join(dir, 'pkg', '.npmignore')));
	assert.ok(!fs.existsSync(path.join(dir, 'dist', '.npmignore')));
});
