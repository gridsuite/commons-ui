/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import {
    addSelectedFieldToRows,
    convertInputValue,
    convertOutputValue,
    DeepNullable,
    FieldConstants,
    FieldType,
    ModificationType,
    PHASE_REGULATION_MODES,
    RATIO_REGULATION_MODES,
    REGULATION_SIDES,
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
import {
    RatioTapChangerCreationDto,
    TapChangerCreationDto,
    TwoWindingsTransformerCreationDto,
} from './twoWindingsTransformerCreation.types';
import {
    getAllLimitsFormDataProperties,
    getLimitsEmptyFormDataProps,
    getLimitsValidationSchemaProps,
    sanitizeLimitsGroups,
} from '../../common/currentLimits/limitsPane.utils';
import {
    getBranchActiveReactivePowerEmptyFormDataProperties,
    getBranchActiveReactivePowerValidationSchemaObject,
} from '../../common/measurements';
import { getTwtCharacteristicsEmptyFormData, getTwtCharacteristicsValidationSchemaProps } from '../characteristics';
import {
    computeHighTapPosition,
    getPhaseTapChangerEmptyFormData,
    getPhaseTapChangerFormData,
    getPhaseTapChangerValidationSchemaProps,
    getRatioTapChangerEmptyFormData,
    getRatioTapChangerFormData,
    getRatioTapChangerValidationSchemaProps,
} from '../tapChanger';
import { REGULATION_TYPES } from '../../common';
import { TapChangerMapInfos } from '../common/twoWindingsTransformer.types';

export const getRegulationTypeForEdit = (twt: TwoWindingsTransformerCreationDto, tap: TapChangerCreationDto | null) => {
    if (tap?.terminalRefConnectableId == null) {
        return null;
    }
    return tap.terminalRefConnectableId === twt.equipmentId ? REGULATION_TYPES.LOCAL.id : REGULATION_TYPES.DISTANT.id;
};

export const computeRatioTapChangerRegulationMode = (
    ratioTapChangerFormValues?: RatioTapChangerCreationDto | TapChangerMapInfos | null
) => {
    if (ratioTapChangerFormValues?.isRegulating) {
        return RATIO_REGULATION_MODES.VOLTAGE_REGULATION.id;
    } else {
        return RATIO_REGULATION_MODES.FIXED_RATIO.id;
    }
};

export const getTapSideForEdit = (
    twt: TwoWindingsTransformerCreationDto,
    tap: TapChangerCreationDto | null | undefined
) => {
    if (tap?.terminalRefConnectableId !== twt.equipmentId) {
        return null;
    }
    return tap?.terminalRefConnectableVlId === twt?.voltageLevelId1 ? REGULATION_SIDES.SIDE1.id : REGULATION_SIDES.SIDE2.id;
};

export const twoWindingsTransformerCreationFormSchema = () =>
    object()
        .shape({
            [FieldConstants.EQUIPMENT_ID]: string().required(),
            [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
            [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionSchema(false, true),
            [FieldConstants.CHARACTERISTICS]: getTwtCharacteristicsValidationSchemaProps(false),
            [FieldConstants.LIMITS]: getLimitsValidationSchemaProps(false),
            [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerValidationSchemaObject(), // TODO DBR + toBeEstim ?
            [FieldConstants.RATIO_TAP_CHANGER]: getRatioTapChangerValidationSchemaProps(false),
            [FieldConstants.PHASE_TAP_CHANGER]: getPhaseTapChangerValidationSchemaProps(false),
        })
        .concat(creationPropertiesSchema)
        .required();

export type TwoWindingsTransformerCreationFormData = InferType<ReturnType<typeof twoWindingsTransformerCreationFormSchema>>;

export const twoWindingsTransformerCreationEmptyFormData: DeepNullable<TwoWindingsTransformerCreationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionEmptyFormDataProps(),
    [FieldConstants.CHARACTERISTICS]: getTwtCharacteristicsEmptyFormData(),
    [FieldConstants.LIMITS]: getLimitsEmptyFormDataProps(false),
    [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerEmptyFormDataProperties(),
    [FieldConstants.RATIO_TAP_CHANGER]: getRatioTapChangerEmptyFormData(false),
    [FieldConstants.PHASE_TAP_CHANGER]: getPhaseTapChangerEmptyFormData(false),
    AdditionalProperties: [],
};

export const twoWindingsTransformerCreationDtoToForm = (
    twtDto: TwoWindingsTransformerCreationDto
): TwoWindingsTransformerCreationFormData => {
    const ratioTap = twtDto.ratioTapChanger;
    const phaseTap = twtDto.phaseTapChanger;
    return {
        equipmentID: twtDto.equipmentId,
        equipmentName: twtDto.equipmentName ?? '',
        connectivity: {
            connectivity1: getConnectivityFormDataProps({
                voltageLevelId: twtDto.voltageLevelId1,
                busbarSectionId: twtDto.busOrBusbarSectionId1,
                connectionDirection: twtDto.connectionDirection1,
                connectionName: twtDto.connectionName1,
                connectionPosition: twtDto.connectionPosition1,
                terminalConnected: twtDto.connected1,
            }),
            connectivity2: getConnectivityFormDataProps({
                voltageLevelId: twtDto.voltageLevelId2,
                busbarSectionId: twtDto.busOrBusbarSectionId2,
                connectionDirection: twtDto.connectionDirection2,
                connectionName: twtDto.connectionName2,
                connectionPosition: twtDto.connectionPosition2,
                terminalConnected: twtDto.connected2,
            }),
        },
        characteristics: {
            r: twtDto.r,
            x: twtDto.x,
            g: convertInputValue(FieldType.G, twtDto.g),
            b: convertInputValue(FieldType.B, twtDto.b),
            ratedU1: twtDto.ratedU1,
            ratedU2: twtDto.ratedU2,
            ratedS: twtDto.ratedS,
        },
        AdditionalProperties: getFilledPropertiesFromModification(twtDto.properties),
        limits: getAllLimitsFormDataProperties(
            // TODO DBR twt code DIFF from limits code !! FIXME from limtis below to transformOperationalLimitsGroupsForForm ?
            twtDto?.operationalLimitsGroups?.map(({ id, ...baseData }) => ({
                ...baseData,
                name: id,
                id: id + baseData.applicability,
            })),
            twtDto?.selectedOperationalLimitsGroupId1 ?? null,
            twtDto?.selectedOperationalLimitsGroupId2 ?? null
        ),
        stateEstimation: {},
        ...getPhaseTapChangerFormData({
            enabled: phaseTap?.tapPosition !== undefined,
            regulationMode: phaseTap?.isRegulating ? phaseTap?.regulationMode : PHASE_REGULATION_MODES.OFF.id,
            regulationType: getRegulationTypeForEdit(twtDto, phaseTap),
            regulationSide: getTapSideForEdit(twtDto, phaseTap),
            currentLimiterRegulatingValue:
                phaseTap?.regulationMode === PHASE_REGULATION_MODES.CURRENT_LIMITER.id
                    ? phaseTap?.regulationValue
                    : null,
            flowSetpointRegulatingValue:
                phaseTap?.regulationMode === PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id
                    ? phaseTap?.regulationValue
                    : null,
            targetDeadband: phaseTap?.targetDeadband,
            lowTapPosition: phaseTap?.lowTapPosition,
            highTapPosition: computeHighTapPosition(phaseTap?.steps ?? []),
            tapPosition: phaseTap?.tapPosition,
            steps: addSelectedFieldToRows(phaseTap?.steps ?? []),
            equipmentID: phaseTap?.terminalRefConnectableId ?? undefined,
            equipmentType: phaseTap?.terminalRefConnectableType ?? undefined,
            voltageLevelId: phaseTap?.terminalRefConnectableVlId ?? undefined,
        }),
        ...getRatioTapChangerFormData({
            enabled: ratioTap?.tapPosition !== undefined,
            hasLoadTapChangingCapabilities: ratioTap?.hasLoadTapChangingCapabilities,
            regulationMode: computeRatioTapChangerRegulationMode(ratioTap),
            regulationType: getRegulationTypeForEdit(twtDto, ratioTap),
            regulationSide: getTapSideForEdit(twtDto, ratioTap),
            targetV: ratioTap?.targetV,
            targetDeadband: ratioTap?.targetDeadband,
            lowTapPosition: ratioTap?.lowTapPosition,
            highTapPosition: computeHighTapPosition(ratioTap?.steps ?? []),
            tapPosition: ratioTap?.tapPosition,
            steps: addSelectedFieldToRows(ratioTap?.steps ?? []),
            equipmentId: ratioTap?.terminalRefConnectableId ?? undefined,
            equipmentType: ratioTap?.terminalRefConnectableType ?? undefined,
            voltageLevelId: ratioTap?.terminalRefConnectableVlId ?? undefined,
        }),
    };
};

export const twoWindingsTransformerCreationFormToDto = (
    twtForm: TwoWindingsTransformerCreationFormData
): TwoWindingsTransformerCreationDto => {
    return {
        type: ModificationType.TWO_WINDINGS_TRANSFORMER_CREATION,
        equipmentId: twtForm.equipmentID,
        equipmentName: sanitizeString(twtForm.equipmentName),
        // connectivity
        voltageLevelId1: twtForm.connectivity.connectivity1.voltageLevel?.id ?? '',
        busOrBusbarSectionId1: twtForm.connectivity.connectivity1.busOrBusbarSection?.id ?? '',
        connectionDirection1: twtForm.connectivity.connectivity1.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName1: sanitizeString(twtForm.connectivity.connectivity1.connectionName),
        connectionPosition1: twtForm.connectivity.connectivity1.connectionPosition,
        connected1: twtForm.connectivity.connectivity1.terminalConnected ?? null,
        voltageLevelId2: twtForm.connectivity.connectivity2.voltageLevel?.id ?? '',
        busOrBusbarSectionId2: twtForm.connectivity.connectivity2.busOrBusbarSection?.id ?? '',
        connectionDirection2: twtForm.connectivity.connectivity2.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName2: sanitizeString(twtForm.connectivity.connectivity2.connectionName),
        connectionPosition2: twtForm.connectivity.connectivity2.connectionPosition,
        connected2: twtForm.connectivity.connectivity2.terminalConnected ?? null,
        // characteristics
        r: twtForm.characteristics.r ?? null,
        x: twtForm.characteristics.x ?? null,
        g1: convertOutputValue(FieldType.G1, twtForm.characteristics.g1),
        b1: convertOutputValue(FieldType.B1, twtForm.characteristics.b1),
        g2: convertOutputValue(FieldType.G2, twtForm.characteristics.g2),
        b2: convertOutputValue(FieldType.B2, twtForm.characteristics.b2),
        properties: toModificationProperties(twtForm),
        // limits
        operationalLimitsGroups: sanitizeLimitsGroups(twtForm.limits.operationalLimitsGroups ?? []),
        selectedOperationalLimitsGroupId1: twtForm.limits.selectedOperationalLimitsGroupId1 ?? null,
        selectedOperationalLimitsGroupId2: twtForm.limits.selectedOperationalLimitsGroupId2 ?? null,
    };
};
