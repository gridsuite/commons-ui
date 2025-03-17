/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineConfig } from 'vite';
import defineReactConfig from './configs/react-library/vite.config';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { globSync } from 'glob';
import * as path from 'node:path';

export default defineConfig((config) =>
    defineReactConfig(config, {
        plugins: [libInjectCss()],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
            },
            rollupOptions: {
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
                        path.join(__dirname, file),
                    ])
                ),
                output: {
                    chunkFileNames: 'chunks/[name].[hash].js', // in case some chunks are created, but it should not because every file is supposed to be an entry point
                    assetFileNames: 'assets/[name][extname]',
                    entryFileNames: '[name].js', // override vite and allow to keep .js extension even in ESM
                },
            },
        },
    })
);
