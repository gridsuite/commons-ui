/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useMemo } from 'react';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import { useIntl } from 'react-intl';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColumnResizedEvent } from 'ag-grid-community';
import { AG_GRID_LOCALE_EN, AG_GRID_LOCALE_FR } from '@ag-grid-community/locale';
import { Box, type SxProps, type Theme, useTheme } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import { CUSTOM_AGGRID_THEME, styles } from './customAggrid.style';

function useAgGridLocale() {
    const intl = useIntl();
    return useMemo(() => {
        switch ((intl.locale || intl.defaultLocale).toUpperCase().substring(0, 2)) {
            case 'FR':
                return AG_GRID_LOCALE_FR;
            case 'EN':
            default:
                return AG_GRID_LOCALE_EN;
        }
    }, [intl.defaultLocale, intl.locale]);
}

export type CustomAGGridProps<TData = any> = Omit<AgGridReactProps<TData>, 'localeText' | 'getLocaleText'> & {
    shouldHidePinnedHeaderRightBorder?: boolean;
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
    ({ shouldHidePinnedHeaderRightBorder = false, ...agGridReactProps }, ref) => {
        const theme = useTheme<Theme>();

        return (
            <Box
                sx={mergeSx(
                    styles.grid as SxProps | undefined,
                    shouldHidePinnedHeaderRightBorder ? styles.noBorderRight : undefined
                )}
                className={`${theme.aggrid.theme} ${CUSTOM_AGGRID_THEME}`}
            >
                <AgGridReact
                    ref={ref}
                    localeText={useAgGridLocale()}
                    onColumnResized={onColumnResized}
                    enableCellTextSelection
                    theme="legacy"
                    {...agGridReactProps}
                />
            </Box>
        );
    }
);
