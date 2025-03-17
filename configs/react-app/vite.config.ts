/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type CommonServerOptions, type ConfigEnv, mergeConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
// @ts-expect-error TS7016: Could not find a declaration file
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

export default function defineReactAppConfig(
    /** Vite configuration environment */
    config: ConfigEnv,
    /** The IP port on which the dev server will bind on (range: [1;65535]) */
    devPort: number,
    /** Extra configuration to merge on top of this base config */
    overrides: UserConfig = {}
): UserConfig {
    const serverSettings: CommonServerOptions = {
        port: devPort,
        proxy: {
            '/api/gateway': {
                target: 'http://localhost:9000',
                rewrite: (path: string) => path.replace(/^\/api\/gateway/i, ''),
            },
            '/ws/gateway': {
                target: 'http://localhost:9000',
                rewrite: (path: string) => path.replace(/^\/ws\/gateway/i, ''),
                ws: true,
            },
        },
    };
    return mergeConfig(
        {
            plugins: [
                react(),
                svgr(), // works on every import with the pattern "**/*.svg?react"
                eslint({
                    failOnWarning: config.mode !== 'development',
                    lintOnStart: true,
                }),
                tsconfigPaths(), // to resolve absolute path via tsconfig cf https://stackoverflow.com/a/68250175/5092999
            ],
            base: './',
            server: serverSettings, // for npm run start
            preview: serverSettings, // for npm run serve (use local build)
            build: {
                outDir: 'build',
            },
        },
        overrides
    );
}
