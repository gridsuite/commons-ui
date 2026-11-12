/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    EquipmentType,
    FieldConstants,
    Identifiable,
    ReactivePowerAdornment,
    SusceptanceAdornment,
    VoltageAdornment,
} from '../../../../utils';
import { FloatInput, GridItem, GridSection, SelectInput } from '../../../../components';
import { RegulatingTerminalForm, REGULATION_TYPES } from '../../common';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { VOLTAGE_REGULATION_MODES } from './constants';
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';

export interface SetPointsLimitsFormProps {
    voltageLevelOptions: Identifiable[];
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    isModification?: boolean;
    staticVarCompensatorToModify?: StaticVarCompensatorFormInfo | null;
}

const getPreviousRegulationMode = (staticVarCompensatorToModify?: StaticVarCompensatorFormInfo | null) => {
    if (!staticVarCompensatorToModify) {
        return undefined;
    }
    if (!staticVarCompensatorToModify.isRegulating) {
        return VOLTAGE_REGULATION_MODES.OFF;
    }
    return staticVarCompensatorToModify.regulationMode === VOLTAGE_REGULATION_MODES.REACTIVE_POWER.id
        ? VOLTAGE_REGULATION_MODES.REACTIVE_POWER
        : VOLTAGE_REGULATION_MODES.VOLTAGE;
};

const toQAtNominalV = (susceptance?: number | null, nominalV?: number | null) =>
    susceptance != null && nominalV != null ? susceptance * nominalV ** 2 : undefined;

export function SetPointsLimitsForm({
    voltageLevelOptions,
    fetchVoltageLevelEquipments,
    isModification = false,
    staticVarCompensatorToModify,
}: Readonly<SetPointsLimitsFormProps>) {
    const intl = useIntl();
    const id = FieldConstants.SETPOINTS_LIMITS;

    const previousRegulationMode = getPreviousRegulationMode(staticVarCompensatorToModify);
    const isPreviousRegulationDistant = !!(
        staticVarCompensatorToModify?.regulatingTerminalVlId ||
        staticVarCompensatorToModify?.regulatingTerminalConnectableId
    );
    const previousRegulationType = isPreviousRegulationDistant ? REGULATION_TYPES.DISTANT : REGULATION_TYPES.LOCAL;
    const previousEquipmentSectionType =
        staticVarCompensatorToModify?.regulatingTerminalConnectableType &&
        staticVarCompensatorToModify?.regulatingTerminalConnectableId
            ? `${staticVarCompensatorToModify.regulatingTerminalConnectableType} : ${staticVarCompensatorToModify.regulatingTerminalConnectableId}`
            : undefined;

    const watchCharacteristicsChoice = useWatch({ name: `${id}.${FieldConstants.CHARACTERISTICS_CHOICE}` });
    // a tricky solution to rerender voltage/reactive setpoints field with label changed between required <-> optional
    useWatch({ name: `${id}.${FieldConstants.VOLTAGE_REGULATION_MODE}` });
    const watchRegulationType = useWatch({ name: `${id}.${FieldConstants.VOLTAGE_REGULATION_TYPE}` });
    const minSusceptanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.MIN_SUSCEPTANCE}`}
            label="minSusceptance"
            adornment={SusceptanceAdornment}
            previousValue={staticVarCompensatorToModify?.minSusceptance ?? undefined}
            clearable={isModification}
        />
    );
    const maxSusceptanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAX_SUSCEPTANCE}`}
            label="maximumSusceptance"
            adornment={SusceptanceAdornment}
            previousValue={staticVarCompensatorToModify?.maxSusceptance ?? undefined}
            clearable={isModification}
        />
    );

    const minQAtNominalVField = (
        <FloatInput
            name={`${id}.${FieldConstants.MIN_Q_AT_NOMINAL_V}`}
            label="minQAtNominalV"
            adornment={ReactivePowerAdornment}
            previousValue={toQAtNominalV(
                staticVarCompensatorToModify?.minSusceptance,
                staticVarCompensatorToModify?.nominalV
            )}
            clearable={isModification}
        />
    );
    const maxQAtNominalVField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAX_Q_AT_NOMINAL_V}`}
            label="maxQAtVnominal"
            adornment={ReactivePowerAdornment}
            previousValue={toQAtNominalV(
                staticVarCompensatorToModify?.maxSusceptance,
                staticVarCompensatorToModify?.nominalV
            )}
            clearable={isModification}
        />
    );

    const voltageSetPointField = (
        <FloatInput
            name={`${id}.${FieldConstants.VOLTAGE_SET_POINT}`}
            label="VoltageText"
            adornment={VoltageAdornment}
            previousValue={staticVarCompensatorToModify?.voltageSetpoint ?? undefined}
            clearable={isModification}
        />
    );

    const reactivePowerSetPointField = (
        <FloatInput
            name={`${id}.${FieldConstants.REACTIVE_POWER_SET_POINT}`}
            label="ReactivePowerText"
            adornment={ReactivePowerAdornment}
            previousValue={staticVarCompensatorToModify?.reactivePowerSetpoint ?? undefined}
            clearable={isModification}
        />
    );

    const voltageRegulationTypeField = (
        <SelectInput
            options={Object.values(REGULATION_TYPES)}
            name={`${id}.${FieldConstants.VOLTAGE_REGULATION_TYPE}`}
            label="RegulationTypeText"
            size="small"
            previousValue={
                staticVarCompensatorToModify ? intl.formatMessage({ id: previousRegulationType.label }) : undefined
            }
        />
    );

    const regulatingTerminalField = (
        <RegulatingTerminalForm
            id={id}
            direction={undefined}
            disabled={false}
            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
            voltageLevelOptions={voltageLevelOptions}
            equipmentSectionTypeDefaultValue={isModification ? '' : EquipmentType.STATIC_VAR_COMPENSATOR}
            regulatingTerminalVlId={staticVarCompensatorToModify?.regulatingTerminalVlId ?? undefined}
            equipmentSectionType={previousEquipmentSectionType}
        />
    );

    return (
        <>
            <GridSection title="ReactiveLimits" />

            <Grid
                container
                spacing={2}
                sx={{
                    padding: 1,
                }}
            >
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
            <Grid
                container
                spacing={2}
                sx={{
                    padding: 1,
                }}
            >
                <Grid size={4}>
                    <SelectInput
                        name={`${id}.${FieldConstants.VOLTAGE_REGULATION_MODE}`}
                        label="ModeAutomaton"
                        options={Object.values(VOLTAGE_REGULATION_MODES)}
                        fullWidth
                        disableClearable={!isModification}
                        size="small"
                        previousValue={
                            previousRegulationMode
                                ? intl.formatMessage({ id: previousRegulationMode.label })
                                : undefined
                        }
                    />
                </Grid>
                <GridItem size={4}>{voltageSetPointField}</GridItem>
                <GridItem size={4}>{reactivePowerSetPointField}</GridItem>
                <GridItem size={4}>{voltageRegulationTypeField}</GridItem>
            </Grid>
            {watchRegulationType === REGULATION_TYPES.DISTANT.id && (
                <Grid
                    container
                    spacing={2}
                    sx={{
                        padding: 1,
                    }}
                >
                    <Grid size={4} sx={{ alignItems: 'center' }}>
                        <FormattedMessage id="RegulatingTerminalGenerator" />
                    </Grid>
                    <GridItem size={8}>{regulatingTerminalField}</GridItem>
                </Grid>
            )}
        </>
    );
}
