/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// noinspection ES6UnusedImports
import type {} from '@mui/material'; // dunno why we need to import like that for module augmentation to work
import type { Property } from 'csstype';

// used to customize mui theme & colors
declare module '@mui/material/styles' {
    // https://mui.com/material-ui/customization/theming/#typescript
    interface Theme {
        agGrid: {
            theme: string;
            highlightColor: Property.Color;
            valueChangeHighlightBackgroundColor: Property.BackgroundColor;
            backgroundColor: Property.BackgroundColor;
        };
    }
    interface ThemeOptions {
        // do you use AgGrid component(s)?
        agGrid?: {
            // There is no default/fallback values, so all variables must be specified
            theme: string;
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

export {}; // keep this file a module
