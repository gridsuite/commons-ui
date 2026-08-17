/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { InferType } from 'yup';
import { FieldConstants, ModificationType, sanitizeString, UNDEFINED_CONNECTION_DIRECTION } from '../../../../utils';
import {
    creationPropertiesSchema,
    emptyProperties,
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormData,
    getConnectivityWithPositionSchema,
    getFilledPropertiesFromModification,
    REGULATION_TYPES,
    toModificationProperties,
} from '../../common';
import {
    getReactiveFormData,
    getReactiveFormEmptyFormData,
    getReactiveFormValidationSchema,
} from '../common/set-points-limits-form-utils';
import {
    getStandbyAutomatonEmptyFormData,
    getStandbyAutomatonFormData,
    getStandbyAutomatonFormValidationSchema,
} from '../common/standby-automaton-form-utils';
import { StaticVarCompensatorCreationDto } from './static-var-compensator-creation.types';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { StaticVarCompensatorDto, VOLTAGE_REGULATION_MODES } from '../common';

export const staticVarCompensatorCreationEmptyFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    ...getConnectivityWithPositionEmptyFormData(),
    ...getReactiveFormEmptyFormData(),
    ...getStandbyAutomatonEmptyFormData(),
    ...emptyProperties,
};

export const staticVarCompensatorCreationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(false),
        [FieldConstants.SETPOINTS_LIMITS]: getReactiveFormValidationSchema(),
        [FieldConstants.AUTOMATON]: getStandbyAutomatonFormValidationSchema(),
    })
    .concat(creationPropertiesSchema)
    .required();

export type StaticVarCompensatorCreationFormData = InferType<typeof staticVarCompensatorCreationFormSchema>;

export const staticVarCompensatorDtoToForm = (
    staticCompensator: StaticVarCompensatorDto
): StaticVarCompensatorCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: staticCompensator.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: staticCompensator.equipmentName ?? '',
        [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
            voltageLevelId: staticCompensator.voltageLevelId,
            busbarSectionId: staticCompensator.busOrBusbarSectionId,
            connectionDirection: staticCompensator.connectionDirection,
            connectionName: staticCompensator.connectionName,
            connectionPosition: staticCompensator.connectionPosition,
            terminalConnected: staticCompensator.terminalConnected,
            isEquipmentModification: false,
        }),
        ...getReactiveFormData({
            maxSusceptance: staticCompensator.maxSusceptance,
            minSusceptance: staticCompensator.minSusceptance,
            nominalV: null,
            maxQAtNominalV: staticCompensator.maxQAtNominalV,
            minQAtNominalV: staticCompensator.minQAtNominalV,
            regulationMode: staticCompensator.isRegulating
                ? staticCompensator.regulationMode
                : VOLTAGE_REGULATION_MODES.OFF.id,
            voltageSetpoint: staticCompensator.voltageSetpoint,
            reactivePowerSetpoint: staticCompensator.reactivePowerSetpoint,
            voltageRegulationType:
                staticCompensator?.regulatingTerminalId || staticCompensator?.regulatingTerminalConnectableId
                    ? REGULATION_TYPES.DISTANT.id
                    : REGULATION_TYPES.LOCAL.id,
            voltageLevelId: staticCompensator.regulatingTerminalVlId,
            equipmentType: staticCompensator.regulatingTerminalType,
            equipmentId: staticCompensator.regulatingTerminalConnectableId || staticCompensator.regulatingTerminalId,
        }),
        ...getStandbyAutomatonFormData({
            addStandbyAutomaton: staticCompensator.standbyAutomatonOn,
            standby: staticCompensator.standby,
            b0: staticCompensator.b0,
            q0: staticCompensator.q0,
            lowVoltageSetpoint: staticCompensator.lowVoltageSetpoint,
            highVoltageSetpoint: staticCompensator.highVoltageSetpoint,
            lowVoltageThreshold: staticCompensator.lowVoltageThreshold,
            highVoltageThreshold: staticCompensator.highVoltageThreshold,
        }),
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(staticCompensator.properties),
    };
};

const getValueIf = <T>(condition: boolean | null | undefined, value: T | null | undefined): T | null => {
    return condition ? (value ?? null) : null;
};

export const staticVarCompensatorCreationFormToDto = (
    formData: StaticVarCompensatorCreationFormData
): StaticVarCompensatorCreationDto => {
    const { connectivity, setpointsLimits, automaton } = formData;
    const { characteristicsChoice, voltageRegulationMode, equipment: regulationEquipment } = setpointsLimits;
    const { addStandbyAutomaton } = automaton;
    const isDistantRegulation = setpointsLimits.voltageRegulationType === REGULATION_TYPES.DISTANT.id;

    return {
        type: ModificationType.STATIC_VAR_COMPENSATOR_CREATION,
        equipmentId: formData.equipmentID,
        equipmentName: sanitizeString(formData.equipmentName),
        voltageLevelId: connectivity.voltageLevel?.id ?? null,
        busOrBusbarSectionId: connectivity.busOrBusbarSection?.id ?? null,
        connectionName: sanitizeString(formData.connectivity.connectionName),
        connectionDirection: connectivity.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionPosition: connectivity.connectionPosition ?? null,
        terminalConnected: connectivity.terminalConnected,
        maxSusceptance: getValueIf(
            characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
            setpointsLimits.maxSusceptance
        ),
        minSusceptance: getValueIf(
            characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
            setpointsLimits.minSusceptance
        ),
        maxQAtNominalV: getValueIf(
            characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
            setpointsLimits.maxQAtNominalV
        ),
        minQAtNominalV: getValueIf(
            characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
            setpointsLimits.minQAtNominalV
        ),
        regulationMode: voltageRegulationMode === VOLTAGE_REGULATION_MODES.OFF.id ? null : voltageRegulationMode,
        isRegulating: voltageRegulationMode !== VOLTAGE_REGULATION_MODES.OFF.id,
        voltageSetpoint: setpointsLimits.voltageSetpoint ?? null,
        reactivePowerSetpoint: setpointsLimits.reactivePowerSetpoint ?? null,
        voltageRegulationType: setpointsLimits.voltageRegulationType,

        regulatingTerminalId: getValueIf(isDistantRegulation, regulationEquipment?.id),

        regulatingTerminalType: getValueIf(isDistantRegulation, regulationEquipment?.type),
        regulatingTerminalVlId: getValueIf(isDistantRegulation, setpointsLimits.voltageLevel?.id),
        standbyAutomatonOn: addStandbyAutomaton ?? null,
        standby: automaton.StandbyAutomaton ?? null,
        lowVoltageSetpoint: getValueIf(addStandbyAutomaton, automaton.lowVoltageSetpoint),
        highVoltageSetpoint: getValueIf(addStandbyAutomaton, automaton.highVoltageSetpoint),
        lowVoltageThreshold: getValueIf(addStandbyAutomaton, automaton.lowVoltageThreshold),
        highVoltageThreshold: getValueIf(addStandbyAutomaton, automaton.highVoltageThreshold),
        b0:
            addStandbyAutomaton && characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id
                ? (automaton.b0 ?? null)
                : null,
        q0:
            addStandbyAutomaton && characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id
                ? (automaton.q0 ?? null)
                : null,
        properties: toModificationProperties(formData),
    };
};
