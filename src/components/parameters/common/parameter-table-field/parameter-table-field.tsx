/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, SxProps, TooltipProps, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FieldValues, useFieldArray, useFormContext } from 'react-hook-form';
import { Info as InfoIcon } from '@mui/icons-material';
import { useCallback, useMemo, useRef } from 'react';
import { CustomTooltip } from '../../../tooltip/CustomTooltip';
import { DndTable, DndTableProps, getDefaultRowData } from '../../../dnd-table-v2';

export type ParameterDndTableFieldProps = {
    label?: string;
    tooltipProps?: Omit<TooltipProps, 'children'>;
    sxContainerProps?: SxProps;
    // check whether row data is valid before propagate onChange (e.g., to fetch data))
    isValidRow?: (rowData: FieldValues) => boolean;
    onChange?: () => void;
} & Omit<DndTableProps, 'useFieldArrayOutput' | 'onChange' | 'onDelete'>;

export function ParameterTableField({
    name,
    label,
    columnsDefinition,
    tooltipProps,
    sxContainerProps,
    onChange,
    isValidRow,
    ...otherProps
}: Readonly<ParameterDndTableFieldProps>) {
    const useFieldArrayOutput = useFieldArray({
        name,
    });

    const { getValues } = useFormContext();
    // This Ref keeps the previous valid row count to optimize whether propagating onChange
    const validRowCountRef = useRef(
        getValues(name)?.filter((row: FieldValues) => (isValidRow ? isValidRow(row) : true)).length
    );

    const newDefaultRowData = useMemo(() => {
        return getDefaultRowData(columnsDefinition);
    }, [columnsDefinition]);

    const createRows = useCallback(
        (numberOfRows: number) => Array.from({ length: numberOfRows }, () => ({ ...newDefaultRowData })),
        [newDefaultRowData]
    );

    const { title, ...otherTooltipProps } = tooltipProps || {};

    const handleOnChange = useCallback(
        (changedRow: any) => {
            const currentValidRowCount = getValues(name).filter((row: FieldValues) =>
                isValidRow ? isValidRow(row) : true
            ).length;
            const previousValidRowCount = validRowCountRef.current;
            validRowCountRef.current = currentValidRowCount;

            if (isValidRow ? isValidRow(changedRow) : true) {
                onChange?.();
            } else if (previousValidRowCount !== currentValidRowCount) {
                onChange?.();
            }
        },
        [isValidRow, onChange, getValues, name]
    );

    const handleOnDelete = useCallback(
        (removedRows: any[]) => {
            const wasValidRowCount = removedRows.filter((row: FieldValues) =>
                isValidRow ? isValidRow(row) : true
            ).length;
            if (wasValidRowCount > 0) {
                validRowCountRef.current -= wasValidRowCount;
                // trigger onChange to propagate the deletion of valid rows
                onChange?.();
            }
        },
        [isValidRow, onChange]
    );

    return (
        <Grid container sx={sxContainerProps}>
            {label && (
                <Grid container alignItems="center" paddingBottom={2} paddingTop={2}>
                    <Typography component="span" variant="h6">
                        <FormattedMessage id={label} />
                    </Typography>
                    {tooltipProps && (
                        <CustomTooltip
                            title={typeof title === 'string' ? <FormattedMessage id={title} /> : title}
                            sx={{ marginLeft: 1 }}
                            {...otherTooltipProps}
                        >
                            <InfoIcon />
                        </CustomTooltip>
                    )}
                </Grid>
            )}
            <DndTable
                name={name}
                useFieldArrayOutput={useFieldArrayOutput}
                columnsDefinition={columnsDefinition}
                createRows={createRows}
                withAddRowsDialog={false}
                onChange={handleOnChange}
                onDelete={handleOnDelete}
                {...otherProps}
            />
        </Grid>
    );
}
