/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import { IntlShape } from 'react-intl';
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
import {
    addModificationTypeToOpLimitsGroups,
    addOperationTypeToSelectedOpLG,
    formatOpLimitGroupsToFormInfos,
    getAllLimitsFormData,
    getLimitsEmptyFormDataProps,
    getLimitsValidationSchemaProps,
} from '../../common/currentLimits/limitsPane.utils';
import { getTwtCharacteristicsEmptyFormData, getTwtCharacteristicsValidationSchemaProps } from '../characteristics';
import {
    compareStepsWithPreviousValues,
    computeHighTapPosition,
    computeRatioTapChangerRegulating,
    getComputedPhaseTapChangerRegulationMode,
    getComputedPreviousPhaseRegulationType,
    getComputedPreviousRatioRegulationType,
    getPhaseTapChangerEmptyFormData,
    getPhaseTapChangerFormData,
    getPhaseTapChangerValidationSchemaProps,
    getRatioTapChangerEmptyFormData,
    getRatioTapChangerFormData,
    getRatioTapChangerValidationSchemaProps,
    PhaseTapChangerFormSchema,
    RatioTapChangerFormSchema,
    toTapChangerStepList,
} from '../tapChanger';
import { getToBeEstimatedValidationSchemaObject, toBeEstimatedEmptyFormData } from './measurements';
import {
    getBranchActiveReactivePowerEditDataProperties,
    getBranchActiveReactivePowerEmptyFormDataProperties,
    getBranchActiveReactivePowerValidationSchemaObject,
    OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE,
    OperationalLimitsGroupFormSchema,
    REGULATION_TYPES,
} from '../../common';
import {
    PhaseTapChangerModificationDto,
    RatioTapChangerModificationDto,
    TapChangerModificationDto,
    TwoWindingsTransformerModificationDto,
} from './twoWindingsTransformerModification.types';
import { TapChangerStep, TwoWindingsTransformerMapInfos } from '../common/twoWindingsTransformer.types';
import { TapChangerStepCreationDto } from '../creation/twoWindingsTransformerCreation.types';

const getTapChangerEmptyModificationDto = (enabled: boolean | null | undefined): TapChangerModificationDto => ({
    enabled: toModificationOperation(enabled),
    regulationType: null,
    regulationSide: null,
    lowTapPosition: null,
    tapPosition: null,
    isRegulating: null,
    targetDeadband: null,
    terminalRefConnectableId: null,
    terminalRefConnectableType: null,
    terminalRefConnectableVlId: null,
    steps: null,
    hasLoadTapChangingCapabilities: null,
});

export const getRatioTapChangerEmptyModificationDto = (
    enabled: boolean | null | undefined
): RatioTapChangerModificationDto => ({
    ...getTapChangerEmptyModificationDto(enabled),
    targetV: null,
});

export const getPhaseTapChangerEmptyModificationDto = (
    enabled: boolean | null | undefined
): PhaseTapChangerModificationDto => ({
    ...getTapChangerEmptyModificationDto(enabled),
    regulationMode: null,
    regulationValue: null,
});

const computeRatioTapChangerRegulationMode = (ratioTapForm: RatioTapChangerModificationDto | null): string | null => {
    if (ratioTapForm?.isRegulating?.value == null) {
        return null;
    }
    if (ratioTapForm?.isRegulating?.value) {
        return RATIO_REGULATION_MODES.VOLTAGE_REGULATION.id;
    }
    return RATIO_REGULATION_MODES.FIXED_RATIO.id;
};

const getRatioTapChangerModificationDto = (
    ratioTapForm: RatioTapChangerFormSchema | null,
    twtToModify: TwoWindingsTransformerMapInfos | null,
    enabled: boolean | null | undefined,
    steps: TapChangerStepCreationDto[] | null
) => {
    const ratioTap = getRatioTapChangerEmptyModificationDto(enabled);
    ratioTap.hasLoadTapChangingCapabilities = toModificationOperation(ratioTapForm?.hasLoadTapChangingCapabilities);
    ratioTap.tapPosition = toModificationOperation(ratioTapForm?.tapPosition);
    ratioTap.lowTapPosition = toModificationOperation(ratioTapForm?.lowTapPosition);
    ratioTap.steps = steps;
    const hasLoadTapChangingCapabilities =
        ratioTapForm?.hasLoadTapChangingCapabilities ?? twtToModify?.ratioTapChanger?.hasLoadTapChangingCapabilities;
    const regulationType =
        ratioTapForm?.regulationType ?? (twtToModify ? getComputedPreviousRatioRegulationType(twtToModify) : undefined);
    if (hasLoadTapChangingCapabilities) {
        ratioTap.regulationType = toModificationOperation(ratioTapForm?.regulationType);
        ratioTap.isRegulating = toModificationOperation(
            ratioTapForm?.regulationMode ? computeRatioTapChangerRegulating(ratioTapForm) : null
        );
        if (regulationType === REGULATION_TYPES.LOCAL.id) {
            ratioTap.regulationSide = toModificationOperation(ratioTapForm?.regulationSide);
        } else if (regulationType === REGULATION_TYPES.DISTANT.id) {
            ratioTap.terminalRefConnectableId = toModificationOperation(ratioTapForm?.[FieldConstants.EQUIPMENT]?.id);
            ratioTap.terminalRefConnectableType = toModificationOperation(
                ratioTapForm?.[FieldConstants.EQUIPMENT]?.type
            );
            ratioTap.terminalRefConnectableVlId = toModificationOperation(ratioTapForm?.voltageLevel?.id);
        }
        ratioTap.targetV = toModificationOperation(ratioTapForm?.targetV != null ? Number(ratioTapForm.targetV) : null);
        ratioTap.targetDeadband = toModificationOperation(
            ratioTapForm?.targetDeadband != null ? Number(ratioTapForm.targetDeadband) : null
        );
    }
    return ratioTap;
};

const computeRatioTapDto = (
    ratioTapForm: RatioTapChangerFormSchema | null,
    editData: TwoWindingsTransformerModificationDto | undefined,
    twtToModify: TwoWindingsTransformerMapInfos | null,
    isNodeBuilt: boolean = false
): RatioTapChangerModificationDto => {
    const enableRatioTapChanger =
        ratioTapForm?.enabled !== !!twtToModify?.ratioTapChanger ? ratioTapForm?.enabled : null;

    const areRatioStepsModified =
        isNodeBuilt && editData?.ratioTapChanger?.steps
            ? true
            : !compareStepsWithPreviousValues(
                  ratioTapForm?.steps as TapChangerStep[],
                  toTapChangerStepList(twtToModify?.ratioTapChanger?.steps)
              );

    if (ratioTapForm?.enabled) {
        const ratioTapChangerSteps: TapChangerStepCreationDto[] | null = areRatioStepsModified
            ? (ratioTapForm?.steps ?? []).map((step) => ({
                  index: step.index,
                  r: step.r ?? 0,
                  x: step.x ?? 0,
                  g: step.g ?? 0,
                  b: step.b ?? 0,
                  rho: step.rho ?? 0,
              }))
            : null;
        return getRatioTapChangerModificationDto(
            ratioTapForm,
            twtToModify,
            enableRatioTapChanger,
            ratioTapChangerSteps
        );
    }
    return getRatioTapChangerEmptyModificationDto(enableRatioTapChanger);
};

const computePhaseTapChangerRegulationValue = (
    phaseTapForm: PhaseTapChangerFormSchema | null,
    currentRegulationMode?: string
): number | undefined => {
    const regulationMode = phaseTapForm?.regulationMode || currentRegulationMode;

    switch (regulationMode) {
        case PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id:
            return phaseTapForm?.flowSetPointRegulatingValue ?? undefined;
        case PHASE_REGULATION_MODES.CURRENT_LIMITER.id:
            return phaseTapForm?.currentLimiterRegulatingValue ?? undefined;
        default:
            return undefined;
    }
};

const getPhaseTapChangerModificationDto = (
    phaseTapForm: PhaseTapChangerFormSchema | null,
    twtToModify: TwoWindingsTransformerMapInfos | null,
    enabled: boolean | null | undefined,
    steps: TapChangerStepCreationDto[] | null
) => {
    const phaseTap = getPhaseTapChangerEmptyModificationDto(enabled);
    phaseTap.isRegulating = toModificationOperation(
        phaseTapForm?.regulationMode ? phaseTapForm?.regulationMode !== PHASE_REGULATION_MODES.OFF.id : null
    );
    phaseTap.regulationMode = toModificationOperation(
        phaseTapForm?.regulationMode !== PHASE_REGULATION_MODES.OFF.id ? phaseTapForm?.regulationMode : null
    );
    phaseTap.tapPosition = toModificationOperation(phaseTapForm?.tapPosition);
    phaseTap.lowTapPosition = toModificationOperation(phaseTapForm?.lowTapPosition);
    phaseTap.steps = steps;
    const regulationMode =
        phaseTapForm?.regulationMode ?? getComputedPhaseTapChangerRegulationMode(twtToModify?.phaseTapChanger)?.id;
    const regulationType =
        phaseTapForm?.regulationType ?? (twtToModify ? getComputedPreviousPhaseRegulationType(twtToModify) : undefined);
    if (regulationMode) {
        phaseTap.regulationType = toModificationOperation(phaseTapForm?.regulationType);
        if (regulationType === REGULATION_TYPES.LOCAL.id) {
            phaseTap.regulationSide = toModificationOperation(phaseTapForm?.regulationSide);
        } else if (regulationType === REGULATION_TYPES.DISTANT.id) {
            phaseTap.terminalRefConnectableId = toModificationOperation(phaseTapForm?.[FieldConstants.EQUIPMENT]?.id);
            phaseTap.terminalRefConnectableType = toModificationOperation(
                phaseTapForm?.[FieldConstants.EQUIPMENT]?.type
            );
            phaseTap.terminalRefConnectableVlId = toModificationOperation(phaseTapForm?.voltageLevel?.id);
        }
        phaseTap.regulationValue = toModificationOperation(
            computePhaseTapChangerRegulationValue(phaseTapForm, twtToModify?.phaseTapChanger?.regulationMode)
        );
        phaseTap.targetDeadband = toModificationOperation(phaseTapForm?.targetDeadband);
    }
    return phaseTap;
};

const computePhaseTapDto = (
    phaseTapForm: PhaseTapChangerFormSchema | null,
    editData: TwoWindingsTransformerModificationDto | undefined,
    twtToModify: TwoWindingsTransformerMapInfos | null,
    isNodeBuilt: boolean = false
): PhaseTapChangerModificationDto => {
    const enablePhaseTapChanger =
        phaseTapForm?.enabled !== !!twtToModify?.phaseTapChanger ? phaseTapForm?.enabled : null;

    const arePhaseStepsModified =
        isNodeBuilt && editData?.phaseTapChanger?.steps
            ? true
            : !compareStepsWithPreviousValues(
                  phaseTapForm?.steps as TapChangerStep[],
                  toTapChangerStepList(twtToModify?.phaseTapChanger?.steps)
              );

    if (phaseTapForm?.enabled) {
        const phaseTapChangerSteps: TapChangerStepCreationDto[] | null = arePhaseStepsModified
            ? (phaseTapForm?.steps ?? []).map((step) => ({
                  index: step.index,
                  r: step.r ?? 0,
                  x: step.x ?? 0,
                  g: step.g ?? 0,
                  b: step.b ?? 0,
                  rho: step.rho ?? 0,
                  alpha: step.alpha ?? 0,
              }))
            : null;
        return getPhaseTapChangerModificationDto(
            phaseTapForm,
            twtToModify,
            enablePhaseTapChanger,
            phaseTapChangerSteps
        );
    }
    return getPhaseTapChangerEmptyModificationDto(enablePhaseTapChanger);
};

export const twoWindingsTransformerModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionSchema(true, true),
        [FieldConstants.CHARACTERISTICS]: getTwtCharacteristicsValidationSchemaProps(true),
        [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerValidationSchemaObject(),
        [FieldConstants.TO_BE_ESTIMATED]: getToBeEstimatedValidationSchemaObject(),
        [FieldConstants.LIMITS]: getLimitsValidationSchemaProps(true),
        [FieldConstants.RATIO_TAP_CHANGER]: getRatioTapChangerValidationSchemaProps(true),
        [FieldConstants.PHASE_TAP_CHANGER]: getPhaseTapChangerValidationSchemaProps(true),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type TwoWindingsTransformerModificationFormData = InferType<typeof twoWindingsTransformerModificationFormSchema>;

export const twoWindingsTransformerModificationEmptyFormData: DeepNullable<TwoWindingsTransformerModificationFormData> =
    {
        [FieldConstants.EQUIPMENT_ID]: '',
        [FieldConstants.EQUIPMENT_NAME]: '',
        [FieldConstants.CONNECTIVITY]: getBranchConnectivityWithPositionEmptyFormDataProps(true),
        [FieldConstants.CHARACTERISTICS]: getTwtCharacteristicsEmptyFormData(),
        [FieldConstants.STATE_ESTIMATION]: getBranchActiveReactivePowerEmptyFormDataProperties(),
        [FieldConstants.TO_BE_ESTIMATED]: toBeEstimatedEmptyFormData,
        [FieldConstants.LIMITS]: getLimitsEmptyFormDataProps(true),
        [FieldConstants.RATIO_TAP_CHANGER]: getRatioTapChangerEmptyFormData(true),
        [FieldConstants.PHASE_TAP_CHANGER]: getPhaseTapChangerEmptyFormData(true),
        AdditionalProperties: [],
    };

export const twoWindingsTransformerModificationDtoToForm = (
    twtDto: TwoWindingsTransformerModificationDto,
    includePreviousValues = true
): TwoWindingsTransformerModificationFormData => {
    const ratioTap = twtDto?.ratioTapChanger;
    const phaseTap = twtDto?.phaseTapChanger;
    return {
        equipmentName: twtDto.equipmentName?.value,
        equipmentID: twtDto.equipmentId,
        connectivity: {
            connectivity1: getConnectivityFormDataProps({
                voltageLevelId: twtDto?.voltageLevelId1?.value ?? null,
                busbarSectionId: twtDto?.busOrBusbarSectionId1?.value ?? null,
                connectionName: twtDto?.connectionName1?.value ?? '',
                connectionDirection: twtDto?.connectionDirection1?.value ?? null,
                connectionPosition: twtDto?.connectionPosition1?.value ?? null,
                terminalConnected: twtDto?.terminal1Connected?.value ?? null,
                isEquipmentModification: true,
            }),
            connectivity2: getConnectivityFormDataProps({
                voltageLevelId: twtDto?.voltageLevelId2?.value ?? null,
                busbarSectionId: twtDto?.busOrBusbarSectionId2?.value ?? null,
                connectionName: twtDto?.connectionName2?.value ?? '',
                connectionDirection: twtDto?.connectionDirection2?.value ?? null,
                connectionPosition: twtDto?.connectionPosition2?.value ?? null,
                terminalConnected: twtDto?.terminal2Connected?.value ?? null,
                isEquipmentModification: true,
            }),
        },
        characteristics: {
            r: twtDto.r?.value ?? null,
            x: twtDto.x?.value ?? null,
            g: convertInputValue(FieldType.G, twtDto.g?.value),
            b: convertInputValue(FieldType.B, twtDto.b?.value),
            ratedU1: twtDto.ratedU1?.value ?? null,
            ratedU2: twtDto.ratedU2?.value ?? null,
            ratedS: twtDto.ratedS?.value ?? null,
        },
        ...getPropertiesFromModification(twtDto?.properties, includePreviousValues),
        stateEstimation: getBranchActiveReactivePowerEditDataProperties(twtDto),
        toBeEstimated: {
            ratioTapChangerStatus: twtDto.ratioTapChangerToBeEstimated?.value ?? null,
            phaseTapChangerStatus: twtDto.phaseTapChangerToBeEstimated?.value ?? null,
        },
        ...getAllLimitsFormData(
            formatOpLimitGroupsToFormInfos(twtDto.operationalLimitsGroups),
            twtDto.selectedOperationalLimitsGroupId1?.value ?? null,
            twtDto.selectedOperationalLimitsGroupId2?.value ?? null,
            twtDto.enableOLGModification
        ),
        ...getRatioTapChangerFormData({
            enabled: ratioTap?.enabled?.value,
            hasLoadTapChangingCapabilities: ratioTap?.hasLoadTapChangingCapabilities?.value ?? null,
            regulationMode: computeRatioTapChangerRegulationMode(ratioTap),
            regulationType: ratioTap?.regulationType?.value,
            regulationSide: ratioTap?.regulationSide?.value ?? null,
            targetV: ratioTap?.targetV?.value,
            targetDeadband: ratioTap?.targetDeadband?.value,
            lowTapPosition: ratioTap?.lowTapPosition?.value,
            highTapPosition: computeHighTapPosition(ratioTap?.steps ?? []),
            tapPosition: ratioTap?.tapPosition?.value,
            steps: addSelectedFieldToRows(ratioTap?.steps ?? []),
            equipmentId: ratioTap?.terminalRefConnectableId?.value,
            equipmentType: ratioTap?.terminalRefConnectableType?.value,
            voltageLevelId: ratioTap?.terminalRefConnectableVlId?.value,
        }),
        ...getPhaseTapChangerFormData({
            enabled: phaseTap?.enabled?.value,
            regulationMode: phaseTap?.isRegulating?.value
                ? phaseTap?.regulationMode?.value
                : PHASE_REGULATION_MODES.OFF.id,
            regulationType: phaseTap?.regulationType?.value,
            regulationSide: phaseTap?.regulationSide?.value ?? null,
            currentLimiterRegulatingValue:
                phaseTap?.regulationMode?.value === PHASE_REGULATION_MODES.CURRENT_LIMITER.id
                    ? phaseTap?.regulationValue?.value
                    : undefined,
            flowSetpointRegulatingValue:
                phaseTap?.regulationMode?.value === PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id
                    ? phaseTap?.regulationValue?.value
                    : undefined,
            targetDeadband: phaseTap?.targetDeadband?.value,
            lowTapPosition: phaseTap?.lowTapPosition?.value,
            highTapPosition: computeHighTapPosition(phaseTap?.steps ?? []),
            tapPosition: phaseTap?.tapPosition?.value,
            steps: addSelectedFieldToRows(phaseTap?.steps ?? []),
            equipmentID: phaseTap?.terminalRefConnectableId?.value,
            equipmentType: phaseTap?.terminalRefConnectableType?.value,
            voltageLevelId: phaseTap?.terminalRefConnectableVlId?.value,
        }),
    };
};

export const twoWindingsTransformerModificationFormToDto = (
    twtForm: TwoWindingsTransformerModificationFormData,
    editData: TwoWindingsTransformerModificationDto | undefined,
    intl: IntlShape,
    twtToModify: TwoWindingsTransformerMapInfos | null,
    isNodeBuilt: boolean = false
): TwoWindingsTransformerModificationDto => {
    const connectivity1 = twtForm.connectivity?.connectivity1;
    const connectivity2 = twtForm.connectivity?.connectivity2;
    const { characteristics, limits } = twtForm;
    const enableOlg = Boolean(limits.enableOLGModification);

    return {
        type: ModificationType.TWO_WINDINGS_TRANSFORMER_MODIFICATION,
        equipmentId: twtForm.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(twtForm.equipmentName)),
        properties: toModificationProperties(twtForm),
        r: toModificationOperation(characteristics?.r),
        x: toModificationOperation(characteristics?.x),
        operationalLimitsGroupsModificationType: enableOlg ? OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE.REPLACE : null,
        enableOLGModification: enableOlg,
        operationalLimitsGroups: enableOlg
            ? addModificationTypeToOpLimitsGroups(
                  (limits.operationalLimitsGroups as OperationalLimitsGroupFormSchema[]) ?? []
              )
            : [],
        selectedOperationalLimitsGroupId1: addOperationTypeToSelectedOpLG(
            limits?.selectedOperationalLimitsGroupId1,
            intl.formatMessage({
                id: 'None',
            })
        ),
        selectedOperationalLimitsGroupId2: addOperationTypeToSelectedOpLG(
            limits?.selectedOperationalLimitsGroupId2,
            intl.formatMessage({
                id: 'None',
            })
        ),
        voltageLevelId1: toModificationOperation(connectivity1?.voltageLevel?.id),
        voltageLevelId2: toModificationOperation(connectivity2?.voltageLevel?.id),
        busOrBusbarSectionId1: toModificationOperation(connectivity1?.busOrBusbarSection?.id),
        busOrBusbarSectionId2: toModificationOperation(connectivity2?.busOrBusbarSection?.id),
        connectionName1: toModificationOperation(sanitizeString(connectivity1?.connectionName)),
        connectionName2: toModificationOperation(sanitizeString(connectivity2?.connectionName)),
        connectionDirection1: toModificationOperation(connectivity1?.connectionDirection),
        connectionDirection2: toModificationOperation(connectivity2?.connectionDirection),
        connectionPosition1: toModificationOperation(connectivity1?.connectionPosition),
        connectionPosition2: toModificationOperation(connectivity2?.connectionPosition),
        terminal1Connected: toModificationOperation(connectivity1?.terminalConnected),
        terminal2Connected: toModificationOperation(connectivity2?.terminalConnected),
        p1MeasurementValue: toModificationOperation(twtForm.stateEstimation?.measurementP1?.value),
        p1MeasurementValidity: toModificationOperation(twtForm.stateEstimation?.measurementP1?.validity),
        q1MeasurementValue: toModificationOperation(twtForm.stateEstimation?.measurementQ1?.value),
        q1MeasurementValidity: toModificationOperation(twtForm.stateEstimation?.measurementQ1?.validity),
        p2MeasurementValue: toModificationOperation(twtForm.stateEstimation?.measurementP2?.value),
        p2MeasurementValidity: toModificationOperation(twtForm.stateEstimation?.measurementP2?.validity),
        q2MeasurementValue: toModificationOperation(twtForm.stateEstimation?.measurementQ2?.value),
        q2MeasurementValidity: toModificationOperation(twtForm.stateEstimation?.measurementQ2?.validity),
        g: toModificationOperation(convertOutputValue(FieldType.G, characteristics?.g)),
        b: toModificationOperation(convertOutputValue(FieldType.B, characteristics?.b)),
        ratedS: toModificationOperation(characteristics?.ratedS),
        ratedU1: toModificationOperation(characteristics?.ratedU1),
        ratedU2: toModificationOperation(characteristics?.ratedU2),
        ratioTapChanger: computeRatioTapDto(twtForm.ratioTapChanger, editData, twtToModify, isNodeBuilt),
        phaseTapChanger: computePhaseTapDto(twtForm.phaseTapChanger, editData, twtToModify, isNodeBuilt),
        ratioTapChangerToBeEstimated: toModificationOperation(twtForm?.toBeEstimated?.ratioTapChangerStatus),
        phaseTapChangerToBeEstimated: toModificationOperation(twtForm?.toBeEstimated?.phaseTapChangerStatus),
    };
};
