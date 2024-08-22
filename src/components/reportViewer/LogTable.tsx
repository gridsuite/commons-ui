/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { memo, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { TableCell, Theme, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { MuiVirtualizedTable } from '../muiVirtualizedTable';
import { FilterButton } from './FilterButton';
import LogReportItem from './classes/logReportItem';
import { RowProps } from '../muiVirtualizedTable/KeyedColumnsRowIndexer';

const SEVERITY_COLUMN_FIXED_WIDTH = 115;

const styles = {
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: (theme: Theme) => ({
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    }),
    header: { variant: 'header' },
};

const VirtualizedTable = styled(MuiVirtualizedTable)(styles);

export interface LogTableProps {
    logs: LogReportItem[];
    onRowClick: (data: any) => void;
    selectedSeverity: Record<string, boolean>;
    setSelectedSeverity: (func: (items: Record<string, boolean>) => Record<string, boolean>) => void;
}

function LogTable({ logs, onRowClick, selectedSeverity, setSelectedSeverity }: LogTableProps) {
    const intl = useIntl();

    const theme = useTheme();

    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const severityCellRender = (cellData: any) => {
        return (
            <TableCell
                component="div"
                variant="body"
                style={{
                    display: 'flex',
                    flex: '1',
                    backgroundColor: cellData.rowData.backgroundColor,
                }}
                align="center"
            >
                {cellData.rowData.severity}
            </TableCell>
        );
    };

    const COLUMNS_DEFINITIONS = [
        {
            label: intl.formatMessage({ id: 'report_viewer/severity' }).toUpperCase(),
            id: 'severity',
            dataKey: 'severity',
            width: SEVERITY_COLUMN_FIXED_WIDTH,
            maxWidth: SEVERITY_COLUMN_FIXED_WIDTH,
            minWidth: SEVERITY_COLUMN_FIXED_WIDTH,
            cellRenderer: severityCellRender,
            extra: <FilterButton selectedItems={selectedSeverity} setSelectedItems={setSelectedSeverity} />,
        },
        {
            label: intl.formatMessage({ id: 'report_viewer/message' }).toUpperCase(),
            id: 'message',
            dataKey: 'message',
            width: SEVERITY_COLUMN_FIXED_WIDTH,
        },
    ];

    const generateTableColumns = () => {
        return Object.values(COLUMNS_DEFINITIONS).map((c) => {
            return c;
        });
    };

    const generateTableRows = () => {
        return logs.map((log) => {
            return {
                severity: log.getSeverityName(),
                message: log.getLog(),
                backgroundColor: log.getColorName(),
                reportId: log.getReportId(),
            } as RowProps;
        });
    };

    const handleRowClick = (row: { index: number; rowData: unknown }) => {
        setSelectedRowIndex(row.index);
        onRowClick(row.rowData);
    };

    const rowStyleFormat = (row: { index: number }) => {
        if (row.index < 0) {
            return undefined;
        }
        if (selectedRowIndex === row.index) {
            return {
                backgroundColor: theme.palette.action.selected,
            };
        }
        return undefined;
    };

    useEffect(() => {
        setSelectedRowIndex(-1);
    }, [logs]);

    const filter = useCallback(
        (row: { severity: any }) => {
            return (
                row.severity && Object.entries(selectedSeverity).some(([key, value]) => key === row.severity && value)
            );
        },
        [selectedSeverity]
    );

    return (
        // TODO do we need to useMemo/useCallback these props to avoid rerenders ?
        <VirtualizedTable
            columns={generateTableColumns()}
            rows={generateTableRows()}
            sortable={false}
            onRowClick={handleRowClick}
            // rowStyle is not recognized as a property should we delete it ?
            // @ts-ignore
            rowStyle={rowStyleFormat}
            filter={filter}
        />
    );
}

export default memo(LogTable);
