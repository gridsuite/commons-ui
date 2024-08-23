/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material';
import { expect, it } from '@jest/globals';
import TopBar, { LANG_ENGLISH } from '../TopBar';
import { CommonMetadata, topBarEn } from '../../..';

import PowsyblLogo from './powsybl_logo.svg?react';

const apps: CommonMetadata[] = [
    {
        name: 'App1',
        url: '/app1',
        appColor: 'blue',
        hiddenInAppsMenu: false,
    },
    {
        name: 'App2',
        url: '/app2',
        appColor: 'green',
        hiddenInAppsMenu: true,
    },
];

const theme = createTheme({
    palette: {
        primary: {
            main: red[500],
        },
    },
});

it('renders', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
            <IntlProvider locale="en" messages={topBarEn}>
                <TopBar
                    appName="Demo"
                    appColor="#808080"
                    appLogo={<PowsyblLogo />}
                    onParametersClick={() => {}}
                    onLogoutClick={() => {}}
                    onLogoClick={() => {}}
                    user={{
                        profile: {
                            name: 'John Doe',
                            iss: 'issuer',
                            sub: 'sub',
                            aud: 'aud',
                            exp: 213443,
                            iat: 3214324,
                        },
                        id_token: 'id_token',
                        access_token: 'access_token',
                        token_type: 'code',
                        scope: 'scope',
                        expires_at: 123343,
                        scopes: ['code', 'token'],
                        expired: false,
                        state: null,
                        toStorageString: () => 'stored',
                        expires_in: 1232,
                    }}
                    appsAndUrls={apps}
                    language={LANG_ENGLISH}
                    onLanguageClick={() => {}}
                >
                    <p>testchild</p>
                </TopBar>
            </IntlProvider>
        </ThemeProvider>
    );
    expect(container.textContent).toContain('GridDemotestchildJD');
});
