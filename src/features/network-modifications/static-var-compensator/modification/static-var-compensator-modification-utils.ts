/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import {
    DeepNullable,
    FieldConstants,
    ModificationType,
    sanitizeString,
    toModificationOperation,
} from '../../../../utils';
import {
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
    getPropertiesFromModification,
    modificationPropertiesSchema,
    REGULATION_TYPES,
    toModificationProperties,
} from '../../common';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { VOLTAGE_REGULATION_MODES } from '../common/constants';
import {
    getReactiveModificationFormEmptyFormData,
    getReactiveModificationFormValidationSchema,
} from '../common/set-points-limits-form-utils';
import { StaticVarCompensatorModificationDto } from './static-var-compensator-modification.types';

export const staticVarCompensatorModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(true),
        [FieldConstants.SETPOINTS_LIMITS]: getReactiveModificationFormValidationSchema(),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type StaticVarCompensatorModificationFormData = InferType<typeof staticVarCompensatorModificationFormSchema>;

export const staticVarCompensatorModificationEmptyFormData: DeepNullable<StaticVarCompensatorModificationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionEmptyFormDataProps(true),
    [FieldConstants.SETPOINTS_LIMITS]: getReactiveModificationFormEmptyFormData()[FieldConstants.SETPOINTS_LIMITS],
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

const getRegulationModeFormValue = (dto: StaticVarCompensatorModificationDto) => {
    if (dto.regulating?.value === false) {
        return VOLTAGE_REGULATION_MODES.OFF.id;
    }
    return dto.regulationMode?.value ?? null;
};

export const staticVarCompensatorModificationDtoToForm = (
    dto: StaticVarCompensatorModificationDto,
    includePreviousValues = true
): StaticVarCompensatorModificationFormData => {
    // a modification can change only one of the two limits
    const isSusceptanceChoice = dto.minSusceptance != null || dto.maxSusceptance != null;
    const regulatingTerminalVlId = dto.regulatingTerminalVlId?.value;
    const regulatingTerminalId = dto.regulatingTerminalId?.value;
    const regulatingTerminalType = dto.regulatingTerminalType?.value;

    return {
        [FieldConstants.EQUIPMENT_ID]: dto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: dto.equipmentName?.value ?? '',
        [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
            voltageLevelId: dto.voltageLevelId?.value ?? null,
            busbarSectionId: dto.busOrBusbarSectionId?.value ?? null,
            connectionName: dto.connectionName?.value ?? '',
            connectionDirection: dto.connectionDirection?.value ?? null,
            connectionPosition: dto.connectionPosition?.value ?? null,
            terminalConnected: dto.terminalConnected?.value ?? null,
            isEquipmentModification: true,
        }),
        [FieldConstants.SETPOINTS_LIMITS]: {
            [FieldConstants.CHARACTERISTICS_CHOICE]: isSusceptanceChoice
                ? CHARACTERISTICS_CHOICES.SUSCEPTANCE.id
                : CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
            [FieldConstants.MAX_SUSCEPTANCE]: dto.maxSusceptance?.value ?? null,
            [FieldConstants.MIN_SUSCEPTANCE]: dto.minSusceptance?.value ?? null,
            [FieldConstants.MAX_Q_AT_NOMINAL_V]: dto.maxQAtNominalV?.value ?? null,
            [FieldConstants.MIN_Q_AT_NOMINAL_V]: dto.minQAtNominalV?.value ?? null,
            [FieldConstants.VOLTAGE_REGULATION_MODE]: getRegulationModeFormValue(dto),
            [FieldConstants.VOLTAGE_SET_POINT]: dto.voltageSetpoint?.value ?? null,
            [FieldConstants.REACTIVE_POWER_SET_POINT]: dto.reactivePowerSetpoint?.value ?? null,
            [FieldConstants.VOLTAGE_REGULATION_TYPE]: dto.voltageRegulationType?.value ?? null,
            [FieldConstants.VOLTAGE_LEVEL]: regulatingTerminalVlId
                ? { [FieldConstants.ID]: regulatingTerminalVlId }
                : null,
            [FieldConstants.EQUIPMENT]:
                regulatingTerminalId && regulatingTerminalType
                    ? { [FieldConstants.ID]: regulatingTerminalId, [FieldConstants.TYPE]: regulatingTerminalType }
                    : null,
        },
        ...getPropertiesFromModification(dto.properties, includePreviousValues),
    };
};

export const staticVarCompensatorModificationFormToDto = (
    form: StaticVarCompensatorModificationFormData
): StaticVarCompensatorModificationDto => {
    const { connectivity, setpointsLimits } = form;
    const { characteristicsChoice, voltageRegulationMode, voltageRegulationType } = setpointsLimits;
    const isSusceptanceChoice = characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id;
    const isQAtNominalVChoice = characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id;
    const isRegulationOff = voltageRegulationMode === VOLTAGE_REGULATION_MODES.OFF.id;
    const isDistantRegulation = voltageRegulationType === REGULATION_TYPES.DISTANT.id;

    return {
        type: ModificationType.STATIC_VAR_COMPENSATOR_MODIFICATION,
        equipmentId: form.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(form.equipmentName)),
        voltageLevelId: toModificationOperation(connectivity?.voltageLevel?.id),
        busOrBusbarSectionId: toModificationOperation(connectivity?.busOrBusbarSection?.id),
        connectionDirection: toModificationOperation(connectivity?.connectionDirection),
        connectionName: toModificationOperation(sanitizeString(connectivity?.connectionName)),
        connectionPosition: toModificationOperation(connectivity?.connectionPosition),
        terminalConnected: toModificationOperation(connectivity?.terminalConnected),
        maxSusceptance: isSusceptanceChoice ? toModificationOperation(setpointsLimits.maxSusceptance) : null,
        minSusceptance: isSusceptanceChoice ? toModificationOperation(setpointsLimits.minSusceptance) : null,
        maxQAtNominalV: isQAtNominalVChoice ? toModificationOperation(setpointsLimits.maxQAtNominalV) : null,
        minQAtNominalV: isQAtNominalVChoice ? toModificationOperation(setpointsLimits.minQAtNominalV) : null,
        // OFF doesn't exist in powsybl: it only sets regulating to false and keeps the regulation mode
        regulationMode: isRegulationOff ? null : toModificationOperation(voltageRegulationMode),
        regulating: voltageRegulationMode ? toModificationOperation(!isRegulationOff) : null,
        voltageSetpoint: toModificationOperation(setpointsLimits.voltageSetpoint),
        reactivePowerSetpoint: toModificationOperation(setpointsLimits.reactivePowerSetpoint),
        voltageRegulationType: toModificationOperation(voltageRegulationType),
        regulatingTerminalId: isDistantRegulation ? toModificationOperation(setpointsLimits.equipment?.id) : null,
        regulatingTerminalType: isDistantRegulation ? toModificationOperation(setpointsLimits.equipment?.type) : null,
        regulatingTerminalVlId: isDistantRegulation ? toModificationOperation(setpointsLimits.voltageLevel?.id) : null,
        properties: toModificationProperties(form) ?? null,
    };
};
