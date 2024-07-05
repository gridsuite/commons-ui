/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import { Theme } from '@mui/material/styles/createTheme';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { useIntl } from 'react-intl';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColumnResizedEvent, GetLocaleTextParams } from 'ag-grid-community';
import { Box } from '@mui/system';
import { mergeSx } from '../../utils/styles';
import { SxProps, useTheme } from '@mui/material';
import { styles, CUSTOM_AGGRID_THEME } from './custom-aggrid.style';

interface CustomAGGGridStyleProps {
    shouldHidePinnedHeaderRightBorder?: boolean;
    showOverlay?: boolean;
}

interface CustomAGGridProps extends AgGridReactProps, CustomAGGGridStyleProps {}

// We have to define a minWidth to column to activate this feature
const onColumnResized = (params: ColumnResizedEvent) => {
    const { column, finished } = params;
    const colDefinedMinWidth = column?.getColDef()?.minWidth;
    if (column && colDefinedMinWidth && finished) {
        const newWidth = column?.getActualWidth();
        if (newWidth < colDefinedMinWidth) {
            column?.setActualWidth(colDefinedMinWidth, params.source);
        }
    }
};

const CustomAGGrid = React.forwardRef<AgGridReact, CustomAGGridProps>(
    (props, ref) => {
        const {
            shouldHidePinnedHeaderRightBorder = false,
            overlayNoRowsTemplate,
            loadingOverlayComponent,
            loadingOverlayComponentParams,
            showOverlay = false,
        } = props;
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
                    shouldHidePinnedHeaderRightBorder
                        ? styles.noBorderRight
                        : undefined,
                    showOverlay
                        ? (styles.overlayBackground as SxProps | undefined)
                        : undefined
                )}
                className={`${theme.aggrid.theme} ${CUSTOM_AGGRID_THEME}`}
            >
                <AgGridReact
                    ref={ref}
                    getLocaleText={getLocaleText}
                    suppressPropertyNamesCheck={true}
                    loadingOverlayComponent={loadingOverlayComponent}
                    loadingOverlayComponentParams={
                        loadingOverlayComponentParams
                    }
                    overlayNoRowsTemplate={overlayNoRowsTemplate}
                    onColumnResized={onColumnResized}
                    enableCellTextSelection
                    {...props}
                />
            </Box>
        );
    }
);

export default CustomAGGrid;
