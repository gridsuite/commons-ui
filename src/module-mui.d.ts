/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import '@mui/material'; // dunno why we need to import like that for module augmentation to work

// used to customize mui theme
// https://mui.com/material-ui/customization/theming/#typescript
declare module '@mui/material/styles' {
    interface PaletteExtension {
        tabBackground: string;
    }
    export interface Palette extends MuiPalette, Required<PaletteExtension> {}
    export interface PaletteOptions extends MuiPaletteOptions, Partial<PaletteExtension> {}
    interface ThemeExtension {
        aggrid: {
            theme: string;
            highlightColor: string;
            valueChangeHighlightBackgroundColor: string;
            overlay: {
                background: string;
            };
        };
        searchedText: {
            highlightColor: string;
            currentHighlightColor: string;
        };
        selectedRow: {
            background: string;
        };
        severityChip: {
            disabledColor: string;
        };
    }

    export interface Theme extends MuiTheme, Required<ThemeExtension> {}

    // allow configuration using `createTheme`
    export interface ThemeOptions extends MuiThemeOptions, Partial<ThemeExtension> {}
}
