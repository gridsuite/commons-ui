/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import * as path from 'node:path';

/**
 * Vite config dedicated to building the demo app for GitHub Pages.
 * The demo lives in demo/ and imports library sources from ../../src.
 * Output goes to demo-dist/ (sibling of demo/).
 */
export default defineConfig({
    root: 'demo',
    base: './',
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            // Let the demo resolve the library source directly (avoids building lib first)
            '../../src': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'demo-dist'),
        emptyOutDir: true,
    },
});
