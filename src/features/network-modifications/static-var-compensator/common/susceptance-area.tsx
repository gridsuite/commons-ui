/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FloatInput, GridItem } from '../../../../components';
import { FieldConstants, ReactivePowerAdornment, SusceptanceAdornment } from '../../../../utils';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { InputAdornment, Grid2 as Grid, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export const SusceptanceArea = () => {
    const id = FieldConstants.AUTOMATON;
    const { setValue } = useFormContext();
    const watchChoiceAutomaton = useWatch({
        name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.CHARACTERISTICS_CHOICE}`,
    });
    const minS = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MIN_SUSCEPTANCE}` });
    const maxS = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MAX_SUSCEPTANCE}` });
    const minQ = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MIN_Q_AT_NOMINAL_V}` });
    const maxQ = useWatch({ name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.MAX_Q_AT_NOMINAL_V}` });
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
            value={minS}
            label={<FormattedMessage id={'minSusceptance'} />}
            disabled={true}
            size={'small'}
            InputProps={{
                endAdornment: <InputAdornment position="start">S</InputAdornment>,
            }}
        />
    );

    const maxSusceptanceField = (
        <TextField
            value={maxS}
            label={<FormattedMessage id={'maximumSusceptance'} />}
            disabled={true}
            size={'small'}
            InputProps={{
                endAdornment: <InputAdornment position="start">S</InputAdornment>,
            }}
        />
    );

    const minQAtNominalVField = (
        <TextField
            value={minQ}
            label={<FormattedMessage id={'minQAtNominalV'} />}
            disabled={true}
            size={'small'}
            InputProps={{
                endAdornment: <InputAdornment position="start">Mvar</InputAdornment>,
            }}
        />
    );

    const maxQAtNominalVField = (
        <TextField
            value={maxQ}
            label={<FormattedMessage id={'maxQAtVnominal'} />}
            disabled={true}
            size={'small'}
            InputProps={{
                endAdornment: <InputAdornment position="start">Mvar</InputAdornment>,
            }}
        />
    );

    const susceptanceField = (
        <FloatInput name={`${id}.${FieldConstants.B0}`} label="b0" adornment={SusceptanceAdornment} />
    );

    const qAtNominalVField = (
        <FloatInput name={`${id}.${FieldConstants.Q0}`} label="fixQAtNominalV" adornment={ReactivePowerAdornment} />
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
};
