/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { boolean, InferType, object, string } from 'yup';
import { IntlShape } from 'react-intl';
import {
    convertInputValue,
    convertOutputValue,
    DeepNullable,
    FieldConstants,
    FieldType,
    ModificationType,
    sanitizeString,
    toModificationOperation,
} from '../../../../utils';
import {
    getBranchConnectivityWithPositionEmptyFormDataProps,
    getBranchConnectivityWithPositionSchema,
    getConnectivityFormDataProps,
} from '../../common/connectivity';
import {
    getPropertiesFromModification,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common/properties';
import { LineModificationDto } from './lineModification.types';
import {
    getLineCharacteristicsEmptyFormData,
    getLineCharacteristicsValidationSchemaProps,
} from '../characteristicsPane';
import {
    addModificationTypeToOpLimitsGroups,
    addOperationTypeToSelectedOpLG,
    formatOpLimitGroupsToFormInfos,
    getAllLimitsFormDataProperties,
    getLimitsEmptyFormDataProps,
    getLimitsValidationSchemaProps,
    sanitizeLimitsGroups,
} from '../../common/currentLimits/limitsPane.utils';
import {
    getBranchActiveReactivePowerEditDataProperties,
    getBranchActiveReactivePowerEmptyFormDataProperties,
    getBranchActiveReactivePowerValidationSchemaObject,
} from '../../common/measurements';
import { convertToLineSegmentInfos, LineSegmentsInfoSchema } from '../lineTypesCatalog';
import { OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE } from '../../common';

export const lineModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionSchema(true, true),
        [FieldConstants.CHARACTERISTICS]: getLineCharacteristicsValidationSchemaProps(true),
        [FieldConstants.LIMITS]: getLimitsValidationSchemaProps(true),
        [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerValidationSchemaObject(),
        [FieldConstants.LINE_SEGMENTS]: LineSegmentsInfoSchema,
        [FieldConstants.APPLY_SEGMENTS_LIMITS]: boolean().required(),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type LineModificationFormData = InferType<typeof lineModificationFormSchema>;

export const lineModificationEmptyFormData: DeepNullable<LineModificationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionEmptyFormDataProps(true),
    [FieldConstants.CHARACTERISTICS]: getLineCharacteristicsEmptyFormData(),
    [FieldConstants.LIMITS]: getLimitsEmptyFormDataProps(true),
    [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerEmptyFormDataProperties(),
    [FieldConstants.LINE_SEGMENTS]: [],
    [FieldConstants.APPLY_SEGMENTS_LIMITS]: true,
    AdditionalProperties: [],
};

export const lineModificationDtoToForm = (
    lineDto: LineModificationDto,
    includePreviousValues = true
): LineModificationFormData => {
    return {
        equipmentID: lineDto.equipmentId,
        equipmentName: lineDto.equipmentName?.value ?? '',
        ...getPropertiesFromModification(lineDto?.properties, includePreviousValues),
        limits: getAllLimitsFormDataProperties(
            formatOpLimitGroupsToFormInfos(lineDto.operationalLimitsGroups),
            lineDto.selectedOperationalLimitsGroupId1?.value ?? null,
            lineDto.selectedOperationalLimitsGroupId2?.value ?? null,
            lineDto.enableOLGModification
        ),
        connectivity: {
            connectivity1: getConnectivityFormDataProps({
                voltageLevelId: lineDto?.voltageLevelId1?.value ?? null,
                busbarSectionId: lineDto?.busOrBusbarSectionId1?.value ?? null,
                connectionName: lineDto?.connectionName1?.value ?? '',
                connectionDirection: lineDto?.connectionDirection1?.value ?? null,
                connectionPosition: lineDto?.connectionPosition1?.value ?? null,
                terminalConnected: lineDto?.terminal1Connected?.value ?? null,
                isEquipmentModification: true,
            }),
            connectivity2: getConnectivityFormDataProps({
                voltageLevelId: lineDto?.voltageLevelId2?.value ?? null,
                busbarSectionId: lineDto?.busOrBusbarSectionId2?.value ?? null,
                connectionName: lineDto?.connectionName2?.value ?? '',
                connectionDirection: lineDto?.connectionDirection2?.value ?? null,
                connectionPosition: lineDto?.connectionPosition2?.value ?? null,
                terminalConnected: lineDto?.terminal2Connected?.value ?? null,
                isEquipmentModification: true,
            }),
        },
        stateEstimation: getBranchActiveReactivePowerEditDataProperties(lineDto),
        characteristics: {
            r: lineDto.r?.value ?? null,
            x: lineDto.x?.value ?? null,
            g1: convertInputValue(FieldType.G1, lineDto.g1?.value ?? null),
            b1: convertInputValue(FieldType.B1, lineDto.b1?.value ?? null),
            g2: convertInputValue(FieldType.G2, lineDto.g2?.value ?? null),
            b2: convertInputValue(FieldType.B2, lineDto.b2?.value ?? null),
        },
        lineSegments: lineDto.lineSegments,
        applySegmentsLimits: lineDto.applySegmentsLimits ?? true,
    };
};

export const lineModificationFormToDto = (line: LineModificationFormData, intl: IntlShape): LineModificationDto => {
    const connectivity1 = line.connectivity?.connectivity1;
    const connectivity2 = line.connectivity?.connectivity2;
    const { characteristics, limits } = line;
    return {
        type: ModificationType.LINE_MODIFICATION,
        equipmentId: line.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(line.equipmentName) ?? ''),
        r: toModificationOperation(characteristics.r),
        x: toModificationOperation(characteristics.x),
        g1: toModificationOperation(convertOutputValue(FieldType.G1, characteristics.g1)),
        g2: toModificationOperation(convertOutputValue(FieldType.G2, characteristics.g2)),
        b1: toModificationOperation(convertOutputValue(FieldType.B1, characteristics.b1)),
        b2: toModificationOperation(convertOutputValue(FieldType.B2, characteristics.b2)),
        enableOLGModification: limits.enableOLGModification,
        operationalLimitsGroupsModificationType: limits.enableOLGModification
            ? OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE.REPLACE
            : null,
        operationalLimitsGroups: limits.enableOLGModification
            ? addModificationTypeToOpLimitsGroups(sanitizeLimitsGroups(limits.operationalLimitsGroups))
            : [],
        selectedOperationalLimitsGroupId1: addOperationTypeToSelectedOpLG(
            limits.selectedOperationalLimitsGroupId1,
            intl.formatMessage({ id: 'None' })
        ),
        selectedOperationalLimitsGroupId2: addOperationTypeToSelectedOpLG(
            limits.selectedOperationalLimitsGroupId2,
            intl.formatMessage({ id: 'None' })
        ),
        voltageLevelId1: toModificationOperation(connectivity1.voltageLevel?.id),
        busOrBusbarSectionId1: toModificationOperation(connectivity1.busOrBusbarSection?.id),
        connectionName1: toModificationOperation(sanitizeString(connectivity1.connectionName)),
        connectionDirection1: toModificationOperation(connectivity1.connectionDirection),
        connectionPosition1: toModificationOperation(connectivity1.connectionPosition),
        terminal1Connected: toModificationOperation(connectivity1.terminalConnected),
        voltageLevelId2: toModificationOperation(connectivity2.voltageLevel?.id),
        busOrBusbarSectionId2: toModificationOperation(connectivity2.busOrBusbarSection?.id),
        connectionName2: toModificationOperation(sanitizeString(connectivity2.connectionName)),
        connectionDirection2: toModificationOperation(connectivity2.connectionDirection),
        connectionPosition2: toModificationOperation(connectivity2.connectionPosition),
        terminal2Connected: toModificationOperation(connectivity2.terminalConnected),
        properties: toModificationProperties(line),
        p1MeasurementValue: toModificationOperation(line.stateEstimation?.measurementP1?.value),
        p1MeasurementValidity: toModificationOperation(line.stateEstimation?.measurementP1?.validity),
        q1MeasurementValue: toModificationOperation(line.stateEstimation?.measurementQ1?.value),
        q1MeasurementValidity: toModificationOperation(line.stateEstimation?.measurementQ1?.validity),
        p2MeasurementValue: toModificationOperation(line.stateEstimation?.measurementP2?.value),
        p2MeasurementValidity: toModificationOperation(line.stateEstimation?.measurementP2?.validity),
        q2MeasurementValue: toModificationOperation(line.stateEstimation?.measurementQ2?.value),
        q2MeasurementValidity: toModificationOperation(line.stateEstimation?.measurementQ2?.validity),
        lineSegments: convertToLineSegmentInfos(line.lineSegments),
        applySegmentsLimits: line.applySegmentsLimits ?? true,
    };
};
