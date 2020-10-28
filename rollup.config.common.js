import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import glslify from 'rollup-plugin-glslify';

const { projectList, INCLUDES } = require('./project-list');

const ROOT_RESOLVE = path.resolve();

const config = {
  input: path.resolve(ROOT_RESOLVE, 'src', 'index.js'),
  plugins: [
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      exclude: /node_modules/,
      babelHelpers: 'bundled',
    }),
    glslify(),
  ],
  external: [
    ...projectList.map(({ name }) => name),
    'react',
    'react-dom',
    'react-is',
    'regl',
    'multi-regl',
    'resl',
    'styled-components',
    'glsl-solid-wireframe',
  ],
};

export const configs = INCLUDES.length === 0 && fs.statSync(config.input).isFile()
  ? [ROOT_RESOLVE, config]
  : Object.entries(projectList.reduce((cfg, { location }) => ({
    ...cfg,
    [location]: {
      ...config,
      input: `${location}/src/index.js`,
    },
  }), {}));

export default config;
