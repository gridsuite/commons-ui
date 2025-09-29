/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineConfig, mergeConfig } from 'vite';
import defaultConfig from './vite.config.ts';
import react from '@vitejs/plugin-react';
// @ts-expect-error See https://github.com/gxmari007/vite-plugin-eslint/issues/79
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts';

export default defineConfig((configEnv) => {
    const baseConfig = defaultConfig(configEnv);
    baseConfig.plugins = []; // remove existing plugins
    return mergeConfig(baseConfig, {
        plugins: [
            react(),
            eslint({
                failOnWarning: true,
                lintOnStart: true,
            }),
            svgr(), // works on every import with the pattern "**/*.svg?react"
            libInjectCss(),
            dts({
                include: ['src'],
                exclude: '**/*.test.{ts,tsx}',
            }),
        ],
    });
});
