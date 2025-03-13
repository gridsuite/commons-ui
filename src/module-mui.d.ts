/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { ThemeDefaultParams, WithParamTypes, ColorValue } from 'ag-grid-community';
import { hidePinnedHeaderRightBorder, HidePinnedHeaderRightBorderParams } from './components/customAGGrid/styles/parts';

type Tmp = WithParamTypes<typeof hidePinnedHeaderRightBorder>;

// used to customize mui theme
// https://mui.com/material-ui/customization/theming/#typescript
declare module '@mui/material/styles/createTheme' {
    interface Theme {
        /* aggrid: {
            theme: string; // removed
            highlightColor: string; // selectedRowBackgroundColor & rowHoverColor
            valueChangeHighlightBackgroundColor: string; // valueChangeValueHighlightBackgroundColor
            overlay: {
                background: string; // loadingBackgroundColor
            };
        }; */
        /*
        '--ag-alpine-active-color': `${theme.palette.primary.main} !important`,
        '--ag-checkbox-indeterminate-color': `${theme.palette.primary.main} !important`,
        '--ag-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-header-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-odd-row-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-modal-overlay-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-selected-row-background-color': 'transparent !important',
        '--ag-range-selection-border-color': 'transparent !important',
         */
        aggrid: {
            defaultParams?: Partial<
                ThemeDefaultParams &
                    HidePinnedHeaderRightBorderParams & {
                        customBackgroundColor: ColorValue;
                    }
            >;
        };
    }
}

declare module '@mui/material/Switch' {
    interface SwitchPropsSizeOverrides {
        large: true;
    }
}
