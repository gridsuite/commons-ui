/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { render as rtlRender } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IntlProvider } from 'react-intl';
import { Theme } from '@mui/system';
import {
    loginEn,
    reportViewerEn,
    topBarEn,
    tableEn,
    treeviewFinderEn,
    elementSearchEn,
    equipmentSearchEn,
    filterEn,
    filterExpertEn,
    descriptionEn,
    equipmentsEn,
    csvEn,
    cardErrorBoundaryEn,
    flatParametersEn,
    multipleSelectionDialogEn,
    commonButtonEn,
    directoryItemsInputEn,
} from '../translations/en';

const fullTrad = {
    ...reportViewerEn,
    ...loginEn,
    ...topBarEn,
    ...tableEn,
    ...treeviewFinderEn,
    ...elementSearchEn,
    ...equipmentSearchEn,
    ...filterEn,
    ...filterExpertEn,
    ...descriptionEn,
    ...equipmentsEn,
    ...csvEn,
    ...cardErrorBoundaryEn,
    ...flatParametersEn,
    ...multipleSelectionDialogEn,
    ...commonButtonEn,
    ...directoryItemsInputEn,
};
const renderWithTranslation = (ui: React.ReactElement, trad: Record<string, string> = fullTrad) => (
    <IntlProvider locale="en" messages={trad}>
        {ui}
    </IntlProvider>
);

const lightTheme = createTheme(
    {
        components: {
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
        },
        palette: {
            mode: 'light',
        },
    },
    {
        aggrid: {
            theme: 'ag-theme-alpine',
            overlay: {
                background: '#e6e6e6',
            },
        },
    }
);
const renderWithTheme = (ui: React.ReactElement, theme: Theme = lightTheme) => (
    <ThemeProvider theme={theme}>{ui}</ThemeProvider>
);

// eslint-disable-next-line import/prefer-default-export
export class RenderBuilder {
    renderWithTheme: boolean = false;

    theme: Theme = lightTheme;

    renderWithTrad: boolean = false;

    trad: Record<string, string> = fullTrad;

    withTrad(trad?: Record<string, string>) {
        this.renderWithTrad = true;
        if (trad) {
            this.trad = trad;
        }
        return this;
    }

    withTheme(theme?: Theme) {
        this.renderWithTheme = true;
        if (theme) {
            this.theme = theme;
        }
        return this;
    }

    render(ui: React.ReactElement) {
        let newUi = this.renderWithTrad ? renderWithTranslation(ui, this.trad) : ui;
        newUi = this.renderWithTheme ? renderWithTheme(newUi, this.theme) : newUi;
        return rtlRender(newUi);
    }
}
