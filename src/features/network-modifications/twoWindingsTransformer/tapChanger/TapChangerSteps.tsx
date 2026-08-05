/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { Addchart as AddchartIcon } from '@mui/icons-material';
import type Papa from 'papaparse';
import { useIntl } from 'react-intl';
import { CreateRuleDialog } from './regulationRule/CreateRuleDialog';
import { ImportRuleDialog } from './regulationRule/ImportRuleDialog';
import { TapChangerMapInfos, TapChangerStep } from '../common/twoWindingsTransformer.types';
import { DndColumn, DndTable, IntegerInput, useCustomFormContext } from '../../../../components';
import { roundToDefaultPrecision } from '../../../../utils/rounding';
import { FieldConstants } from '../../../../utils';
import { compareStepsWithPreviousValues, computeHighTapPosition, toTapChangerStepList } from './tapChanger.utils';
import { TapChangerStepCreationDto } from '../creation/twoWindingsTransformerCreation.types';

export interface TapChangerStepsProps {
    tapChanger: FieldConstants.PHASE_TAP_CHANGER | FieldConstants.RATIO_TAP_CHANGER;
    createTapRuleColumn: string;
    columnsDefinition: DndColumn[];
    csvColumns: string[];
    createRuleMessageId: string;
    createRuleAllowNegativeValues: boolean;
    importRuleMessageId: string;
    resetButtonMessageId: string;
    handleImportRow: (val: Record<string, string>) => Record<string, string | number>;
    disabled?: boolean;
    previousValues?: TapChangerMapInfos;
    editData?: TapChangerStepCreationDto[] | null;
    isModification?: boolean;
}

export function TapChangerSteps({
    tapChanger,
    createTapRuleColumn,
    columnsDefinition,
    csvColumns,
    createRuleMessageId,
    createRuleAllowNegativeValues,
    importRuleMessageId,
    resetButtonMessageId,
    handleImportRow,
    disabled,
    previousValues,
    editData,
    isModification = false,
}: Readonly<TapChangerStepsProps>) {
    const intl = useIntl();

    const { trigger, getValues, setValue, clearErrors } = useFormContext();
    const { isNodeBuilt } = useCustomFormContext();

    const useFieldArrayOutput = useFieldArray({
        name: `${tapChanger}.${FieldConstants.STEPS}`,
    });

    const {
        fields: tapSteps, // don't use it to access form data ! check doc
        replace,
    } = useFieldArrayOutput;

    const lowTapPosition = useWatch({
        name: `${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`,
    });

    const [openCreateRuleDialog, setOpenCreateRuleDialog] = useState(false);
    const [openImportRuleDialog, setOpenImportRuleDialog] = useState(false);

    const disableAddingRows = useMemo(() => {
        return (
            isModification && lowTapPosition === null && previousValues?.[FieldConstants.LOW_TAP_POSITION] === undefined
        );
    }, [isModification, lowTapPosition, previousValues]);

    const allowedToAddTapRows = useCallback(() => {
        // triggering validation on low tap position before generating rows (the field is required)
        // if the trigger returns false, it means the field validation didn't pass -> we don't generate rows
        // the user will see the low tap field in red
        return trigger(`${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`);
    }, [trigger, tapChanger]);

    const createTapRows = useCallback(
        (numberOfRows: number) => {
            const currentLowTapPosition = getValues(`${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`);
            const currentTapRows = getValues(`${tapChanger}.${FieldConstants.STEPS}`);

            let nextHighestTap;
            if (currentTapRows.length === 0) {
                nextHighestTap = currentLowTapPosition;
            } else {
                nextHighestTap = currentTapRows[currentTapRows.length - 1][FieldConstants.STEPS_TAP] + 1;
            }

            const tapRowsToAdd = [];
            for (let i = 0; i < numberOfRows; i++) {
                // we remove STEPS_TAP from the columns with slice
                const newRow = columnsDefinition.slice(1).reduce(
                    (accumulator, currentValue) => ({
                        ...accumulator,
                        [currentValue.dataKey]: currentValue.initialValue,
                    }),
                    { [FieldConstants.STEPS_TAP]: nextHighestTap }
                );
                tapRowsToAdd.push(newRow);
                if (i !== numberOfRows - 1) {
                    nextHighestTap += 1;
                }
            }

            setValue(`${tapChanger}.${FieldConstants.HIGH_TAP_POSITION}`, nextHighestTap);

            return tapRowsToAdd;
        },
        [columnsDefinition, getValues, setValue, tapChanger]
    );

    const tapStepsWatcher = useWatch({
        name: `${tapChanger}.${FieldConstants.STEPS}`,
    });

    const areStepsModified = useMemo(() => {
        if (editData && isNodeBuilt) {
            return true;
        }
        return !compareStepsWithPreviousValues(
            tapStepsWatcher,
            toTapChangerStepList(previousValues?.[FieldConstants.STEPS])
        );
    }, [editData, isNodeBuilt, previousValues, tapStepsWatcher]);

    const resetTapNumbers = useCallback(
        (stepsOverride: TapChangerStep[] | null): void => {
            const currentTapRows: TapChangerStep[] =
                stepsOverride ?? getValues(`${tapChanger}.${FieldConstants.STEPS}`);

            const currentLowTapPosition: number | null | undefined =
                isModification && lowTapPosition === null
                    ? previousValues?.[FieldConstants.LOW_TAP_POSITION]
                    : lowTapPosition;
            if (currentLowTapPosition == null) {
                return;
            }
            for (
                let tapPosition: number | null | undefined = currentLowTapPosition, index = 0;
                index < currentTapRows.length;
                tapPosition!++, index++
            ) {
                setValue(`${tapChanger}.${FieldConstants.STEPS}[${index}].${FieldConstants.STEPS_TAP}`, tapPosition);
            }

            const newHighTapPosition: number | null =
                currentTapRows.length !== 0 ? (currentLowTapPosition ?? 0) + currentTapRows.length - 1 : null;
            setValue(`${tapChanger}.${FieldConstants.HIGH_TAP_POSITION}`, newHighTapPosition);
        },
        [getValues, tapChanger, lowTapPosition, previousValues, setValue, isModification]
    );

    // Adjust high tap position when low tap position change + remove red if value fixed
    useEffect(() => {
        trigger(`${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`).then((result) => {
            if (result) {
                resetTapNumbers(null);
            }
        });
    }, [trigger, tapChanger, lowTapPosition, resetTapNumbers]);

    // when we detect a change in tapSteps (so when the size or the order of the list of rows change), we reset the tap fields
    useEffect(() => {
        resetTapNumbers(tapSteps as unknown as TapChangerStep[]);
    }, [tapSteps, resetTapNumbers]);

    const handleResetButton = useCallback(() => {
        replace(previousValues?.[FieldConstants.STEPS] ?? []);
        setValue(`${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`, null);
        clearErrors(`${tapChanger}.${FieldConstants.STEPS}`);
    }, [clearErrors, previousValues, replace, setValue, tapChanger]);

    const handleCreateTapRule = (lowTap: number, highTap: number) => {
        const currentTapRows = getValues(`${tapChanger}.${FieldConstants.STEPS}`);

        if (currentTapRows.length > 1) {
            const interval = (highTap - lowTap) / (currentTapRows.length - 1);
            let current = lowTap;

            currentTapRows.forEach((_row: TapChangerStep, index: number) => {
                currentTapRows[index][createTapRuleColumn] = roundToDefaultPrecision(current);
                current += interval;
            });
            replace(currentTapRows);
        }
    };

    const handleImportTapRuleButton = useCallback(() => {
        trigger(`${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`).then((result) => {
            if (result) {
                setOpenImportRuleDialog(true);
            }
        });
    }, [trigger, tapChanger]);

    const handleImportTapRule = (results: Papa.ParseResult<Record<string, string>>): void => {
        const rows = results.data.map((val) => ({
            ...handleImportRow(val),
            [FieldConstants.SELECTED]: false,
        }));
        if (rows.length > 0) {
            replace(rows);
        }
    };

    const lowTapPositionField = (
        <IntegerInput
            name={`${tapChanger}.${FieldConstants.LOW_TAP_POSITION}`}
            label="LowTapPosition"
            formProps={{
                disabled,
            }}
            previousValue={previousValues?.[FieldConstants.LOW_TAP_POSITION]}
        />
    );

    const highTapPositionField = (
        <IntegerInput
            name={`${tapChanger}.${FieldConstants.HIGH_TAP_POSITION}`}
            label="HighTapPosition"
            formProps={{
                disabled: true,
            }}
            previousValue={computeHighTapPosition(previousValues?.[FieldConstants.STEPS] ?? []) ?? undefined}
        />
    );

    const tapPositionField = (
        <IntegerInput
            name={`${tapChanger}.${FieldConstants.TAP_POSITION}`}
            label="TapPosition"
            formProps={{
                disabled,
            }}
            previousValue={previousValues?.[FieldConstants.TAP_POSITION]}
        />
    );

    const createRuleButton = (
        <Tooltip
            title={intl.formatMessage({
                id: createRuleMessageId,
            })}
            placement="left"
        >
            <span>
                <IconButton onClick={() => setOpenCreateRuleDialog(true)} disabled={disabled || tapSteps.length === 0}>
                    <AddchartIcon />
                </IconButton>
            </span>
        </Tooltip>
    );

    const completedColumnsDefinition = columnsDefinition.map((column, index) =>
        index === columnsDefinition.length - 1 ? { ...column, extra: createRuleButton } : column
    );

    const getTapPreviousValue = useCallback(
        (
            rowIndex: number,
            column: DndColumn,
            arrayFormName: string,
            previousTapSteps: TapChangerStep[] | undefined
        ): number | undefined => {
            const step = previousTapSteps?.find(
                (e: TapChangerStep) => e.index === getValues(arrayFormName)[rowIndex]?.index
            );
            if (step === undefined) {
                return undefined;
            }
            return step?.[column.dataKey as keyof TapChangerStep] as number | undefined;
        },
        [getValues]
    );

    const isTapModified = useCallback(() => areStepsModified, [areStepsModified]);

    return (
        <Grid container spacing={1}>
            <Grid size={4}>{lowTapPositionField}</Grid>
            <Grid size={4}>{highTapPositionField}</Grid>
            <Grid size={4}>{tapPositionField}</Grid>

            <DndTable
                name={`${tapChanger}.${FieldConstants.STEPS}`}
                useFieldArrayOutput={useFieldArrayOutput}
                columnsDefinition={completedColumnsDefinition}
                tableHeight={400}
                allowedToAddRows={allowedToAddTapRows}
                createRows={createTapRows}
                handleUploadButton={handleImportTapRuleButton}
                uploadButtonMessageId={importRuleMessageId}
                handleResetButton={handleResetButton}
                resetButtonMessageId={resetButtonMessageId}
                previousValues={toTapChangerStepList(previousValues?.[FieldConstants.STEPS])}
                getPreviousValue={getTapPreviousValue}
                isValueModified={isTapModified}
                withResetButton={isModification && areStepsModified}
                disableAddingRows={disableAddingRows}
                disabled={disabled}
                disableDragAndDrop
            />
            <CreateRuleDialog
                tapChanger={tapChanger}
                openCreateRuleDialog={openCreateRuleDialog}
                setOpenCreateRuleDialog={setOpenCreateRuleDialog}
                handleCreateTapRule={handleCreateTapRule}
                allowNegativeValues={createRuleAllowNegativeValues}
            />
            <ImportRuleDialog
                tapChanger={tapChanger}
                openImportRuleDialog={openImportRuleDialog}
                setOpenImportRuleDialog={setOpenImportRuleDialog}
                csvColumns={csvColumns}
                handleImportTapRule={handleImportTapRule}
            />
        </Grid>
    );
}
