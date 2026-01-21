/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useMemo } from 'react';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColumnResizedEvent } from 'ag-grid-community';
import { AG_GRID_LOCALE_EN, AG_GRID_LOCALE_FR } from '@ag-grid-community/locale';
import { useIntl } from 'react-intl';
import { Box, type BoxProps, useTheme } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import { CUSTOM_AGGRID_THEME, styles } from './customAggrid.style';
import { type GsLangUser, LANG_ENGLISH, LANG_FRENCH } from '../../utils/langs';

export type AgGridLocale = Partial<Record<keyof typeof AG_GRID_LOCALE_EN, string>>; // using EN for keyof because it's the only who has more keys, so more complete
export type AgGridLocales = Record<GsLangUser, AgGridLocale>;

function useAgGridLocale(overrideLocales?: AgGridLocales) {
    const intl = useIntl();
    return useMemo((): Record<string, string> => {
        switch ((intl.locale || intl.defaultLocale).toLowerCase().substring(0, 2)) {
            case LANG_FRENCH:
                return {
                    ...AG_GRID_LOCALE_FR,
                    thousandSeparator: ' ',
                    decimalSeparator: ',',
                    ...overrideLocales?.[LANG_FRENCH],
                };
            case LANG_ENGLISH:
            default:
                return { ...AG_GRID_LOCALE_EN, ...overrideLocales?.[LANG_ENGLISH] };
        }
    }, [intl.defaultLocale, intl.locale, overrideLocales]);
}

export type CustomAGGridProps<TData = any> = Omit<AgGridReactProps<TData>, 'localeText' | 'getLocaleText'> &
    Pick<BoxProps, 'sx'> & {
        overrideLocales?: AgGridLocales;
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
    ({ overrideLocales, sx, ...agGridReactProps }, ref) => {
        const theme = useTheme();

        return (
            <Box
                component="div"
                sx={mergeSx(styles.grid, sx)}
                className={`${theme.aggrid.theme} ${CUSTOM_AGGRID_THEME}`}
            >
                <AgGridReact
                    ref={ref}
                    localeText={useAgGridLocale(overrideLocales)}
                    onColumnResized={onColumnResized}
                    enableCellTextSelection
                    theme="legacy"
                    {...agGridReactProps}
                />
            </Box>
        );
    }
);
