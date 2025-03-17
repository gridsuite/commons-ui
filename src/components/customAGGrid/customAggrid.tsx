/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useCallback } from 'react';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import { useIntl } from 'react-intl';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColumnResizedEvent, GetLocaleTextParams } from 'ag-grid-community';
import { Box, type SxProps, type Theme, useTheme } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import { CUSTOM_AGGRID_THEME, styles } from './customAggrid.style';

export type CustomAGGridProps<TData = any> = AgGridReactProps<TData> & {
    shouldHidePinnedHeaderRightBorder?: boolean;
    showOverlay?: boolean;
};

// We have to define a minWidth to column to activate this feature
function onColumnResized({ api, column, finished, source }: ColumnResizedEvent) {
    if (column) {
        const colDefinedMinWidth = column.getColDef().minWidth;
        if (colDefinedMinWidth && finished && column.getActualWidth() < colDefinedMinWidth) {
            api.setColumnWidths([{ key: column, newWidth: colDefinedMinWidth }], finished, source);
        }
    }
}

export const CustomAGGrid = forwardRef<AgGridReact, CustomAGGridProps>(
    ({ shouldHidePinnedHeaderRightBorder = false, showOverlay = false, ...agGridReactProps }, ref) => {
        const theme = useTheme<Theme>();
        const intl = useIntl();

        const GRID_PREFIX = 'grid.';

        const getLocaleText = useCallback(
            (params: GetLocaleTextParams) => {
                const key = GRID_PREFIX + params.key;
                return intl.formatMessage({
                    id: key,
                    defaultMessage: params.defaultValue,
                });
            },
            [intl]
        );

        return (
            <Box
                sx={mergeSx(
                    styles.grid as SxProps | undefined,
                    shouldHidePinnedHeaderRightBorder ? styles.noBorderRight : undefined,
                    showOverlay ? (styles.overlayBackground as SxProps | undefined) : undefined
                )}
                className={`${theme.aggrid.theme} ${CUSTOM_AGGRID_THEME}`}
            >
                <AgGridReact
                    ref={ref}
                    getLocaleText={getLocaleText}
                    onColumnResized={onColumnResized}
                    enableCellTextSelection
                    theme="legacy"
                    {...agGridReactProps}
                />
            </Box>
        );
    }
);
