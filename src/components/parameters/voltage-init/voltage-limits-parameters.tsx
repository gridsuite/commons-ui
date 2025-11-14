/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Info as InfoIcon } from '@mui/icons-material';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    HIGH_VOLTAGE_LIMIT,
    LOW_VOLTAGE_LIMIT,
    VOLTAGE_LIMITS_DEFAULT,
    VOLTAGE_LIMITS_MODIFICATION,
} from './constants';
import { ElementType, EquipmentType } from '../../../utils';
import { VoltageAdornment } from '../common';
import { DndColumn, DndColumnType, DndTable, SELECTED } from '../../dnd-table';
import { FILTERS } from '../../../utils/constants/filterConstant';

export function VoltageLimitsParameters() {
    const intl = useIntl();
    const VoltageLevelFilterTooltip = useMemo(() => {
        return (
            <Tooltip
                title={intl.formatMessage({
                    id: 'VoltageLevelFilterTooltip',
                })}
            >
                <IconButton>
                    <InfoIcon />
                </IconButton>
            </Tooltip>
        );
    }, [intl]);

    const VOLTAGE_LIMITS_MODIFICATION_COLUMNS_DEFINITIONS: (DndColumn & { initialValue: unknown[] | null })[] =
        useMemo(() => {
            return (
                [
                    {
                        label: 'VoltageLevelFilter',
                        dataKey: FILTERS,
                        initialValue: [],
                        editable: true,
                        type: DndColumnType.DIRECTORY_ITEMS,
                        equipmentTypes: [EquipmentType.VOLTAGE_LEVEL],
                        elementType: ElementType.FILTER,
                        titleId: 'FiltersListsSelection',
                        extra: VoltageLevelFilterTooltip,
                    },
                    {
                        label: 'LowVoltageLimitAdjustment',
                        dataKey: LOW_VOLTAGE_LIMIT,
                        initialValue: null,
                        editable: true,
                        type: DndColumnType.NUMERIC,
                        adornment: VoltageAdornment,
                        textAlign: 'right',
                    },
                    {
                        label: 'HighVoltageLimitAdjustment',
                        dataKey: HIGH_VOLTAGE_LIMIT,
                        initialValue: null,
                        editable: true,
                        type: DndColumnType.NUMERIC,
                        adornment: VoltageAdornment,
                        textAlign: 'right',
                    },
                ] satisfies (DndColumn & { initialValue: unknown[] | null })[]
            ).map((column) => ({
                ...column,
                label: intl
                    .formatMessage({ id: column.label })
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()),
            }));
        }, [VoltageLevelFilterTooltip, intl]);

    const VOLTAGE_LIMITS_DEFAULT_COLUMNS_DEFINITIONS: (DndColumn & { initialValue: unknown[] | null })[] =
        useMemo(() => {
            return (
                [
                    {
                        label: 'VoltageLevelFilter',
                        dataKey: FILTERS,
                        initialValue: [],
                        editable: true,
                        type: DndColumnType.DIRECTORY_ITEMS,
                        equipmentTypes: [EquipmentType.VOLTAGE_LEVEL],
                        elementType: ElementType.FILTER,
                        titleId: 'FiltersListsSelection',
                        extra: VoltageLevelFilterTooltip,
                    },
                    {
                        label: 'LowVoltageLimitDefault',
                        dataKey: LOW_VOLTAGE_LIMIT,
                        initialValue: null,
                        editable: true,
                        type: DndColumnType.NUMERIC,
                        adornment: VoltageAdornment,
                        textAlign: 'right',
                    },
                    {
                        label: 'HighVoltageLimitDefault',
                        dataKey: HIGH_VOLTAGE_LIMIT,
                        initialValue: null,
                        editable: true,
                        type: DndColumnType.NUMERIC,
                        adornment: VoltageAdornment,
                        textAlign: 'right',
                    },
                ] satisfies (DndColumn & { initialValue: unknown[] | null })[]
            ).map((column) => ({
                ...column,
                label: intl
                    .formatMessage({ id: column.label })
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()),
            }));
        }, [VoltageLevelFilterTooltip, intl]);

    const newModificationRowData = useMemo(() => {
        const newRowData: Record<string, any> = {};
        newRowData[SELECTED] = false;
        VOLTAGE_LIMITS_MODIFICATION_COLUMNS_DEFINITIONS.forEach((column) => {
            newRowData[column.dataKey] = column.initialValue;
        });
        return newRowData;
    }, [VOLTAGE_LIMITS_MODIFICATION_COLUMNS_DEFINITIONS]);

    const createVoltageLimitModificationRows = () => [newModificationRowData];

    const newDefaultRowData = useMemo(() => {
        const newRowData: Record<string, any> = {};
        newRowData[SELECTED] = false;
        VOLTAGE_LIMITS_DEFAULT_COLUMNS_DEFINITIONS.forEach((column) => {
            newRowData[column.dataKey] = column.initialValue;
        });
        return newRowData;
    }, [VOLTAGE_LIMITS_DEFAULT_COLUMNS_DEFINITIONS]);

    const createVoltageLimitDefaultRows = () => [newDefaultRowData];

    const useVoltageLimitsModificationFieldArrayOutput = useFieldArray({
        name: `${VOLTAGE_LIMITS_MODIFICATION}`,
    });

    const useVoltageLimitsDefaultFieldArrayOutput = useFieldArray({
        name: `${VOLTAGE_LIMITS_DEFAULT}`,
    });

    return (
        <Grid container>
            <Grid container alignItems="center">
                <Typography component="span" variant="h6">
                    <FormattedMessage id="AdjustExistingLimits" />
                </Typography>
                <Tooltip
                    title={<FormattedMessage id="AdjustExistingLimitsInfo" />}
                    placement="right-start"
                    sx={{ marginLeft: 1 }}
                >
                    <InfoIcon />
                </Tooltip>
            </Grid>
            <DndTable
                arrayFormName={`${VOLTAGE_LIMITS_MODIFICATION}`}
                columnsDefinition={VOLTAGE_LIMITS_MODIFICATION_COLUMNS_DEFINITIONS}
                useFieldArrayOutput={useVoltageLimitsModificationFieldArrayOutput}
                createRows={createVoltageLimitModificationRows}
                tableHeight={270}
                withAddRowsDialog={false}
            />

            <Typography component="span" variant="h6">
                <FormattedMessage id="SetDefaultLimits" />
            </Typography>
            <DndTable
                arrayFormName={`${VOLTAGE_LIMITS_DEFAULT}`}
                columnsDefinition={VOLTAGE_LIMITS_DEFAULT_COLUMNS_DEFINITIONS}
                useFieldArrayOutput={useVoltageLimitsDefaultFieldArrayOutput}
                createRows={createVoltageLimitDefaultRows}
                tableHeight={270}
                withAddRowsDialog={false}
            />
        </Grid>
    );
}
