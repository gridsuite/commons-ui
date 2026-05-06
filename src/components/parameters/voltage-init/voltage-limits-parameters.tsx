/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { Info as InfoIcon } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useIntl } from 'react-intl';
import { CustomTooltip } from '../../tooltip/CustomTooltip';
import {
    HIGH_VOLTAGE_LIMIT,
    LOW_VOLTAGE_LIMIT,
    VOLTAGE_LIMITS_DEFAULT,
    VOLTAGE_LIMITS_MODIFICATION,
} from './constants';
import { ElementType, EquipmentType } from '../../../utils';
import { DndColumn, DndColumnType, SELECTED } from '../../dnd-table-v2';
import { FILTERS } from '../../../utils/constants/filterConstant';
import { VoltageAdornment } from '../../../utils/constants/adornments';
import { ParameterTableField } from '../common/parameter-table-field';

export function VoltageLimitsParameters() {
    const intl = useIntl();
    const VoltageLevelFilterTooltip = useMemo(() => {
        return (
            <CustomTooltip
                title={intl.formatMessage({
                    id: 'VoltageLevelFilterTooltip',
                })}
                sx={{ marginLeft: 1 }}
            >
                <InfoIcon />
            </CustomTooltip>
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
                ] satisfies DndColumn[]
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

    return (
        <Grid container>
            <ParameterTableField
                name={`${VOLTAGE_LIMITS_MODIFICATION}`}
                label="AdjustExistingLimits"
                tooltipProps={{ title: 'AdjustExistingLimitsInfo' }}
                columnsDefinition={VOLTAGE_LIMITS_MODIFICATION_COLUMNS_DEFINITIONS}
                createRows={createVoltageLimitModificationRows}
                tableHeight={270}
                withAddRowsDialog={false}
            />
            <ParameterTableField
                name={`${VOLTAGE_LIMITS_DEFAULT}`}
                label="SetDefaultLimits"
                columnsDefinition={VOLTAGE_LIMITS_DEFAULT_COLUMNS_DEFINITIONS}
                createRows={createVoltageLimitDefaultRows}
                tableHeight={270}
                withAddRowsDialog={false}
            />
        </Grid>
    );
}
