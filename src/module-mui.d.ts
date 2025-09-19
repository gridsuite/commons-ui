/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable no-restricted-imports */

// noinspection ES6UnusedImports
import type {} from '@mui/material'; // dunno why we need to import like that for module augmentation to work
import type { Property } from 'csstype';

// https://mui.com/x/react-charts/quickstart/#typescript
// import type {} from '@mui/x-charts/themeAugmentation';

// https://mui.com/x/react-date-pickers/quickstart/#typescript
// import type {} from '@mui/x-date-pickers/themeAugmentation';
// import type {} from '@mui/x-date-pickers/AdapterDayjs'; // replace `AdapterDayjs` with the adapter you're using

// https://mui.com/x/react-tree-view/quickstart/#typescript
import type {} from '@mui/x-tree-view/themeAugmentation';

// https://mui.com/material-ui/about-the-lab/#typescript
import type {} from '@mui/lab/themeAugmentation';

// used to customize mui theme & colors
declare module '@mui/material/styles' {
    // https://mui.com/material-ui/customization/theming/#typescript
    interface Theme {
        agGrid: {
            theme: 'ag-theme-alpine' | 'ag-theme-alpine-dark';
            highlightColor: Property.Color;
            valueChangeHighlightBackgroundColor: Property.BackgroundColor;
            backgroundColor: Property.BackgroundColor;
        };
    }

    // options of createTheme({...})
    interface ThemeOptions {
        // do you use AgGrid component(s)?
        agGrid?: {
            // There is no default/fallback values, so all variables must be specified
            theme: 'ag-theme-alpine' | 'ag-theme-alpine-dark';
            highlightColor: Property.Color;
            valueChangeHighlightBackgroundColor: Property.BackgroundColor;
            backgroundColor: Property.BackgroundColor;
        };
    }

    // https://mui.com/material-ui/customization/palette/#typescript
    // interface Palette {}
    // interface PaletteOptions {}

    // https://mui.com/material-ui/customization/palette/#typescript-2
    // interface PaletteColor {}
    // interface SimplePaletteColorOptions {}
}

declare module '@mui/utils/capitalize' {
    export default function capitalize<S extends string>(string: S): Capitalize<S>;
}

export {}; // keep this file a module
