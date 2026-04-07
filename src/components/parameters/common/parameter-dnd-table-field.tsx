/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, SxProps, Tooltip, TooltipProps, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FieldValues, useFieldArray, useFormContext } from 'react-hook-form';
import { Info as InfoIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { DndTable, DndTableProps, getDefaultRowData } from '../../dnd-table-v2';

export type ParameterDndTableFieldProps = {
    label?: string;
    tooltipProps?: Omit<TooltipProps, 'children'>;
    sxContainerProps?: SxProps;
    // check whether row data is valid before propagate onChange (e.g., to fetch data))
    isValidRow?: (rowData: FieldValues) => boolean;
} & Omit<DndTableProps, 'useFieldArrayOutput'>;

export default function ParameterDndTableField({
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

    const newDefaultRowData = useMemo(() => {
        return getDefaultRowData(columnsDefinition);
    }, [columnsDefinition]);

    const createRows = useCallback(() => [newDefaultRowData], [newDefaultRowData]);

    const { title, ...otherTooltipProps } = tooltipProps || {};

    const handleOnChange = useCallback(() => {
        const rowsData = getValues(name) || [];
        const allRowsValid = isValidRow ? rowsData.every((row: FieldValues) => isValidRow(row)) : true;
        if (allRowsValid) {
            onChange?.();
        }
    }, [getValues, isValidRow, onChange, name]);

    return (
        <Grid container sx={sxContainerProps}>
            {label && (
                <Grid container alignItems="center" paddingBottom={2} paddingTop={2}>
                    <Typography component="span" variant="h6">
                        <FormattedMessage id={label} />
                    </Typography>
                    {tooltipProps && (
                        <Tooltip
                            title={typeof title === 'string' ? <FormattedMessage id={title} /> : title}
                            placement="right-start"
                            sx={{ marginLeft: 1 }}
                            {...otherTooltipProps}
                        >
                            <InfoIcon />
                        </Tooltip>
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
                {...otherProps}
            />
        </Grid>
    );
}
