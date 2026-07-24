/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ModificationType, sanitizeString, UNDEFINED_CONNECTION_DIRECTION } from '../../../../utils';
import {
    creationPropertiesSchema,
    emptyProperties,
    getConnectivityFormData,
    getConnectivityWithPositionEmptyFormData,
    getConnectivityWithPositionSchema,
    getPropertiesFromModification,
    Property,
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
    getStandbyAutomatonFormValidationSchema,
} from '../common/standby-automaton-form-utils';
import * as yup from 'yup';
import { StaticVarCompensatorCreationDto } from './static-var-compensator-creation.types';
import { InferType } from 'yup';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { VOLTAGE_REGULATION_MODES } from '../common';



export type StaticVarCompensatorCreationSchemaForm = {
    [FieldConstants.EQUIPMENT_ID]: string;
    [FieldConstants.EQUIPMENT_NAME]?: string;
    // Connectivity
    [FieldConstants.CONNECTIVITY]: {
        [FieldConstants.CONNECTION_DIRECTION]?: string;
        [FieldConstants.CONNECTION_NAME]?: string;
        [FieldConstants.CONNECTION_POSITION]?: number;
        [FieldConstants.CONNECTED]?: boolean;
    };
    // Reactive
    [FieldConstants.SETPOINTS_LIMITS]: {
        [FieldConstants.MAX_SUSCEPTANCE]?: number;
        [FieldConstants.MIN_SUSCEPTANCE]?: number;
        [FieldConstants.MAX_Q_AT_NOMINAL_V]?: number;
        [FieldConstants.MIN_Q_AT_NOMINAL_V]?: number;
        [FieldConstants.CHARACTERISTICS_CHOICE]?: string;
        [FieldConstants.VOLTAGE_REGULATION_MODE]?: string;
        [FieldConstants.VOLTAGE_REGULATION_TYPE]?: string;
        [FieldConstants.VOLTAGE_SET_POINT]?: number;
        [FieldConstants.REACTIVE_POWER_SET_POINT]?: number;
        [FieldConstants.VOLTAGE_LEVEL]?: {
            [FieldConstants.ID]: string;
        };
        [FieldConstants.EQUIPMENT]?: {
            [FieldConstants.ID]: string;
            [FieldConstants.TYPE]: string;
        };
    };
    // Standby automaton
    [FieldConstants.AUTOMATON]: {
        [FieldConstants.ADD_STAND_BY_AUTOMATON]?: boolean;
        [FieldConstants.STAND_BY_AUTOMATON]?: boolean;
        [FieldConstants.LOW_VOLTAGE_SET_POINT]?: number;
        [FieldConstants.HIGH_VOLTAGE_SET_POINT]?: number;
        [FieldConstants.LOW_VOLTAGE_THRESHOLD]?: number;
        [FieldConstants.HIGH_VOLTAGE_THRESHOLD]?: number;
        [FieldConstants.B0]?: number;
        [FieldConstants.Q0]?: number;
    };
    // Properties
    [FieldConstants.ADDITIONAL_PROPERTIES]?: Property[];
};

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

export const staticVarCompensatorCreationDtoToForm = (
    staticCompensator: StaticVarCompensatorCreationDto
): StaticVarCompensatorCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: staticCompensator.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: staticCompensator.equipmentName ?? '',
        ...getConnectivityFormData({
            voltageLevelId: staticCompensator.voltageLevelId,
            busbarSectionId: staticCompensator.busOrBusbarSectionId,
            connectionDirection: staticCompensator.connectionDirection,
            connectionName: staticCompensator.connectionName,
            connectionPosition: staticCompensator.connectionPosition,
            terminalConnected: staticCompensator.terminalConnected,
            isEquipmentModification: false,
        }),
        ...getReactiveFormData({
            maxSusceptance: staticCompensator.maxSusceptance ?? null,
            minSusceptance: staticCompensator.minSusceptance ?? null,
            nominalV: null,
            maxQAtNominalV: staticCompensator.maxQAtNominalV ?? null,
            minQAtNominalV: staticCompensator.minQAtNominalV ?? null,
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
            b0: staticCompensator.b0 ?? null,
            q0: staticCompensator.q0 ?? null,
            lVoltageSetpoint: staticCompensator.lowVoltageSetpoint ?? null,
            hVoltageSetpoint: staticCompensator.highVoltageSetpoint ?? null,
            lVoltageThreshold: staticCompensator.lowVoltageThreshold ?? null,
            hVoltageThreshold: staticCompensator.highVoltageThreshold ?? null,
        }),
        ...getPropertiesFromModification(staticCompensator.properties),
    };
};

export const staticVarCompensatorCreationFormToDto = (
    formData: StaticVarCompensatorCreationFormData
): StaticVarCompensatorCreationDto => {
    const connectivity = formData.connectivity;
    const setpointsLimits= formData.setpointsLimits;
    const characteristicsChoice = setpointsLimits.characteristicsChoice;
    const voltageRegulationMode = setpointsLimits.voltageRegulationMode;
    const isDistantRegulation = setpointsLimits.voltageRegulationType === REGULATION_TYPES.DISTANT.id;
    const regulationEquipment = setpointsLimits.equipment;
    const automaton = formData.automaton;
    const addStandbyAutomaton = automaton.addStandbyAutomaton;

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
        maxSusceptance:
            characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id ? setpointsLimits.maxSusceptance : null,
        minSusceptance:
            characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id ? setpointsLimits.minSusceptance : null,
        maxQAtNominalV:
            characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id ? setpointsLimits.maxQAtNominalV : null,
        minQAtNominalV:
            characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id ? setpointsLimits.minQAtNominalV : null,
        regulationMode: voltageRegulationMode === VOLTAGE_REGULATION_MODES.OFF.id ? null : voltageRegulationMode,
        isRegulating: voltageRegulationMode !== VOLTAGE_REGULATION_MODES.OFF.id,
        voltageSetpoint: setpointsLimits.voltageSetpoint ?? null,
        reactivePowerSetpoint: setpointsLimits.reactivePowerSetpoint ?? null,
        voltageRegulationType: setpointsLimits.voltageRegulationType,

        regulatingTerminalId: isDistantRegulation ? regulationEquipment?.id : null,

        regulatingTerminalType: isDistantRegulation ? regulationEquipment?.type : null,
        regulatingTerminalVlId: isDistantRegulation ? setpointsLimits.voltageLevel?.id : null,
        standbyAutomatonOn: addStandbyAutomaton ?? null,
        standby: automaton.StandbyAutomaton ?? null,
        lowVoltageSetpoint: addStandbyAutomaton ? automaton.lowVoltageSetpoint : null,
        highVoltageSetpoint: addStandbyAutomaton ? automaton.highVoltageSetpoint : null,
        lowVoltageThreshold: addStandbyAutomaton ? automaton.lowVoltageThreshold : null,
        highVoltageThreshold: addStandbyAutomaton ? automaton.highVoltageThreshold : null,
        b0:
            addStandbyAutomaton && characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id
                ? automaton.b0
                : null,
        q0:
            addStandbyAutomaton && characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id
                ? automaton.q0
                : null,
        properties: toModificationProperties(formData),
    };
};
