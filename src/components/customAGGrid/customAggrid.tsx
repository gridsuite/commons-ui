/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useIntl } from 'react-intl';
import {
    colorSchemeDark,
    colorSchemeLight,
    type ColumnResizedEvent,
    type GetLocaleTextParams,
    type GridOptions,
    iconSetMaterial,
    styleMaterial,
    type Theme as AgTheme,
    themeAlpine,
    type ThemeDefaultParams,
} from 'ag-grid-community';
import { Box, SxProps, type Theme as MuiTheme, useTheme } from '@mui/material';
import { baseGridSuite, hidePinnedHeaderRightBorder, noBorderRight } from './styles/parts';

export type ExtendAgGridTheme<TParams extends object, TOutput extends TParams = TParams> = (
    agTheme: AgTheme<TParams>,
    muiTheme: MuiTheme
) => AgTheme<TOutput>;

export type CustomAgGridProps = GridOptions & {
    shouldHidePinnedHeaderRightBorder?: boolean;
    showOverlay?: boolean;
    sx?: SxProps<MuiTheme>;
    customizeGridTheme?: ExtendAgGridTheme<ThemeDefaultParams>;
};

// TODO align with apps theme using https://www.ag-grid.com/theme-builder/
// and share it with apps: https://www.ag-grid.com/react-data-grid/theming-distribution/
const agGridTheme = themeAlpine.withPart(iconSetMaterial).withPart(styleMaterial /* colors only */);

// We have to define a minWidth to column to activate this feature
const onColumnResized = (params: ColumnResizedEvent) => {
    const { column, finished } = params;
    const colDefinedMinWidth = column?.getColDef()?.minWidth;
    if (column && colDefinedMinWidth && finished) {
        const newWidth = column?.getActualWidth();
        if (newWidth < colDefinedMinWidth) {
            params.api.setColumnWidths([{ key: column, newWidth: colDefinedMinWidth }], finished, params.source);
        }
    }
};

export const CustomAGGrid = forwardRef<AgGridReact, CustomAgGridProps>((props, ref) => {
    const { shouldHidePinnedHeaderRightBorder, showOverlay, sx, customizeGridTheme, ...agGridReactProps } = props;
    const muiTheme = useTheme<MuiTheme>();
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

    const computedTheme = useMemo(() => {
        let theme = agGridTheme
            .withPart(muiTheme.palette.mode === 'light' ? colorSchemeLight : colorSchemeDark)
            .withPart(baseGridSuite);
        if (showOverlay) {
            theme = theme.withPart(noBorderRight);
        }
        if (shouldHidePinnedHeaderRightBorder) {
            theme = theme.withPart(hidePinnedHeaderRightBorder);
            // .withParams({ loadingBackgroundColor: theme.aggrid.overlay.background });
        }
        if (muiTheme.aggrid.defaultParams !== undefined) {
            // keep after parts are setup
            theme = theme.withParams(muiTheme.aggrid.defaultParams ?? {});
        }
        if (customizeGridTheme) {
            theme = customizeGridTheme(theme, muiTheme);
        }
        return theme /* .withParams({
            valueChangeValueHighlightBackgroundColor: theme.aggrid.valueChangeHighlightBackgroundColor,
            selectedRowBackgroundColor: theme.aggrid.highlightColor,
            rowHoverColor: theme.aggrid.highlightColor,
        }) */;
    }, [muiTheme, showOverlay, shouldHidePinnedHeaderRightBorder, customizeGridTheme]);

    return (
        <Box width="auto" height="100%" position="relative" sx={sx}>
            <AgGridReact
                ref={ref}
                getLocaleText={getLocaleText}
                onColumnResized={onColumnResized}
                enableCellTextSelection
                theme={computedTheme}
                {...agGridReactProps}
            />
        </Box>
    );
});
