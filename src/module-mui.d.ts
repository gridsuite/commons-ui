/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable spaced-comment */
//import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles/createTheme';
//import { Palette as MuiPalette, PaletteOptions as MuiPaletteOptions } from '@mui/material/styles/createPalette';
import type { CSSObject } from '@mui/styled-engine';
import type { Property } from 'csstype';

export type CommonMuiTheme = {
    aggrid: {
        theme: 'ag-theme-alpine' | 'ag-theme-alpine-dark';
        highlightColor: Property.Color;
        valueChangeHighlightBackgroundColor: Property.Color;
        overlay: {
            background: CSSObject;
        };
        background: CSSObject;
    };
};

export type CommonMuiPalette = {};

// used to customize mui theme
// https://mui.com/material-ui/customization/theming/#typescript
declare module '@mui/material/styles' {
    // export * from '@mui/material/styles';

    export interface Theme extends /*MuiTheme,*/ Required<CommonMuiTheme> {}
    // allow configuration using `createTheme`
    export interface ThemeOptions extends /*MuiThemeOptions,*/ Partial<CommonMuiTheme> {}

    export interface Palette extends /*MuiPalette,*/ Required<CommonMuiPalette> {}
    // allow configuration using `createPalette`
    export interface PaletteOptions extends /*MuiPaletteOptions,*/ Partial<CommonMuiPalette> {}
}

declare module '@mui/utils/capitalize' {
    // override to have result prediction
    export default function capitalize<S extends string>(string: S): Capitalize<S>;
}
