/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render as rtlRender } from '@testing-library/react';
import { type ReactElement } from 'react';
import { createTheme, type Theme, ThemeProvider } from '@mui/material';
import { IntlProvider } from 'react-intl';
import {
    cardErrorBoundaryEn,
    commonButtonEn,
    csvEn,
    descriptionEn,
    directoryItemsInputEn,
    elementSearchEn,
    equipmentSearchEn,
    equipmentsEn,
    filterEn,
    filterExpertEn,
    flatParametersEn,
    loginEn,
    multipleSelectionDialogEn,
    reportViewerEn,
    tableEn,
    topBarEn,
    treeviewFinderEn,
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
function renderWithTranslation(ui: ReactElement, trad: Record<string, string>) {
    return (
        <IntlProvider locale="en" messages={trad}>
            {ui}
        </IntlProvider>
    );
}

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
function renderWithTheme(ui: ReactElement, theme: Theme) {
    return <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
}

export class RenderBuilder {
    private renderWithTheme = false;

    private theme = lightTheme;

    private renderWithTrad = false;

    private trad: Record<string, string> = fullTrad;

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

    render(ui: ReactElement) {
        let newUi = this.renderWithTrad ? renderWithTranslation(ui, this.trad) : ui;
        newUi = this.renderWithTheme ? renderWithTheme(newUi, this.theme) : newUi;
        return rtlRender(newUi);
    }
}
