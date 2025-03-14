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
import { type ColumnResizedEvent, type GetLocaleTextParams } from 'ag-grid-community';
import { Box, type SxProps, type Theme, useTheme } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import { CUSTOM_AGGRID_THEME, styles } from './customAggrid.style';
import { I18N_GRID_PREFIX } from '../../translations/agGridLocales';

export type CustomAGGridProps<TData = any> = AgGridReactProps<TData> & {
    shouldHidePinnedHeaderRightBorder?: boolean;
    showOverlay?: boolean;
};

// We have to define a minWidth to column to activate this feature
function onColumnResized(params: ColumnResizedEvent) {
    const { column, finished } = params;
    const colDefinedMinWidth = column?.getColDef()?.minWidth;
    if (column && colDefinedMinWidth && finished) {
        const newWidth = column?.getActualWidth();
        if (newWidth < colDefinedMinWidth) {
            params.api.setColumnWidths([{ key: column, newWidth: colDefinedMinWidth }], finished, params.source);
        }
    }
}

export const CustomAGGrid = forwardRef<AgGridReact, CustomAGGridProps>((props, ref) => {
    const { shouldHidePinnedHeaderRightBorder = false, showOverlay = false, ...agGridReactProps } = props;
    const theme = useTheme<Theme>();
    const intl = useIntl();

    const getLocaleText = useCallback(
        (params: GetLocaleTextParams) =>
            intl.formatMessage(
                {
                    id: params.key.startsWith(I18N_GRID_PREFIX) ? params.key : `${I18N_GRID_PREFIX}${params.key}`,
                    defaultMessage: params.defaultValue,
                },
                params.variableValues?.reduce((acc, curr, idx) => {
                    acc[`variable${idx + 1}`] = curr;
                    return acc;
                }, {} as Record<string, string>)
            ),
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
});
