/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { FieldConstants } from '../../../utils';
import { DndColumnType, DndTable } from '../../../components/composite';
import { SelectInput } from '../../../components/ui';
import { ShiftEquipmentType, ShiftType } from './balancesAdjustment.types';
import { balancesAdjustmentStyles } from './balancesAdjustment.styles';
import { CountriesAutocomplete } from './CountriesAutocomplete';

export interface BalancesAdjustmentTableProps {
    countryCodes: string[];
    translate: (countryCode: string) => string;
}

export function BalancesAdjustmentTable({ countryCodes, translate }: Readonly<BalancesAdjustmentTableProps>) {
    const intl = useIntl();

    const columnsDefinition = useMemo(() => {
        return [
            {
                label: 'BalancesAdjustmentZone',
                dataKey: FieldConstants.BALANCES_ADJUSTMENT_ZONE,
                editable: true,
                type: DndColumnType.TEXT as const,
                initialValue: '',
                width: '110px',
                dataTestId: 'ZoneNameInput',
            },
            {
                label: 'BalancesAdjustmentCountry',
                dataKey: FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES,
                editable: true,
                type: DndColumnType.CUSTOM as const,
                component: (rowIndex: number) =>
                    CountriesAutocomplete({
                        name: `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ZONES}[${rowIndex}].${FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES}`,
                        dataTestId: 'CountriesInput',
                        countryCodes,
                        translate,
                    }),
                initialValue: [],
                width: '280px',
                maxWidth: '280px',
            },
            {
                label: 'BalancesAdjustmentShiftEquipmentType',
                dataKey: FieldConstants.BALANCES_ADJUSTMENT_SHIFT_EQUIPMENT_TYPE,
                editable: true,
                type: DndColumnType.CUSTOM as const,
                component: (rowIndex: number) =>
                    SelectInput({
                        name: `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ZONES}[${rowIndex}].${FieldConstants.BALANCES_ADJUSTMENT_SHIFT_EQUIPMENT_TYPE}`,
                        options: Object.values(ShiftEquipmentType).map((value) => ({ id: value, label: value })),
                        disableClearable: true,
                        sx: balancesAdjustmentStyles.autocomplete,
                        dataTestId: 'ShiftEquipmentTypeInput',
                    }),
                initialValue: ShiftEquipmentType.GENERATOR,
                width: '150px',
            },
            {
                label: 'BalancesAdjustmentShiftType',
                dataKey: FieldConstants.BALANCES_ADJUSTMENT_SHIFT_TYPE,
                editable: true,
                type: DndColumnType.CUSTOM as const,
                component: (rowIndex: number) =>
                    SelectInput({
                        name: `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ZONES}[${rowIndex}].${FieldConstants.BALANCES_ADJUSTMENT_SHIFT_TYPE}`,
                        options: Object.values(ShiftType).map((value) => ({ id: value, label: value })),
                        disableClearable: true,
                        sx: balancesAdjustmentStyles.autocomplete,
                        dataTestId: 'ShiftTypeInput',
                    }),
                initialValue: ShiftType.PROPORTIONAL,
                width: '150px',
            },
            {
                label: 'BalancesAdjustmentTarget',
                dataKey: FieldConstants.BALANCES_ADJUSTMENT_TARGET,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                initialValue: 0,
                width: '110px',
                dataTestId: 'NetPositionTargetInput',
            },
        ].map((column) => ({
            ...column,
            label: intl
                .formatMessage({ id: column.label })
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase()),
        }));
    }, [intl, countryCodes, translate]);

    const useFieldArrayOutputBalancesAdjustment = useFieldArray({
        name: `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ZONES}`,
    });

    const createRow = useCallback(() => {
        const newRowData: Record<string, unknown> = {};
        newRowData[FieldConstants.SELECTED] = false;
        columnsDefinition.forEach((column) => {
            newRowData[column.dataKey] = column.initialValue;
        });
        return [newRowData];
    }, [columnsDefinition]);

    return (
        <DndTable
            name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ZONES}`}
            useFieldArrayOutput={useFieldArrayOutputBalancesAdjustment}
            createRows={createRow}
            columnsDefinition={columnsDefinition}
            tableHeight={450}
            withAddRowsDialog={false}
            rowDataTestId="AreaLine"
        />
    );
}
