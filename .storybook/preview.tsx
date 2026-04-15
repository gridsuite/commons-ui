/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { IntlProvider } from 'react-intl';

// Import all English translations from the library
import * as enTranslations from '../src/translations/en';

const messages = Object.values(enTranslations).reduce<Record<string, string>>((acc, mod) => {
    if (typeof mod === 'object' && mod !== null) {
        return { ...acc, ...(mod as Record<string, string>) };
    }
    return acc;
}, {});

/** Extended theme for Gridsuite-specific tokens used by BuildStatusChip and others */
const buildNodeTheme = {
    node: {
        buildStatus: {
            success: '#43a047',
            warning: '#fb8c00',
            error: '#e53935',
            notBuilt: '#bdbdbd',
        },
    },
};

const lightTheme = createTheme({ palette: { mode: 'light' }, ...buildNodeTheme });
const darkTheme = createTheme({ palette: { mode: 'dark' }, ...buildNodeTheme });

const withMuiTheme: Decorator = (Story, context) => {
    const theme = context.globals['theme'] === 'dark' ? darkTheme : lightTheme;
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <IntlProvider locale="en" messages={messages} defaultLocale="en">
                <Story />
            </IntlProvider>
        </ThemeProvider>
    );
};

const preview: Preview = {
    globalTypes: {
        theme: {
            description: 'MUI color scheme',
            toolbar: {
                title: 'Theme',
                icon: 'circlehollow',
                items: [
                    { value: 'light', icon: 'sun', title: 'Light' },
                    { value: 'dark', icon: 'moon', title: 'Dark' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        theme: 'light',
    },
    decorators: [withMuiTheme],
    parameters: {
        layout: 'padded',
    },
};

export default preview;
