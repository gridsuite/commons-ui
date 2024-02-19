/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import * as path from 'path';
import eslint from 'vite-plugin-eslint';
import * as fs from 'node:fs/promises';
import * as url from 'node:url';
import { createRequire } from 'node:module';
import svgr from 'vite-plugin-svgr';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig({
    plugins: [
        react(),
        eslint(),
        svgr({ include: '**/*.svg' }), // default is { include: "**/*.svg?react" }
        reactVirtualized(),
        externalizeDeps({
            devDeps: true,
            include: [/^react-is(?:\/.+)?$/, /^@.+/],
        }),
    ],

    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'Commons ui',
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                preserveModules: true,
                entryFileNames: '[name].js', // override vite and allow to keep the original tree and .js extension even in ESM
            },
        },
        minify: false, // easier to debug on the apps using this lib
    },
});

// Workaround for react-virtualized with vite
// https://github.com/bvaughn/react-virtualized/issues/1632#issuecomment-1483966063
function reactVirtualized(): PluginOption {
    const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
    return {
        name: 'flat:react-virtualized',
        // Note: we cannot use the `transform` hook here
        //       because libraries are pre-bundled in vite directly,
        //       plugins aren't able to hack that step currently.
        //       so instead we manually edit the file in node_modules.
        //       all we need is to find the timing before pre-bundling.
        configResolved: async () => {
            const require = createRequire(import.meta.url);
            const reactVirtualizedPath = require.resolve('react-virtualized');
            const { pathname: reactVirtualizedFilePath } = new url.URL(
                reactVirtualizedPath,
                import.meta.url
            );
            const file = reactVirtualizedFilePath.replace(
                path.join('dist', 'commonjs', 'index.js'),
                path.join(
                    'dist',
                    'es',
                    'WindowScroller',
                    'utils',
                    'onScroll.js'
                )
            );
            const code = await fs.readFile(file, 'utf-8');
            const modified = code.replace(WRONG_CODE, '');
            await fs.writeFile(file, modified);
        },
    };
}
