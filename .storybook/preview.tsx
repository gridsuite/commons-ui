/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Preview } from '@storybook/react-vite';
import { IntlProvider } from 'react-intl';

// Import all English translations from the library
import * as enTranslations from '../src/translations/en';

const messages = Object.values(enTranslations).reduce<Record<string, string>>((acc, mod) => {
    if (typeof mod === 'object' && mod !== null) {
        return { ...acc, ...(mod as Record<string, string>) };
    }
    return acc;
}, {});

const preview: Preview = {
    decorators: [
        (Story) => (
            <IntlProvider locale="en" messages={messages} defaultLocale="en">
                <div style={{ width: 480 }}>
                    <Story />
                </div>
            </IntlProvider>
        ),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'centered',
    },
};

export default preview;
