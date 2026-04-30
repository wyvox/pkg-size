import builtins from 'builtin-modules';

export default {
	input: 'src/index.js',
	platform: 'node',
	external: builtins,
	output: {
		format: 'esm',
		file: 'dist/index.js',
	},
};
