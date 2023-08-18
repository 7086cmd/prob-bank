import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import nodeResolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import { resolve } from 'path'
import replace from '@rollup/plugin-replace'

export default defineConfig([
  {
    input: 'src/app/background.ts',
    output: [
      {
        file: 'dist/app/background.js',
        format: 'cjs',
        plugins: [
          replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
          }),
        ],
      },
      {
        file: 'dist/prob-bank.min.js',
        format: 'cjs',
        plugins: [
          terser(),
          replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
          }),
        ],
      },
    ],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts'],
      }),
      commonjs({
        ignoreDynamicRequires: true,
      }),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript'],
      }),
      eslint(),
      alias({
        entries: [{ find: '@', replacement: resolve('src', 'app') }],
      }),
      json(),
      babel(),
    ],
    watch: {
      include: 'src/**',
    },
    external: ['mongodb', 'electron'],
  },
  {
    input: 'src/app/preload.ts',
    output: [
      {
        file: 'dist/app/preload.js',
        format: 'cjs',
        plugins: [
          replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
          }),
        ],
      },
      {
        file: 'dist/prob-bank.preload.min.js',
        format: 'cjs',
        plugins: [
          terser(),
          replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
          }),
        ],
      },
    ],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts'],
      }),
      commonjs({
        ignoreDynamicRequires: true,
      }),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript'],
      }),
      eslint(),
      alias({
        entries: [{ find: '@', replacement: resolve('src', 'app') }],
      }),
      json(),
      babel(),
    ],
    watch: {
      include: 'src/**',
    },
    external: ['mongodb', 'electron'],
  },
])
