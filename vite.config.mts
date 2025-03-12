/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts';
import { globSync } from 'glob';
import * as path from 'node:path';
import * as url from 'node:url';

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

export default defineConfig((config) => ({
    plugins: [
        react(),
        eslint({
            failOnWarning: config.mode !== 'development',
            lintOnStart: true,
        }),
        svgr(), // works on every import with the pattern "**/*.svg?react"
        libInjectCss(),
        dts({
            include: ['src'],
            exclude: '**/*.test.{ts,tsx}',
        }),
        {
            name: 'rewrite-import-glob-node_modules',
            enforce: 'pre',
            // we don't want `import('../../node_modules/@formatjs/......js')` but `import('@formatjs/......js')`
            resolveDynamicImport(specifier, importer, options) {
                if (typeof specifier !== 'string' || !specifier.includes('/node_modules/')) {
                    return null;
                }
                const importee = path.isAbsolute(specifier)
                    ? specifier
                    : path.resolve(path.parse(importer!).dir, specifier);
                return (importee.startsWith(nodeModulesPath) && path.relative(nodeModulesPath, importee)) || null;
            },
        },
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: (importId: string) =>
                importId.includes('/node_modules/') || (!importId.startsWith('.') && !path.isAbsolute(importId)),
            // We do this to keep the same folder structure
            // from https://rollupjs.org/configuration-options/#input
            input: Object.fromEntries(
                globSync('src/**/*.{js,jsx,ts,tsx}', {
                    ignore: ['src/vite-env.d.ts', 'src/**/*.test.{js,jsx,ts,tsx}'],
                }).map((file) => [
                    // This remove `src/` as well as the file extension from each
                    // file, so e.g. src/nested/foo.js becomes nested/foo
                    path.relative('src', file.slice(0, file.length - path.extname(file).length)),
                    // This expands the relative paths to absolute paths, so e.g.
                    // src/nested/foo becomes /project/src/nested/foo.js
                    url.fileURLToPath(new URL(file, import.meta.url)),
                ])
            ),
            output: {
                chunkFileNames: 'chunks/[name].[hash].js', // in case some chunks are created, but it should not because every file is supposed to be an entry point
                assetFileNames: 'assets/[name][extname]',
                entryFileNames: '[name].js', // override vite and allow to keep .js extension even in ESM
            },
        },
        minify: false, // easier to debug on the apps using this lib
    },
}));
