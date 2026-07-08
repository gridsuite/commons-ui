/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid2 as Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { FieldConstants, ReactivePowerAdornment, SusceptanceAdornment } from '../../../../utils';
import { FloatInput, IntegerInput, RadioInput, SelectInput } from '../../../../components/ui';
import { ShuntCompensatorFormInfos } from './shuntCompensator.types';
import { CHARACTERISTICS_CHOICES, SHUNT_COMPENSATOR_TYPES } from './shuntCompensator.utils';

export interface CharacteristicsFormProps {
    previousValues?: ShuntCompensatorFormInfos;
    isModification?: boolean;
}

// this component needs to be isolated to avoid too many rerenders
export function CharacteristicsForm({ previousValues, isModification = false }: Readonly<CharacteristicsFormProps>) {
    const intl = useIntl();
    const { setValue } = useFormContext();

    const [sectionCount, maximumSectionCount, maxQAtNominalV, maxSusceptance, characteristicsChoice] = useWatch({
        name: [
            FieldConstants.SECTION_COUNT,
            FieldConstants.MAXIMUM_SECTION_COUNT,
            FieldConstants.MAX_Q_AT_NOMINAL_V,
            FieldConstants.MAX_SUSCEPTANCE,
            FieldConstants.CHARACTERISTICS_CHOICE,
        ],
    });

    const previousMaxQAtNominalV = useMemo(() => {
        const prevValue =
            previousValues?.qAtNominalV && previousValues?.maximumSectionCount
                ? previousValues.qAtNominalV * previousValues.maximumSectionCount
                : undefined;
        return Number.isNaN(prevValue) ? undefined : prevValue;
    }, [previousValues]);

    const previousMaxSusceptance = useMemo(() => {
        const prevValue =
            previousValues?.bPerSection && previousValues?.maximumSectionCount
                ? previousValues.bPerSection * previousValues.maximumSectionCount
                : undefined;
        return Number.isNaN(prevValue) ? undefined : prevValue;
    }, [previousValues]);

    const currentSectionCount = useMemo(
        () => sectionCount ?? previousValues?.sectionCount,
        [sectionCount, previousValues]
    );

    const currentMaximumSectionCount = useMemo(
        () => maximumSectionCount ?? previousValues?.maximumSectionCount,
        [maximumSectionCount, previousValues]
    );

    const currentMaxQAtNominalV = useMemo(
        () => maxQAtNominalV ?? previousMaxQAtNominalV,
        [maxQAtNominalV, previousMaxQAtNominalV]
    );

    const currentMaxSusceptance = useMemo(
        () => maxSusceptance ?? previousMaxSusceptance,
        [maxSusceptance, previousMaxSusceptance]
    );

    const previousShuntCompensatorType = useMemo(
        () =>
            previousValues?.bPerSection
                ? intl.formatMessage({
                      id:
                          previousValues.bPerSection > 0
                              ? SHUNT_COMPENSATOR_TYPES.CAPACITOR.label
                              : SHUNT_COMPENSATOR_TYPES.REACTOR.label,
                  })
                : '',
        [previousValues?.bPerSection, intl]
    );

    const handleSwitchedOnValue = useCallback(
        (currentLinkedSwitchedOnValue: number, switchedOnFieldName: string) => {
            if (
                [currentSectionCount, currentMaximumSectionCount, currentLinkedSwitchedOnValue].every(
                    (v) => v !== null && v !== undefined
                ) &&
                currentMaximumSectionCount >= currentSectionCount
            ) {
                setValue(
                    switchedOnFieldName,
                    (currentLinkedSwitchedOnValue / currentMaximumSectionCount) * currentSectionCount
                );
            } else {
                setValue(switchedOnFieldName, null);
            }
        },
        [currentSectionCount, currentMaximumSectionCount, setValue]
    );

    useEffect(() => {
        if (characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id) {
            handleSwitchedOnValue(currentMaxQAtNominalV, FieldConstants.SWITCHED_ON_Q_AT_NOMINAL_V);
        } else if (characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id) {
            handleSwitchedOnValue(currentMaxSusceptance, FieldConstants.SWITCHED_ON_SUSCEPTANCE);
        }
    }, [characteristicsChoice, handleSwitchedOnValue, currentMaxQAtNominalV, currentMaxSusceptance]);

    const maximumSectionCountField = (
        <IntegerInput
            name={FieldConstants.MAXIMUM_SECTION_COUNT}
            label="maximumSectionCount"
            previousValue={previousValues?.maximumSectionCount ?? undefined}
            clearable={isModification}
        />
    );

    const sectionCountField = (
        <IntegerInput
            name={FieldConstants.SECTION_COUNT}
            label="sectionCount"
            previousValue={previousValues?.sectionCount ?? undefined}
            clearable={isModification}
        />
    );

    const maxQAtNominalVField = (
        <FloatInput
            name={FieldConstants.MAX_Q_AT_NOMINAL_V}
            label="maxQAtNominalV"
            adornment={ReactivePowerAdornment}
            previousValue={previousMaxQAtNominalV}
            clearable={isModification}
        />
    );

    const switchedOnMaxQAtNominalVField = (
        <FloatInput
            name={FieldConstants.SWITCHED_ON_Q_AT_NOMINAL_V}
            label="SwitchedOnMaxQAtNominalV"
            adornment={ReactivePowerAdornment}
            previousValue={
                previousValues?.qAtNominalV && previousValues?.sectionCount
                    ? previousValues.qAtNominalV * previousValues.sectionCount
                    : undefined
            }
            formProps={{
                disabled: true,
            }}
        />
    );

    const shuntCompensatorTypeField = (
        <SelectInput
            options={Object.values(SHUNT_COMPENSATOR_TYPES)}
            name={FieldConstants.SHUNT_COMPENSATOR_TYPE}
            label="Type"
            size="small"
            previousValue={previousShuntCompensatorType}
        />
    );

    const maxSusceptanceField = (
        <FloatInput
            name={FieldConstants.MAX_SUSCEPTANCE}
            label="maxSusceptance"
            adornment={SusceptanceAdornment}
            previousValue={previousMaxSusceptance}
            clearable={isModification}
        />
    );

    const switchedOnSusceptanceField = (
        <FloatInput
            name={FieldConstants.SWITCHED_ON_SUSCEPTANCE}
            label="SwitchedOnMaxSusceptance"
            adornment={SusceptanceAdornment}
            previousValue={
                previousValues?.bPerSection && previousValues.sectionCount
                    ? previousValues.bPerSection * previousValues.sectionCount
                    : undefined
            }
            formProps={{
                disabled: true,
            }}
        />
    );

    const characteristicsChoiceField = (
        <RadioInput name={FieldConstants.CHARACTERISTICS_CHOICE} options={Object.values(CHARACTERISTICS_CHOICES)} />
    );

    return (
        <Grid container spacing={2}>
            <Grid size={4}>{maximumSectionCountField}</Grid>
            <Grid size={4}>{sectionCountField}</Grid>
            <Grid size={12}>{characteristicsChoiceField}</Grid>
            {characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id && (
                <Grid container spacing={2}>
                    <Grid size={4}>{maxSusceptanceField}</Grid>
                    <Grid size={4}>{switchedOnSusceptanceField}</Grid>
                </Grid>
            )}
            {characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id && (
                <Grid container spacing={2} size={12}>
                    <Grid size={4}>{shuntCompensatorTypeField}</Grid>
                    <Grid container size={12}>
                        <Grid size={4}>
                            {maxQAtNominalVField}
                        </Grid>
                        <Grid size={4}>
                            {switchedOnMaxQAtNominalVField}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}
