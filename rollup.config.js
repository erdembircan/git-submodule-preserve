const nodeResolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const buble = require('rollup-plugin-buble');
const asyncGen = require('rollup-plugin-async');
const path = require('path');

const resolve = p => path.resolve(__dirname, p);

const version = `v${require('./package.json').version}`;

const banner = `/*!
 * git-submodule-preserve ${version}
 * Erdem Bircan - 2019
 * @license MIT
 */
`;

module.exports = {
  input: resolve('src/SubmodulePreserve.js'),
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonJs(),
    buble({ transforms: { asyncAwait: false } }),
    asyncGen(),
  ],
  output: {
    file: 'dist/SubmodulePreserve.cjs.js',
    format: 'cjs',
    banner,
  },
};
