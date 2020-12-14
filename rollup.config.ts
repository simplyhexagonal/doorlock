import { RollupOptions } from 'rollup';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

const pkg = require('./package.json');

const isProduction = (process.env.NODE_ENV === 'production');

const input = './src/index.ts';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : (process.env.NODE_ENV || 'development')
    ),
  }),
  typescript({
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true,
  }),
  nodeResolve(),
  commonjs({
    sourceMap: true,
  }),
  json(),
];

if (isProduction) {
  // terser is slow, only run when building
  plugins.push(terser());
}

const config: RollupOptions = {
  input,
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'default',
  },
  plugins,
  // indicate here external modules you don't want to include in your bundle (i.e.: 'lodash')
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ],
};

if (!isProduction) {
  config.watch = {
    chokidar: {
      useFsEvents: false,
    },
    include: 'src/**',
    clearScreen: false,
  };
}

export default config;
