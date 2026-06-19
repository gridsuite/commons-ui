/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import {
    convertInputValue,
    convertOutputValue,
    DeepNullable,
    FieldConstants,
    FieldType,
    ModificationType,
    sanitizeString,
    UNDEFINED_CONNECTION_DIRECTION,
} from '../../../../utils';
import {
    getBranchConnectivityWithPositionEmptyFormDataProps,
    getBranchConnectivityWithPositionSchema,
    getConnectivityFormDataProps,
} from '../../common/connectivity';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties';
import { LineCreationDto } from './lineCreation.types';
import {
    getLineCharacteristicsEmptyFormData,
    getLineCharacteristicsValidationSchemaProps,
} from '../characteristicsPane';
import {
    getAllLimitsFormDataProperties,
    getLimitsEmptyFormDataProps,
    getLimitsValidationSchemaProps,
    sanitizeLimitsGroups,
} from '../../common/limits/limitsPane.utils';
import {
    getBranchActiveReactivePowerEditDataProperties,
    getBranchActiveReactivePowerEmptyFormDataProperties,
    getBranchActiveReactivePowerValidationSchemaObject,
} from '../../common/measurements';

export const lineCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionSchema(false),
        [FieldConstants.CHARACTERISTICS]: getLineCharacteristicsValidationSchemaProps(false),
        [FieldConstants.LIMITS]: getLimitsValidationSchemaProps(false),
        [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerValidationSchemaObject(),
    })
    .concat(creationPropertiesSchema)
    .required();

export type LineCreationFormData = InferType<typeof lineCreationFormSchema>;

export const lineCreationEmptyFormData: DeepNullable<LineCreationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionEmptyFormDataProps(),
    [FieldConstants.CHARACTERISTICS]: getLineCharacteristicsEmptyFormData(),
    [FieldConstants.LIMITS]: getLimitsEmptyFormDataProps(false),
    [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerEmptyFormDataProperties(),
    AdditionalProperties: [],
};

export const lineCreationDtoToForm = (lineDto: LineCreationDto): LineCreationFormData => {
    return {
        equipmentID: lineDto.equipmentId,
        equipmentName: lineDto.equipmentName ?? '',
        connectivity: {
            connectivity1: getConnectivityFormDataProps({
                voltageLevelId: lineDto.voltageLevelId1,
                busbarSectionId: lineDto.busOrBusbarSectionId1,
                connectionDirection: lineDto.connectionDirection1,
                connectionName: lineDto.connectionName1,
                connectionPosition: lineDto.connectionPosition1,
                terminalConnected: lineDto.connected1,
            }),
            connectivity2: getConnectivityFormDataProps({
                voltageLevelId: lineDto.voltageLevelId2,
                busbarSectionId: lineDto.busOrBusbarSectionId2,
                connectionDirection: lineDto.connectionDirection2,
                connectionName: lineDto.connectionName2,
                connectionPosition: lineDto.connectionPosition2,
                terminalConnected: lineDto.connected2,
            }),
        },
        characteristics: {
            r: lineDto.r,
            x: lineDto.x,
            g1: convertInputValue(FieldType.G1, lineDto.g1),
            b1: convertInputValue(FieldType.B1, lineDto.b1),
            g2: convertInputValue(FieldType.G2, lineDto.g2),
            b2: convertInputValue(FieldType.B2, lineDto.b2),
        },
        AdditionalProperties: getFilledPropertiesFromModification(lineDto.properties),
        limits: getAllLimitsFormDataProperties(
            lineDto?.operationalLimitsGroups?.map(({ id, ...baseData }) => ({
                ...baseData,
                name: id,
                id: id + baseData.applicability,
            })),
            lineDto?.selectedOperationalLimitsGroupId1 ?? null,
            lineDto?.selectedOperationalLimitsGroupId2 ?? null
        ),
        stateEstimation: getBranchActiveReactivePowerEditDataProperties(lineDto),
    };
};

export const lineCreationFormToDto = (lineForm: LineCreationFormData): LineCreationDto => {
    return {
        type: ModificationType.LINE_CREATION,
        equipmentId: lineForm.equipmentID,
        equipmentName: sanitizeString(lineForm.equipmentName),
        // connectivity
        voltageLevelId1: lineForm.connectivity.connectivity1.voltageLevel?.id ?? '',
        busOrBusbarSectionId1: lineForm.connectivity.connectivity1.busOrBusbarSection?.id ?? '',
        connectionDirection1: lineForm.connectivity.connectivity1.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName1: sanitizeString(lineForm.connectivity.connectivity1.connectionName),
        connectionPosition1: lineForm.connectivity.connectivity1.connectionPosition,
        connected1: lineForm.connectivity.connectivity1.terminalConnected ?? null,
        voltageLevelId2: lineForm.connectivity.connectivity2.voltageLevel?.id ?? '',
        busOrBusbarSectionId2: lineForm.connectivity.connectivity2.busOrBusbarSection?.id ?? '',
        connectionDirection2: lineForm.connectivity.connectivity2.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName2: sanitizeString(lineForm.connectivity.connectivity2.connectionName),
        connectionPosition2: lineForm.connectivity.connectivity2.connectionPosition,
        connected2: lineForm.connectivity.connectivity2.terminalConnected ?? null,
        // characteristics
        r: lineForm.characteristics.r ?? null,
        x: lineForm.characteristics.x ?? null,
        g1: convertOutputValue(FieldType.G1, lineForm.characteristics.g1),
        b1: convertOutputValue(FieldType.B1, lineForm.characteristics.b1),
        g2: convertOutputValue(FieldType.G2, lineForm.characteristics.g2),
        b2: convertOutputValue(FieldType.B2, lineForm.characteristics.b2),
        properties: toModificationProperties(lineForm),
        // limits
        operationalLimitsGroups: sanitizeLimitsGroups(lineForm.limits.operationalLimitsGroups ?? []),
        selectedOperationalLimitsGroupId1: lineForm.limits.selectedOperationalLimitsGroupId1 ?? null,
        selectedOperationalLimitsGroupId2: lineForm.limits.selectedOperationalLimitsGroupId2 ?? null,
        // TODO DBR lineSegments
    };
};
