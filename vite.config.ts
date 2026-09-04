/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import { globSync } from 'glob';
import * as path from 'node:path';
import * as url from 'node:url';
import { createRequire } from 'node:module';

const shouldBundle = (id: string) => {
    const [filePath] = id.split('?');

    return (
        // Vite transforms SVG React components imported with ?react.
        // They must not remain as external Node imports in the published library.
        filePath.endsWith('.svg') ||
        // CSS is bundled and injected into the generated JavaScript.
        // This avoids Node/Vitest trying to load CSS from an externalized dependency.
        filePath.endsWith('.css') ||
        // These packages use extensionless or directory imports that are not
        // resolvable by Node's ESM loader when commons-ui is externalized.
        filePath.startsWith('localized-countries/data/') ||
        // mui-nested-menu does not expose NestedMenuItem as a compatible runtime
        // ESM named export in every consumer environment. Bundle it so Rollup
        // resolves the actual implementation during the commons-ui build.
        filePath === 'autosuggest-highlight/match' ||
        filePath === 'autosuggest-highlight/parse' ||
        filePath === 'mui-nested-menu'
    );
};

const require = createRequire(import.meta.url);

const autosuggestMatchPath = require.resolve('autosuggest-highlight/match');
const autosuggestParsePath = require.resolve('autosuggest-highlight/parse');
const muiNestedMenuPath = require.resolve('mui-nested-menu');

export default defineConfig((_config) => ({
    plugins: [
        react(),
        process.env.VITE_CHECKER_ENABLED === 'true' &&
            checker({
                // TypeScript checking
                typescript: true,

                // ESLint checking
                eslint: {
                    useFlatConfig: true,
                    lintCommand: 'eslint . --max-warnings 0',
                    dev: {
                        logLevel: ['error', 'warning'],
                    },
                    watchPath: './src',
                },

                overlay: false, // Disable overlay in browser

                // Show errors in terminal
                terminal: true,

                // Disable during build because vite-plugin-checker runs checks in a parallel worker,
                // which doesn't block the build if linting or type checking fails. To ensure build
                // failure on errors, we use the 'prebuild' script instead (runs before 'npm run build').
                enableBuild: false,
            }),
        svgr({
            include: '**/*.svg?react',
        }), // works on every import with the pattern "**/*.svg?react"
        cssInjectedByJs(),
        dts({
            tsconfigPath: './tsconfig.build.json',
        }),
    ],
    resolve: {
        alias: [
            // Resolve the package to an absolute file path. Using a bare
            // replacement would allow Rollup to externalize it again.
            {
                find: /^autosuggest-highlight\/match$/,
                replacement: autosuggestMatchPath,
            },
            {
                find: /^autosuggest-highlight\/parse$/,
                replacement: autosuggestParsePath,
            },
            {
                find: /^mui-nested-menu$/,
                replacement: muiNestedMenuPath,
            },
        ],
    },
    build: {
        // Preserve compatibility between mui-nested-menu (CommonJS) and external MUI
        // ESM modules by generating namespace imports for external dependencies.
        commonjsOptions: {
            esmExternals: true,
        },
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: (id: string) => {
                if (shouldBundle(id)) {
                    return false;
                }

                return !id.startsWith('.') && !path.isAbsolute(id);
            },

            // We do this to keep the same folder structure
            // from https://rollupjs.org/configuration-options/#input
            input: Object.fromEntries(
                globSync('src/**/*.{js,jsx,ts,tsx}', {
                    ignore: [
                        'src/vite-env.d.ts',
                        'src/**/*.test.{js,jsx,ts,tsx}',
                        'stories/**/*.stories.{js,jsx,ts,tsx}',
                    ],
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
