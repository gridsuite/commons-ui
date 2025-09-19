/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { MuiStyles } from '../../utils/styles';

export const CUSTOM_AGGRID_THEME = 'custom-aggrid-theme';

export const styles = {
    grid: (theme) => ({
        width: 'auto',
        height: '100%',
        position: 'relative',

        [`&.${CUSTOM_AGGRID_THEME}`]: {
            ...(theme.agGrid?.valueChangeHighlightBackgroundColor && {
                '--ag-value-change-value-highlight-background-color': theme.agGrid.valueChangeHighlightBackgroundColor,
            }),
            ...(theme.agGrid?.highlightColor && {
                '--ag-selected-row-background-color': theme.agGrid.highlightColor,
                '--ag-row-hover-color': theme.agGrid.highlightColor,
            }),
        },

        '& .ag-checkbox-input': {
            cursor: 'pointer',
            // Enlarge checkbox area to be more permissive when selecting it
            scale: '2.5',
        },

        // overrides the default computed max height for ag grid default selector editor to make it more usable
        // can be removed if a custom selector editor is implemented
        '& .ag-select-list': {
            maxHeight: '300px !important',
        },

        // allows to hide the scrollbar in the pinned rows section as it is unecessary to our implementation
        '& .ag-body-horizontal-scroll:not(.ag-scrollbar-invisible) .ag-horizontal-left-spacer:not(.ag-scroller-corner)':
            {
                visibility: 'hidden',
            },
        // removes border on focused cell - using "suppressCellFocus" Aggrid option causes side effects and breaks field edition
        '& .ag-cell-focus, .ag-cell': {
            border: 'none !important',
        },
    }),
} as const satisfies MuiStyles;
