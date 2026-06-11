/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { RowClassParams } from 'ag-grid-community';
import { Box, useTheme } from '@mui/material';
import {
    ConstraintsFromContingencyItem,
    ContingenciesFromConstraintItem,
    CutOffPowerFromConstraintsItem,
    NmkType,
    SecurityAnalysisResultNmkProps,
} from './security-analysis.type';
import {
    flattenNmKResultsConstraints,
    flattenNmKResultsContingencies,
    handlePostSortRows,
    mapNmKResultsCutOffPower,
    PAGE_OPTIONS,
} from './security-analysis-result-utils';
import { SecurityAnalysisTable } from './security-analysis-table';

import CustomTablePagination from './custom-table-pagination';
import { MuiStyles } from '../../utils';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
} as const satisfies MuiStyles;

export function SecurityAnalysisResultNmk({
    result,
    columnDefs,
    nmkType,
    paginationProps,
    overlayNoRowsTemplate,
    onGridReady,
}: SecurityAnalysisResultNmkProps) {
    const content = result?.content ?? null;

    const theme = useTheme();
    const intl: IntlShape = useIntl();

    const rows = useMemo(() => {
        switch (nmkType) {
            case NmkType.CONSTRAINTS_FROM_CONTINGENCIES:
                return flattenNmKResultsContingencies(intl, content as ConstraintsFromContingencyItem[]);
            case NmkType.CONTINGENCIES_FROM_CONSTRAINTS:
                return flattenNmKResultsConstraints(intl, content as ContingenciesFromConstraintItem[]);
            case NmkType.CUT_OFF_POWER_FROM_CONSTRAINTS:
                return mapNmKResultsCutOffPower(content as CutOffPowerFromConstraintsItem[]);
            default:
                return undefined;
        }
    }, [nmkType, intl, content]);

    const getRowStyle = useCallback(
        (params: RowClassParams) => {
            if (
                (nmkType === NmkType.CONSTRAINTS_FROM_CONTINGENCIES && params?.data?.contingencyId) ||
                (nmkType === NmkType.CONTINGENCIES_FROM_CONSTRAINTS && params?.data?.subjectId)
            ) {
                return {
                    backgroundColor: theme.selectedRow.background,
                };
            }
            return undefined;
        },
        [nmkType, theme.selectedRow.background]
    );

    const agGridProps = useMemo(
        () => ({
            postSortRows: handlePostSortRows(nmkType === NmkType.CONSTRAINTS_FROM_CONTINGENCIES),
            getRowStyle,
            tooltipShowDelay: 0,
        }),
        [getRowStyle, nmkType]
    );

    return (
        <Box sx={styles.container}>
            <Box sx={{ flexGrow: 1 }}>
                <SecurityAnalysisTable
                    rowData={rows}
                    columnDefs={columnDefs}
                    overlayNoRowsTemplate={overlayNoRowsTemplate}
                    agGridProps={agGridProps}
                    onGridReady={onGridReady}
                />
            </Box>
            <Box>
                <CustomTablePagination rowsPerPageOptions={PAGE_OPTIONS} {...paginationProps} />
            </Box>
        </Box>
    );
}
