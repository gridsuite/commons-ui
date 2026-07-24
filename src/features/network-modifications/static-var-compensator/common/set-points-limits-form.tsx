/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';

import { FormattedMessage } from 'react-intl';
import { EquipmentType, FieldConstants, Identifiable, ReactivePowerAdornment, SusceptanceAdornment, VoltageAdornment } from '../../../../utils';
import { FloatInput, GridItem, GridSection, SelectInput } from '../../../../components';
import { RegulatingTerminalForm, REGULATION_TYPES } from '../../common';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { VOLTAGE_REGULATION_MODES } from './constants';

export interface SetPointsLimitsFormProps {
    voltageLevelOptions: Identifiable[];
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function SetPointsLimitsForm({
    voltageLevelOptions,
    fetchVoltageLevelEquipments,
}: Readonly<SetPointsLimitsFormProps>) {
    const id = FieldConstants.SETPOINTS_LIMITS;

    const watchCharacteristicsChoice = useWatch({ name: `${id}.${FieldConstants.CHARACTERISTICS_CHOICE}` });
    // a tricky solution to rerender voltage/reactive setpoints field with label changed between required <-> optional
    useWatch({ name: `${id}.${FieldConstants.VOLTAGE_REGULATION_MODE}` });
    const watchRegulationType = useWatch({ name: `${id}.${FieldConstants.VOLTAGE_REGULATION_TYPE}` });
    const minSusceptanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.MIN_SUSCEPTANCE}`}
            label={'minSusceptance'}
            adornment={SusceptanceAdornment}
        />
    );
    const maxSusceptanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAX_SUSCEPTANCE}`}
            label={'maximumSusceptance'}
            adornment={SusceptanceAdornment}
        />
    );

    const minQAtNominalVField = (
        <FloatInput
            name={`${id}.${FieldConstants.MIN_Q_AT_NOMINAL_V}`}
            label={'minQAtNominalV'}
            adornment={ReactivePowerAdornment}
        />
    );
    const maxQAtNominalVField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAX_Q_AT_NOMINAL_V}`}
            label={'maxQAtVnominal'}
            adornment={ReactivePowerAdornment}
        />
    );

    const voltageSetPointField = (
        <FloatInput
            name={`${id}.${FieldConstants.VOLTAGE_SET_POINT}`}
            label={'VoltageText'}
            adornment={VoltageAdornment}
        />
    );

    const reactivePowerSetPointField = (
        <FloatInput
            name={`${id}.${FieldConstants.REACTIVE_POWER_SET_POINT}`}
            label={'ReactivePowerText'}
            adornment={ReactivePowerAdornment}
        />
    );

    const voltageRegulationTypeField = (
        <SelectInput
            options={Object.values(REGULATION_TYPES)}
            name={`${id}.${FieldConstants.VOLTAGE_REGULATION_TYPE}`}
            label={'RegulationTypeText'}
            size={'small'}
        />
    );

    const regulatingTerminalField = (
        <RegulatingTerminalForm
            id={id}
            direction={undefined}
            disabled={false}
            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
            voltageLevelOptions={voltageLevelOptions}
            equipmentSectionTypeDefaultValue={EquipmentType.STATIC_VAR_COMPENSATOR}
            regulatingTerminalVlId={undefined}
            equipmentSectionType={undefined}
        />
    );

    return (
        <>
            <GridSection title="ReactiveLimits" />

            <Grid container spacing={2} padding={1}>
                <Grid size={4}>
                    <SelectInput
                        name={`${id}.${FieldConstants.CHARACTERISTICS_CHOICE}`}
                        options={Object.values(CHARACTERISTICS_CHOICES)}
                        fullWidth
                        disableClearable
                        size="small"
                    />
                </Grid>
                {watchCharacteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id && (
                    <>
                        <GridItem size={4}>{minQAtNominalVField}</GridItem>
                        <GridItem size={4}>{maxQAtNominalVField}</GridItem>
                    </>
                )}
                {watchCharacteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id && (
                    <>
                        <GridItem size={4}>{minSusceptanceField}</GridItem>
                        <GridItem size={4}>{maxSusceptanceField}</GridItem>
                    </>
                )}
            </Grid>
            <GridSection title="Setpoints" />
            <Grid container spacing={2} padding={1}>
                <Grid size={4}>
                    <SelectInput
                        name={`${id}.${FieldConstants.VOLTAGE_REGULATION_MODE}`}
                        label="ModeAutomaton"
                        options={Object.values(VOLTAGE_REGULATION_MODES)}
                        fullWidth
                        disableClearable
                        size="small"
                    />
                </Grid>
                <GridItem size={4}>{voltageSetPointField}</GridItem>
                <GridItem size={4}>{reactivePowerSetPointField}</GridItem>
                <GridItem size={4}>{voltageRegulationTypeField}</GridItem>
            </Grid>
            {watchRegulationType === REGULATION_TYPES.DISTANT.id && (
                <Grid container spacing={2} padding={1}>
                    <Grid size={4} sx={{ alignItems: 'center' }}>
                        <FormattedMessage id="RegulatingTerminalGenerator" />
                    </Grid>
                    <GridItem size={8}>{regulatingTerminalField}</GridItem>
                </Grid>
            )}
        </>
    );
}
