/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FloatInput, GridItem, SelectInput } from '../../../../components';
import { FieldConstants, ReactivePowerAdornment, SusceptanceAdornment } from '../../../../utils';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';
import { computeQ0 } from './standby-automaton-form-utils';
import { getPreviousNominalV } from './set-points-limits-form-utils';

const AUTOMATON_FIXED_PART_CHOICES = [
    { id: CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id, label: 'FixedPartOfQAtNominalV' },
    { id: CHARACTERISTICS_CHOICES.SUSCEPTANCE.id, label: 'FixedPartOfSusceptance' },
];

const toSusceptance = (q: number | null | undefined, nominalV: number | null | undefined) => {
    return q != null && nominalV ? q / nominalV ** 2 : undefined;
};

const getFinalLimit = (
    isSusceptanceLimitsChoice: boolean,
    newSusceptance: number | null | undefined,
    newQ: number | null | undefined,
    previousSusceptance: number | null | undefined,
    nominalV: number | null | undefined
) => {
    const newValue = isSusceptanceLimitsChoice ? newSusceptance : newQ;
    if (newValue == null) {
        return {
            susceptance: previousSusceptance ?? null,
            q: computeQ0(previousSusceptance, nominalV) ?? null,
        };
    }
    return isSusceptanceLimitsChoice
        ? { susceptance: newValue, q: computeQ0(newValue, nominalV) ?? null }
        : { susceptance: toSusceptance(newValue, nominalV) ?? null, q: newValue };
};

export interface SusceptanceAreaProps {
    isEquipmentModification?: boolean;
    previousValues?: StaticVarCompensatorFormInfo | null;
}

export function SusceptanceArea({ isEquipmentModification = false, previousValues }: Readonly<SusceptanceAreaProps>) {
    const id = FieldConstants.AUTOMATON;
    const { setValue } = useFormContext();
    const watchChoiceLimits = useWatch({
        name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.CHARACTERISTICS_CHOICE}`,
    });
    const watchChoiceAutomaton = useWatch({
        name: `${id}.${FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON}`,
    });
    const watchMinS = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MIN_SUSCEPTANCE}` });
    const watchMaxS = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MAX_SUSCEPTANCE}` });
    const watchMinQ = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MIN_Q_AT_NOMINAL_V}` });
    const watchMaxQ = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MAX_Q_AT_NOMINAL_V}` });
    const watchConnectivityVoltageLevelId = useWatch({
        name: `${FieldConstants.CONNECTIVITY}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });
    const previousNominalV = getPreviousNominalV(previousValues, watchConnectivityVoltageLevelId);
    const previousB0 = previousValues?.standbyAutomatonInfos?.b0;

    let minS;
    let maxS;
    let minQ;
    let maxQ;
    if (isEquipmentModification) {
        const isSusceptanceLimitsChoice = watchChoiceLimits === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id;
        const minLimit = getFinalLimit(
            isSusceptanceLimitsChoice,
            watchMinS,
            watchMinQ,
            previousValues?.minSusceptance,
            previousNominalV
        );
        const maxLimit = getFinalLimit(
            isSusceptanceLimitsChoice,
            watchMaxS,
            watchMaxQ,
            previousValues?.maxSusceptance,
            previousNominalV
        );
        minS = minLimit.susceptance;
        maxS = maxLimit.susceptance;
        minQ = minLimit.q;
        maxQ = maxLimit.q;
    } else {
        minS = watchMinS ?? previousValues?.minSusceptance ?? null;
        maxS = watchMaxS ?? previousValues?.maxSusceptance ?? null;
        minQ = watchMinQ ?? computeQ0(previousValues?.minSusceptance, previousNominalV) ?? null;
        maxQ = watchMaxQ ?? computeQ0(previousValues?.maxSusceptance, previousNominalV) ?? null;
    }

    useEffect(() => {
        if (!isEquipmentModification) {
            setValue(`${id}.${FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON}`, watchChoiceLimits);
        }
    }, [setValue, id, isEquipmentModification, watchChoiceLimits]);

    useEffect(() => {
        setValue(`${id}.${FieldConstants.MIN_Q_AUTOMATON}`, minQ);
        setValue(`${id}.${FieldConstants.MAX_Q_AUTOMATON}`, maxQ);
        setValue(`${id}.${FieldConstants.MIN_S_AUTOMATON}`, minS);
        setValue(`${id}.${FieldConstants.MAX_S_AUTOMATON}`, maxS);
    }, [setValue, id, minQ, maxQ, maxS, minS]);

    const susceptanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.B0}`}
            label={isEquipmentModification ? 'FixedPartOfSusceptance' : 'b0'}
            adornment={SusceptanceAdornment}
            previousValue={previousB0 ?? undefined}
            clearable={isEquipmentModification}
        />
    );

    const qAtNominalVField = (
        <FloatInput
            name={`${id}.${FieldConstants.Q0}`}
            label={isEquipmentModification ? 'FixedPartOfQAtNominalV' : 'fixQAtNominalV'}
            adornment={ReactivePowerAdornment}
            previousValue={computeQ0(previousB0, previousNominalV)}
            clearable={isEquipmentModification}
        />
    );

    if (isEquipmentModification) {
        return (
            <>
                <GridItem size={6}>
                    <SelectInput
                        name={`${id}.${FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON}`}
                        options={AUTOMATON_FIXED_PART_CHOICES}
                        fullWidth
                        disableClearable
                        size="small"
                    />
                </GridItem>
                <GridItem size={6}>
                    {watchChoiceAutomaton === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id
                        ? susceptanceField
                        : qAtNominalVField}
                </GridItem>
            </>
        );
    }

    const minSusceptanceField = (
        <TextField
            value={minS ?? ''}
            label={<FormattedMessage id="minSusceptance" />}
            disabled
            size="small"
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="start">S</InputAdornment>,
                },
            }}
        />
    );

    const maxSusceptanceField = (
        <TextField
            value={maxS ?? ''}
            label={<FormattedMessage id="maximumSusceptance" />}
            disabled
            size="small"
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="start">S</InputAdornment>,
                },
            }}
        />
    );

    const minQAtNominalVField = (
        <TextField
            value={minQ ?? ''}
            label={<FormattedMessage id="minQAtNominalV" />}
            disabled
            size="small"
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="start">Mvar</InputAdornment>,
                },
            }}
        />
    );

    const maxQAtNominalVField = (
        <TextField
            value={maxQ ?? ''}
            label={<FormattedMessage id="maxQAtVnominal" />}
            disabled
            size="small"
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="start">Mvar</InputAdornment>,
                },
            }}
        />
    );

    return (
        <Grid container spacing={2}>
            {watchChoiceLimits === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id && (
                <>
                    <GridItem size={4}>{minSusceptanceField}</GridItem>
                    <GridItem size={3}>{susceptanceField}</GridItem>
                    <GridItem size={4}>{maxSusceptanceField}</GridItem>
                </>
            )}
            {watchChoiceLimits === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id && (
                <>
                    <GridItem size={4}>{minQAtNominalVField}</GridItem>
                    <GridItem size={3}>{qAtNominalVField}</GridItem>
                    <GridItem size={4}>{maxQAtNominalVField}</GridItem>
                </>
            )}
        </Grid>
    );
}
