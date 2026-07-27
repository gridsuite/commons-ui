/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Grid2 as Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { TemporaryLimitsTable } from './TemporaryLimitsTable';
import { LimitsChart } from './limitsChart';
import { LimitsPropertiesSideStack } from './LimitsPropertiesSideStack';
import { APPLICABILITY, TEMPORARY_LIMIT_MODIFICATION_TYPE, TemporaryLimitsData } from '../limits.types';
import {
    ColumnNumeric,
    ColumnText,
    DndColumn,
    DndColumnType,
    ErrorInput,
    FieldErrorAlert,
    FloatInput,
    SelectInput,
    TextInput,
    useCustomFormContext,
} from '../../../../../components';
import { AmpereAdornment, FieldConstants } from '../../../../../utils';

export interface LimitsEditorProps {
    name?: string;
    permanentCurrentLimitPreviousValue: number | null | undefined;
    temporaryLimitsPreviousValues: TemporaryLimitsData[];
    applicabilityPreviousValue?: string;
    clearableFields: boolean | undefined;
    disabled: boolean;
}

export function LimitsEditor({
    name,
    permanentCurrentLimitPreviousValue,
    temporaryLimitsPreviousValues,
    applicabilityPreviousValue,
    clearableFields,
    disabled,
}: Readonly<LimitsEditorProps>) {
    const intl = useIntl();
    const { getValues, subscribe, trigger } = useFormContext();
    const { isNodeBuilt } = useCustomFormContext();
    const limitsGroupFormName = `${name}.${FieldConstants.CURRENT_LIMITS}`;
    const columnsDefinition: ((ColumnText | ColumnNumeric) & { initialValue: string | null })[] = useMemo(() => {
        return [
            {
                label: 'TemporaryLimitName',
                dataKey: FieldConstants.TEMPORARY_LIMIT_NAME,
                initialValue: '',
                editable: true,
                type: DndColumnType.TEXT as const,
                maxWidth: 200,
            },
            {
                label: 'TemporaryLimitDuration',
                dataKey: FieldConstants.TEMPORARY_LIMIT_DURATION,
                initialValue: null,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                maxWidth: 100,
            },
            {
                label: 'TemporaryLimitValue',
                dataKey: FieldConstants.TEMPORARY_LIMIT_VALUE,
                initialValue: null,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                maxWidth: 100,
            },
        ].map((column) => ({
            ...column,
            label: intl.formatMessage({ id: column.label }),
        }));
    }, [intl]);

    const newRowData = useMemo(() => {
        const newData: any = {};
        columnsDefinition.forEach((column) => {
            newData[column.dataKey] = column.initialValue;
        });
        return newData;
    }, [columnsDefinition]);
    const createRows = () => [newRowData];

    const temporaryLimitHasPreviousValue = useCallback(
        (rowIndex: number, arrayFormName: string, temporaryLimits?: TemporaryLimitsData[]) => {
            if (!temporaryLimits) {
                return false;
            }
            return (
                temporaryLimits?.filter(
                    (l: TemporaryLimitsData) =>
                        l.name === getValues(arrayFormName)[rowIndex]?.name &&
                        l.acceptableDuration === getValues(arrayFormName)[rowIndex]?.acceptableDuration
                )?.length > 0
            );
        },
        [getValues]
    );

    const shouldReturnPreviousValue = useCallback(
        (rowIndex: number, column: DndColumn, arrayFormName: string, temporaryLimits: TemporaryLimitsData[]) => {
            return (
                (temporaryLimitHasPreviousValue(rowIndex, arrayFormName, temporaryLimits) &&
                    column.dataKey === FieldConstants.TEMPORARY_LIMIT_VALUE) ||
                getValues(arrayFormName)[rowIndex]?.modificationType === TEMPORARY_LIMIT_MODIFICATION_TYPE.ADD
            );
        },
        [getValues, temporaryLimitHasPreviousValue]
    );

    const findTemporaryLimit = useCallback(
        (rowIndex: number, arrayFormName: string, temporaryLimits: TemporaryLimitsData[]) => {
            return temporaryLimits?.find(
                (e: TemporaryLimitsData) =>
                    e.name === getValues(arrayFormName)[rowIndex]?.name &&
                    e.acceptableDuration === getValues(arrayFormName)[rowIndex]?.acceptableDuration
            );
        },
        [getValues]
    );

    const getPreviousValue = useCallback(
        (rowIndex: number, column: DndColumn, arrayFormName: string, temporaryLimits?: TemporaryLimitsData[]) => {
            if (!temporaryLimits) {
                return undefined;
            }
            if (!temporaryLimits?.length) {
                return undefined;
            }
            if (!shouldReturnPreviousValue(rowIndex, column, arrayFormName, temporaryLimits)) {
                return undefined;
            }
            const temporaryLimit = findTemporaryLimit(rowIndex, arrayFormName, temporaryLimits);
            if (temporaryLimit === undefined) {
                return undefined;
            }
            if (column.dataKey === FieldConstants.TEMPORARY_LIMIT_VALUE) {
                return temporaryLimit?.value ?? Number.MAX_VALUE;
            }
            if (column.dataKey === FieldConstants.TEMPORARY_LIMIT_DURATION) {
                return temporaryLimit?.acceptableDuration ?? Number.MAX_VALUE;
            }
            return undefined;
        },
        [findTemporaryLimit, shouldReturnPreviousValue]
    );

    const isValueModified = useCallback(
        (rowIndex: number, arrayFormName: string) => {
            const temporaryLimits = getValues(arrayFormName);
            const temporaryLimit = temporaryLimits ? temporaryLimits[rowIndex] : null;
            if (temporaryLimit?.modificationType === TEMPORARY_LIMIT_MODIFICATION_TYPE.MODIFY && !isNodeBuilt) {
                return false;
            }
            return temporaryLimit?.modificationType !== null;
        },
        [getValues, isNodeBuilt]
    );

    // Trigger all OLG_IS_DUPLICATE fields when change on applicability or name field
    useEffect(() => {
        const unsubscribeCallBack = subscribe({
            name: [`${name}.${FieldConstants.APPLICABILITY_FIELD}`, `${name}.${FieldConstants.NAME}`],
            formState: {
                values: true,
            },
            callback: ({ isSubmitted }) => {
                if (isSubmitted) {
                    const operationalLimitsGroups = getValues(
                        `${FieldConstants.LIMITS}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}`
                    );
                    for (let index = 0; index < operationalLimitsGroups?.length; index++) {
                        trigger(
                            `${FieldConstants.LIMITS}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}[${index}].${FieldConstants.OLG_IS_DUPLICATE}`
                        ).then();
                    }
                }
            },
        });
        return () => unsubscribeCallBack();
    }, [trigger, subscribe, name, getValues]);

    const {
        fieldState: { error },
    } = useController({
        name: `${name}.${FieldConstants.OLG_IS_DUPLICATE}`,
    });

    return (
        <Box sx={{ p: 2 }}>
            <LimitsChart
                limitsGroupFormName={limitsGroupFormName}
                previousPermanentLimit={permanentCurrentLimitPreviousValue}
            />
            {name && (
                <Box>
                    <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        sx={{ paddingBottom: 1, paddingTop: 3 }}
                    >
                        <Grid size={4}>
                            <TextInput
                                name={`${name}.${FieldConstants.NAME}`}
                                label="name"
                                formProps={error?.message ? { error: true } : {}}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={4}>
                            <SelectInput
                                label="Applicability"
                                options={Object.values(APPLICABILITY)}
                                name={`${name}.${FieldConstants.APPLICABILITY_FIELD}`}
                                previousValue={applicabilityPreviousValue}
                                sx={{ flexGrow: 1 }}
                                disableClearable
                                size="small"
                                disabled={disabled}
                                formProps={{ error: !!error?.message }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <FloatInput
                                name={`${limitsGroupFormName}.${FieldConstants.PERMANENT_LIMIT}`}
                                label="PermanentCurrentLimitText"
                                adornment={AmpereAdornment}
                                previousValue={permanentCurrentLimitPreviousValue ?? undefined}
                                clearable={!disabled && clearableFields}
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                    <ErrorInput InputField={FieldErrorAlert} name={`${name}.${FieldConstants.OLG_IS_DUPLICATE}`} />
                </Box>
            )}

            <Box component="h4" margin={1}>
                <FormattedMessage id="TemporaryCurrentLimitsText" />
            </Box>
            <TemporaryLimitsTable
                arrayFormName={`${limitsGroupFormName}.${FieldConstants.TEMPORARY_LIMITS}`}
                createRow={createRows}
                columnsDefinition={columnsDefinition}
                previousValues={temporaryLimitsPreviousValues}
                getPreviousValue={getPreviousValue}
                isValueModified={isValueModified}
                disabled={disabled}
            />
            <LimitsPropertiesSideStack name={`${name}.${FieldConstants.LIMITS_PROPERTIES}`} disabled={disabled} />
        </Box>
    );
}
