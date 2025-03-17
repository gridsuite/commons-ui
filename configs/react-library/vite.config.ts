/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type ConfigEnv, mergeConfig, type UserConfig } from 'vite';
// @ts-expect-error TS7016: Could not find a declaration file
import eslint from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import * as path from 'node:path';

export default function defineReactLibConfig(
    /** Vite configuration environment */
    config: ConfigEnv,
    /** Extra configuration to merge on top of this base config */
    overrides: UserConfig = {}
): UserConfig {
    return mergeConfig(
        {
            plugins: [
                react(),
                svgr(), // works on every import with the pattern "**/*.svg?react"
                eslint({
                    failOnWarning: config.mode !== 'development',
                    lintOnStart: true,
                }),
                dts({
                    include: ['src'],
                    exclude: ['**/*.{spec,test}.{ts,tsx}'],
                }),
            ],
            build: {
                outDir: 'dist',
                minify: false, // easier to debug on the apps using this lib
                lib: {
                    formats: ['es'],
                },
                rollupOptions: {
                    external: (importId: string) =>
                        importId.includes('/node_modules/') ||
                        (!importId.startsWith('.') && !path.isAbsolute(importId)),
                },
            },
        },
        overrides
    );
}
