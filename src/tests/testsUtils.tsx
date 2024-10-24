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
} from '..';

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
const renderWithTranslation = (ui: React.ReactElement) => (
    <IntlProvider locale="en" messages={fullTrad}>
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
const renderWithTheme = (ui: React.ReactElement) => <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>;

// eslint-disable-next-line import/prefer-default-export
export class RenderBuilder {
    renderWithTheme: boolean = false;

    renderWithTrad: boolean = false;

    withTrad() {
        this.renderWithTrad = true;
        return this;
    }

    withTheme() {
        this.renderWithTheme = true;
        return this;
    }

    render(ui: React.ReactElement) {
        let newUi = this.renderWithTrad ? renderWithTranslation(ui) : ui;
        newUi = this.renderWithTheme ? renderWithTheme(newUi) : newUi;
        return rtlRender(newUi);
    }
}
