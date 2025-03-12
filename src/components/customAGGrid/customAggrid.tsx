/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    CellApiModule,
    CellStyleModule,
    CheckboxEditorModule,
    ClientSideRowModelModule,
    ColumnApiModule,
    ColumnAutoSizeModule,
    type ColumnResizedEvent,
    CsvExportModule,
    CustomEditorModule,
    CustomFilterModule,
    DateEditorModule,
    DateFilterModule,
    ExternalFilterModule,
    type GetLocaleTextParams,
    type GridOptions,
    GridStateModule,
    HighlightChangesModule,
    LargeTextEditorModule,
    LocaleModule,
    type Module,
    NumberEditorModule,
    NumberFilterModule,
    PaginationModule,
    QuickFilterModule,
    RowApiModule,
    RowAutoHeightModule,
    RowDragModule,
    RowSelectionModule,
    RowStyleModule,
    ScrollApiModule,
    SelectEditorModule,
    TextEditorModule,
    TextFilterModule,
    TooltipModule,
    UndoRedoEditModule,
    ValidationModule,
    ValueCacheModule,
} from 'ag-grid-community';
import { useIntl } from 'react-intl';
import { Box, type SxProps, type Theme, useTheme } from '@mui/material';
import { mergeSx } from '../../utils/styles';
import { CUSTOM_AGGRID_THEME, styles } from './customAggrid.style';
import { I18N_GRID_PREFIX } from '../../translations/agGridLocales';

/**
 * AgGrid modules we used in apps.
 * @remarks We don't use {@link import('ag-grid-community').AllCommunityModule AllCommunityModule} to optimize
 *   bundle size and to exclude {@link ValidationModule} from production build
 * @remarks We can't use `ModuleRegistry.registerModules()` because that would include AgGrid into the apps build
 *   just by doing <code>import ... from '@gridsuite/commons-ui'</code> in apps code...
 * @see https://www.ag-grid.com/react-data-grid/modules/
 */
const agGridModules: Module[] = [
    /* ~~~ Row Model ~~~ */ // https://www.ag-grid.com/javascript-data-grid/row-models/
    ClientSideRowModelModule, // (default)
    // InfiniteRowModelModule, // https://www.ag-grid.com/javascript-data-grid/infinite-scrolling/
    /* ~~~ Columns ~~~ */
    ColumnAutoSizeModule, // https://www.ag-grid.com/react-data-grid/column-sizing/#auto-sizing-columns
    // ColumnHoverModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-Visibility%20and%20Display-isColumnHovered
    /* ~~~ Rows ~~~ */
    // PinnedColumnModule, // https://www.ag-grid.com/react-data-grid/row-pinning/
    RowAutoHeightModule, // https://www.ag-grid.com/react-data-grid/row-height/#auto-row-height
    RowStyleModule, // https://www.ag-grid.com/react-data-grid/row-styles/
    PaginationModule, // https://www.ag-grid.com/react-data-grid/row-pagination/
    RowDragModule, // https://www.ag-grid.com/react-data-grid/row-dragging/
    /* ~~~ Cells ~~~ */
    CellStyleModule, // https://www.ag-grid.com/react-data-grid/cell-styles/
    HighlightChangesModule, // https://www.ag-grid.com/react-data-grid/change-cell-renderers/
    TooltipModule, // https://www.ag-grid.com/react-data-grid/tooltips/
    /* ~~~ Filtering ~~~ */
    TextFilterModule, // https://www.ag-grid.com/react-data-grid/filter-text/
    NumberFilterModule, // https://www.ag-grid.com/react-data-grid/filter-number/
    DateFilterModule, // https://www.ag-grid.com/react-data-grid/filter-date/
    CustomFilterModule, // https://www.ag-grid.com/react-data-grid/component-filter/
    ExternalFilterModule, // https://www.ag-grid.com/react-data-grid/filter-external/
    QuickFilterModule, // https://www.ag-grid.com/react-data-grid/filter-quick/
    /* ~~~ Selection ~~~ */
    RowSelectionModule, // https://www.ag-grid.com/react-data-grid/row-selection/
    /* ~~~ Editing ~~~ */
    TextEditorModule, // https://www.ag-grid.com/react-data-grid/provided-cell-editors-text/
    LargeTextEditorModule, // https://www.ag-grid.com/react-data-grid/provided-cell-editors-large-text/
    SelectEditorModule, // https://www.ag-grid.com/react-data-grid/provided-cell-editors-select/
    NumberEditorModule, // https://www.ag-grid.com/react-data-grid/provided-cell-editors-number/
    DateEditorModule, // https://www.ag-grid.com/react-data-grid/provided-cell-editors-date/
    CheckboxEditorModule, // https://www.ag-grid.com/react-data-grid/provided-cell-editors-checkbox/
    CustomEditorModule, // https://www.ag-grid.com/react-data-grid/cell-editors/#custom-components
    UndoRedoEditModule, // https://www.ag-grid.com/react-data-grid/undo-redo-edits/
    /* ~~~ Interactivity ~~~ */
    LocaleModule, // https://www.ag-grid.com/react-data-grid/localisation/
    /* ~~~ Import & Export ~~~ */
    CsvExportModule, // https://www.ag-grid.com/react-data-grid/csv-export/
    // RowDragModule, // https://www.ag-grid.com/react-data-grid/drag-and-drop/
    /* ~~~ Performance ~~~ */
    ValueCacheModule, // https://www.ag-grid.com/react-data-grid/value-cache/
    /* ~~~ Other ~~~ */
    // AlignedGridsModule, // https://www.ag-grid.com/react-data-grid/aligned-grids/
    /* ~~~ API ~~~ */
    GridStateModule, // https://www.ag-grid.com/react-data-grid/grid-state/
    ColumnApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-columns
    RowApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-displayedRows
    CellApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-miscellaneous-getCellValue
    ScrollApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-scrolling
    // RenderApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-rendering
    // EventApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-events
    // ClientSideRowModelApiModule, // https://www.ag-grid.com/react-data-grid/grid-api/#reference-data
    /* ~~~ Dev Mode ~~~ */
    ...(import.meta.env.DEV
        ? [
              ValidationModule, // https://www.ag-grid.com/react-data-grid/modules/#validation
          ]
        : []),
];

export type CustomAGGridProps<TData = any> = GridOptions<TData> & {
    shouldHidePinnedHeaderRightBorder?: boolean;
    showOverlay?: boolean;
};

// We have to define a minWidth to column to activate this feature
function onColumnResized({ api, column, finished, source }: ColumnResizedEvent) {
    if (column && finished) {
        const { minWidth } = column.getColDef();
        const actualWidth = column.getActualWidth();
        if (minWidth !== undefined && actualWidth < minWidth) {
            api.setColumnWidths([{ key: column, newWidth: minWidth }], finished, source);
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
                modules={agGridModules}
                getLocaleText={getLocaleText}
                onColumnResized={onColumnResized}
                enableCellTextSelection
                theme="legacy"
                {...agGridReactProps}
            />
        </Box>
    );
});
