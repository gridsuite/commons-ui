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
import {
    AG_GRID_LOCALE_BG,
    AG_GRID_LOCALE_BR,
    AG_GRID_LOCALE_CN,
    AG_GRID_LOCALE_CZ,
    AG_GRID_LOCALE_DE,
    AG_GRID_LOCALE_DK,
    AG_GRID_LOCALE_EG,
    AG_GRID_LOCALE_EN,
    AG_GRID_LOCALE_ES,
    AG_GRID_LOCALE_FI,
    AG_GRID_LOCALE_FR,
    AG_GRID_LOCALE_GR,
    AG_GRID_LOCALE_HK,
    AG_GRID_LOCALE_HR,
    AG_GRID_LOCALE_HU,
    AG_GRID_LOCALE_IL,
    AG_GRID_LOCALE_IR,
    AG_GRID_LOCALE_IT,
    AG_GRID_LOCALE_JP,
    AG_GRID_LOCALE_KR,
    AG_GRID_LOCALE_NL,
    AG_GRID_LOCALE_NO,
    AG_GRID_LOCALE_PK,
    AG_GRID_LOCALE_PL,
    AG_GRID_LOCALE_PT,
    AG_GRID_LOCALE_RO,
    AG_GRID_LOCALE_SE,
    AG_GRID_LOCALE_SK,
    AG_GRID_LOCALE_TR,
    AG_GRID_LOCALE_TW,
    AG_GRID_LOCALE_UA,
    AG_GRID_LOCALE_VN,
} from '@ag-grid-community/locale';
import { Box, type SxProps, type Theme, useTheme } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import { CUSTOM_AGGRID_THEME, styles } from './customAggrid.style';

function useAgGridLocale() {
    const intl = useIntl();
    return useMemo(() => {
        switch ((intl.locale || intl.defaultLocale).toUpperCase().substring(0, 2)) {
            case 'BG':
                return AG_GRID_LOCALE_BG;
            case 'BR':
                return AG_GRID_LOCALE_BR;
            case 'CN':
                return AG_GRID_LOCALE_CN;
            case 'CZ':
                return AG_GRID_LOCALE_CZ;
            case 'DE':
                return AG_GRID_LOCALE_DE;
            case 'DK':
                return AG_GRID_LOCALE_DK;
            case 'EG':
                return AG_GRID_LOCALE_EG;
            case 'ES':
                return AG_GRID_LOCALE_ES;
            case 'FI':
                return AG_GRID_LOCALE_FI;
            case 'FR':
                return AG_GRID_LOCALE_FR;
            case 'GR':
                return AG_GRID_LOCALE_GR;
            case 'HK':
                return AG_GRID_LOCALE_HK;
            case 'HR':
                return AG_GRID_LOCALE_HR;
            case 'HU':
                return AG_GRID_LOCALE_HU;
            case 'IL':
                return AG_GRID_LOCALE_IL;
            case 'IR':
                return AG_GRID_LOCALE_IR;
            case 'IT':
                return AG_GRID_LOCALE_IT;
            case 'JP':
                return AG_GRID_LOCALE_JP;
            case 'KR':
                return AG_GRID_LOCALE_KR;
            case 'NL':
                return AG_GRID_LOCALE_NL;
            case 'NO':
                return AG_GRID_LOCALE_NO;
            case 'PK':
                return AG_GRID_LOCALE_PK;
            case 'PL':
                return AG_GRID_LOCALE_PL;
            case 'PT':
                return AG_GRID_LOCALE_PT;
            case 'RO':
                return AG_GRID_LOCALE_RO;
            case 'SE':
                return AG_GRID_LOCALE_SE;
            case 'SK':
                return AG_GRID_LOCALE_SK;
            case 'TR':
                return AG_GRID_LOCALE_TR;
            case 'TW':
                return AG_GRID_LOCALE_TW;
            case 'UA':
                return AG_GRID_LOCALE_UA;
            case 'VN':
                return AG_GRID_LOCALE_VN;
            case 'EN':
            default:
                return AG_GRID_LOCALE_EN;
        }
    }, [intl.defaultLocale, intl.locale]);
}

export type CustomAGGridProps<TData = any> = AgGridReactProps<TData> & {
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
