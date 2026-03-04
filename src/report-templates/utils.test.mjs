import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStripHash } from './utils.js';

test('createStripHash returns undefined for falsy input', () => {
	assert.equal(createStripHash(''), undefined);
	assert.equal(createStripHash(undefined), undefined);
});

test('createStripHash without capture group removes matched portion', () => {
	// No capture group — the matched text is entirely removed
	const normalize = createStripHash('\\.[0-9a-f]{8}\\.');
	assert.equal(normalize('dist/app.abcdef12.js'), 'dist/appjs');
});

test('createStripHash with capture group replaces hash chars with asterisks', () => {
	// Single capture group — the hash is replaced with '*' characters
	const normalize = createStripHash('[-.]([0-9a-zA-Z]{8})[.-]');
	assert.equal(normalize('assets/app-BcaWxUPr.js'), 'assets/app-********.js');
	assert.equal(normalize('assets/chunk.abcdef12.css'), 'assets/chunk.********.css');
});

test('createStripHash normalizes different hashes of the same base name to the same key', () => {
	const normalize = createStripHash('[.-]([0-9a-zA-Z]{8,})[.-]');
	const headPath = 'assets/app-BcaWxUPr.js';
	const basePath = 'assets/app-XyZ12345.js';
	assert.equal(normalize(headPath), normalize(basePath));
});

test('createStripHash leaves non-hashed paths unchanged', () => {
	const normalize = createStripHash('[.-]([0-9a-zA-Z]{8,})[.-]');
	assert.equal(normalize('dist/main.js'), 'dist/main.js');
	assert.equal(normalize('packages/ember-testing/dist/index.js'), 'packages/ember-testing/dist/index.js');
});

test('createStripHash uses the default-like pattern covering common build tool formats', () => {
	const normalize = createStripHash('[.-]([0-9a-zA-Z]{8,})[.-]');
	// Vite-style: name-HASH.ext
	assert.equal(normalize('dist/index-BcaWxUPr.js'), normalize('dist/index-XyZ12345.js'));
	// Rollup/webpack-style: name.HASH.ext
	assert.equal(normalize('dist/vendor.abcdef12.js'), normalize('dist/vendor.98765432.js'));
});
