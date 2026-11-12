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
import { FloatInput, GridItem } from '../../../../components';
import { FieldConstants, ReactivePowerAdornment, SusceptanceAdornment } from '../../../../utils';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';
import { computeQ0 } from './standby-automaton-form-utils';

export interface SusceptanceAreaProps {
    isEquipmentModification?: boolean;
    previousValues?: StaticVarCompensatorFormInfo | null;
}

export function SusceptanceArea({ isEquipmentModification = false, previousValues }: Readonly<SusceptanceAreaProps>) {
    const id = FieldConstants.AUTOMATON;
    const { setValue } = useFormContext();
    const watchChoiceAutomaton = useWatch({
        name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.CHARACTERISTICS_CHOICE}`,
    });
    const watchMinS = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MIN_SUSCEPTANCE}` });
    const watchMaxS = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MAX_SUSCEPTANCE}` });
    const watchMinQ = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MIN_Q_AT_NOMINAL_V}` });
    const watchMaxQ = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MAX_Q_AT_NOMINAL_V}` });
    const minS = watchMinS ?? previousValues?.minSusceptance ?? null;
    const maxS = watchMaxS ?? previousValues?.maxSusceptance ?? null;
    const minQ = watchMinQ ?? computeQ0(previousValues?.minSusceptance, previousValues?.nominalV) ?? null;
    const maxQ = watchMaxQ ?? computeQ0(previousValues?.maxSusceptance, previousValues?.nominalV) ?? null;
    const previousB0 = previousValues?.standbyAutomatonInfos?.b0;
    // CHARACTERISTICS_CHOICE_AUTOMATON used only to validate the schema (work around)
    useEffect(() => {
        setValue(`${id}.${FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON}`, watchChoiceAutomaton);
        setValue(`${id}.${FieldConstants.MIN_Q_AUTOMATON}`, minQ);
        setValue(`${id}.${FieldConstants.MAX_Q_AUTOMATON}`, maxQ);
        setValue(`${id}.${FieldConstants.MIN_S_AUTOMATON}`, minS);
        setValue(`${id}.${FieldConstants.MAX_S_AUTOMATON}`, maxS);
    }, [setValue, id, watchChoiceAutomaton, minQ, maxQ, maxS, minS]);

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

    const susceptanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.B0}`}
            label="b0"
            adornment={SusceptanceAdornment}
            previousValue={previousB0 ?? undefined}
            clearable={isEquipmentModification}
        />
    );

    const qAtNominalVField = (
        <FloatInput
            name={`${id}.${FieldConstants.Q0}`}
            label="fixQAtNominalV"
            adornment={ReactivePowerAdornment}
            previousValue={computeQ0(previousB0, previousValues?.nominalV)}
            clearable={isEquipmentModification}
        />
    );

    return (
        <Grid container spacing={2}>
            {watchChoiceAutomaton === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id && (
                <>
                    <GridItem size={4}>{minSusceptanceField}</GridItem>
                    <GridItem size={3}>{susceptanceField}</GridItem>
                    <GridItem size={4}>{maxSusceptanceField}</GridItem>
                </>
            )}
            {watchChoiceAutomaton === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id && (
                <>
                    <GridItem size={4}>{minQAtNominalVField}</GridItem>
                    <GridItem size={3}>{qAtNominalVField}</GridItem>
                    <GridItem size={4}>{maxQAtNominalVField}</GridItem>
                </>
            )}
        </Grid>
    );
}
