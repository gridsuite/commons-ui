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
    login_en,
    report_viewer_en,
    top_bar_en,
    table_en,
    treeview_finder_en,
    element_search_en,
    equipment_search_en,
    filter_en,
    filter_expert_en,
    description_en,
    equipments_en,
    csv_en,
    card_error_boundary_en,
    flat_parameters_en,
    multiple_selection_dialog_en,
    common_button_en,
    directory_items_input_en,
} from '..';

const fullTrad = {
    ...report_viewer_en,
    ...login_en,
    ...top_bar_en,
    ...table_en,
    ...treeview_finder_en,
    ...element_search_en,
    ...equipment_search_en,
    ...filter_en,
    ...filter_expert_en,
    ...description_en,
    ...equipments_en,
    ...csv_en,
    ...card_error_boundary_en,
    ...flat_parameters_en,
    ...multiple_selection_dialog_en,
    ...common_button_en,
    ...directory_items_input_en,
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
