/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, SxProps, Tooltip, TooltipProps, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useFieldArray } from 'react-hook-form';
import { Info as InfoIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { DndTable, DndTableProps } from '../../dnd-table';

export type ParameterDndTableFieldProps = {
    name: string;
    label: string;
    tooltipProps?: Omit<TooltipProps, 'children'>;
    sxContainerProps?: SxProps;
} & Omit<DndTableProps, 'arrayFormName' | 'useFieldArrayOutput'>;

export default function ParameterDndTableField({
    name,
    label,
    columnsDefinition,
    tooltipProps,
    sxContainerProps,
    ...otherProps
}: Readonly<ParameterDndTableFieldProps>) {
    const useFieldArrayOutput = useFieldArray({
        name,
    });

    const newDefaultRowData = useMemo(() => {
        const newRowData: Record<string, any> = {};
        columnsDefinition.forEach((columnDefinition) => {
            newRowData[columnDefinition.dataKey] = columnDefinition.initialValue || null;
        });
        return newRowData;
    }, [columnsDefinition]);

    const createRows = useCallback(() => [newDefaultRowData], [newDefaultRowData]);

    const { title, ...otherTooltipProps } = tooltipProps || {};
    return (
        <Grid container sx={sxContainerProps}>
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
            <DndTable
                arrayFormName={name}
                useFieldArrayOutput={useFieldArrayOutput}
                columnsDefinition={columnsDefinition}
                createRows={createRows}
                withAddRowsDialog={false}
                {...otherProps}
            />
        </Grid>
    );
}
