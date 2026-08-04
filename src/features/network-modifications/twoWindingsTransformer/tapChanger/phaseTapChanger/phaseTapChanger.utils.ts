/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, array, bool, object, number, ref, string } from 'yup';
import {
    TapChangerMapInfos,
    TapChangerStep,
    TwoWindingsTransformerMapInfos,
} from '../../common/twoWindingsTransformer.types';
import { getRegulatingTerminalEmptyFormData, getRegulatingTerminalFormData, REGULATION_TYPES } from '../../../common';
import {
    areArrayElementsUnique,
    areNumbersOrdered,
    DeepNullable,
    FieldConstants,
    PHASE_REGULATION_MODES,
    REGULATION_SIDES,
} from '../../../../../utils';

const getRegulatingTerminalPhaseTapChangerValidationSchema = () => ({
    [FieldConstants.VOLTAGE_LEVEL]: object()
        .nullable()
        .shape({
            [FieldConstants.ID]: string(),
            [FieldConstants.NAME]: string(),
            [FieldConstants.SUBSTATION_ID]: string(),
            [FieldConstants.NOMINAL_VOLTAGE]: string(),
            [FieldConstants.TOPOLOGY_KIND]: string().nullable(),
        })
        .when([FieldConstants.ENABLED, FieldConstants.REGULATION_TYPE], {
            is: (enabled: boolean, regulationType: string) => enabled && regulationType === REGULATION_TYPES.DISTANT.id,
            then: (schema) => schema.required(),
        }),
    [FieldConstants.EQUIPMENT]: object()
        .nullable()
        .shape({
            [FieldConstants.ID]: string(),
            [FieldConstants.NAME]: string().nullable(),
            [FieldConstants.TYPE]: string(),
        })
        .when([FieldConstants.ENABLED, FieldConstants.REGULATION_TYPE], {
            is: (enabled: boolean, regulationType: string) => enabled && regulationType === REGULATION_TYPES.DISTANT.id,
            then: (schema) => schema.required(),
        }),
});

export const getPhaseTapChangerValidationSchemaProps = (isModification = false) =>
    object().shape({
        [FieldConstants.ENABLED]: bool().required(),
        [FieldConstants.REGULATION_MODE]: string()
            .nullable()
            .when([FieldConstants.ENABLED], {
                is: true,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.REGULATION_TYPE]: string()
            .nullable()
            .when([FieldConstants.ENABLED, FieldConstants.REGULATION_MODE], {
                is: (enabled: boolean, regulationMode: string) =>
                    enabled && regulationMode !== PHASE_REGULATION_MODES.OFF.id,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.REGULATION_SIDE]: string()
            .nullable()
            .when([FieldConstants.ENABLED, FieldConstants.REGULATION_TYPE], {
                is: (enabled: boolean, regulationType: string) =>
                    enabled && regulationType === REGULATION_TYPES.LOCAL.id,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.CURRENT_LIMITER_REGULATING_VALUE]: number()
            .nullable()
            .when([FieldConstants.ENABLED, FieldConstants.REGULATION_MODE], {
                is: (enabled: boolean, regulationMode: string) =>
                    enabled && regulationMode === PHASE_REGULATION_MODES.CURRENT_LIMITER.id,
                then: (schema) => schema.positive('CurrentLimiterMustBeGreaterThanZero').required(),
            }),
        [FieldConstants.FLOW_SET_POINT_REGULATING_VALUE]: number()
            .nullable()
            .when([FieldConstants.ENABLED, FieldConstants.REGULATION_MODE], {
                is: (enabled: boolean, regulationMode: string) =>
                    enabled && regulationMode === PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.TARGET_DEADBAND]: number().nullable().min(0, 'TargetDeadbandMustBeGreaterOrEqualToZero'),
        [FieldConstants.LOW_TAP_POSITION]: number()
            .nullable()
            .when(FieldConstants.ENABLED, {
                is: (enabled: boolean) => enabled && !isModification,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.HIGH_TAP_POSITION]: number().nullable(),
        [FieldConstants.TAP_POSITION]: number()
            .nullable()
            .when(FieldConstants.ENABLED, {
                is: (enabled: boolean) => enabled && !isModification,
                then: (schema) =>
                    schema
                        .required()
                        .min(ref(FieldConstants.LOW_TAP_POSITION), 'TapPositionMustBeBetweenLowAndHighTapPositionValue')
                        .max(
                            ref(FieldConstants.HIGH_TAP_POSITION),
                            'TapPositionMustBeBetweenLowAndHighTapPositionValue'
                        ),
            }),
        [FieldConstants.STEPS]: array()
            .of(
                object().shape({
                    [FieldConstants.STEPS_TAP]: number().required(),
                    [FieldConstants.STEPS_RESISTANCE]: number(),
                    [FieldConstants.STEPS_REACTANCE]: number(),
                    [FieldConstants.STEPS_CONDUCTANCE]: number(),
                    [FieldConstants.STEPS_SUSCEPTANCE]: number(),
                    [FieldConstants.STEPS_RATIO]: number(),
                    [FieldConstants.STEPS_ALPHA]: number(),
                })
            )
            .when(FieldConstants.ENABLED, {
                is: (enabled: boolean) => enabled && !isModification,
                then: (schema) => schema.min(1, 'GeneratePhaseTapRowsError'),
            })
            .test('distinctOrderedAlpha', 'PhaseShiftValuesError', (array) => {
                const alphaArray = (array ?? []).map((step) => step[FieldConstants.STEPS_ALPHA]);
                return areNumbersOrdered(alphaArray) && areArrayElementsUnique(alphaArray);
            }),
        ...getRegulatingTerminalPhaseTapChangerValidationSchema(),
    });

export type PhaseTapChangerFormSchema = InferType<ReturnType<typeof getPhaseTapChangerValidationSchemaProps>>;

/* TODO DBR
export type PhaseTapChangerFormSchema = InferType<
    ReturnType<typeof phaseTapChangerValidationSchema>[typeof FieldConstants.PHASE_TAP_CHANGER]
>;

export const getPhaseTapChangerValidationSchema = (isModification = false, id = FieldConstants.PHASE_TAP_CHANGER) => {
    return phaseTapChangerValidationSchema(isModification, id);
};
*/

export const getPhaseTapChangerEmptyFormData = (isModification = false): DeepNullable<PhaseTapChangerFormSchema> => {
    return {
        [FieldConstants.ENABLED]: false,
        [FieldConstants.REGULATION_MODE]: null,
        [FieldConstants.REGULATION_TYPE]: null,
        [FieldConstants.REGULATION_SIDE]: isModification ? null : REGULATION_SIDES.SIDE1.id,
        [FieldConstants.CURRENT_LIMITER_REGULATING_VALUE]: null,
        [FieldConstants.FLOW_SET_POINT_REGULATING_VALUE]: null,
        [FieldConstants.TARGET_DEADBAND]: null,
        [FieldConstants.LOW_TAP_POSITION]: null,
        [FieldConstants.HIGH_TAP_POSITION]: null,
        [FieldConstants.TAP_POSITION]: null,
        [FieldConstants.STEPS]: [] as TapChangerStep[],
        ...getRegulatingTerminalEmptyFormData(),
    };
};

interface PhaseTapChangerFormDataInput {
    [FieldConstants.ENABLED]?: boolean;
    [FieldConstants.REGULATION_MODE]?: string | null;
    [FieldConstants.REGULATION_TYPE]?: string | null;
    [FieldConstants.REGULATION_SIDE]?: string | null;
    [FieldConstants.CURRENT_LIMITER_REGULATING_VALUE]?: number | null;
    flowSetpointRegulatingValue?: number | null;
    [FieldConstants.TARGET_DEADBAND]?: number | null;
    [FieldConstants.LOW_TAP_POSITION]?: number | null;
    [FieldConstants.HIGH_TAP_POSITION]?: number | null;
    [FieldConstants.TAP_POSITION]?: number | null;
    [FieldConstants.STEPS]?: TapChangerStep[];
    [FieldConstants.VOLTAGE_LEVEL_ID]?: string;
    [FieldConstants.EQUIPMENT_ID]?: string;
    [FieldConstants.EQUIPMENT_TYPE_FIELD]?: string;
}

export const getPhaseTapChangerFormData = (
    {
        enabled = false,
        regulationMode = null,
        regulationType = null,
        regulationSide = REGULATION_SIDES.SIDE1.id,
        currentLimiterRegulatingValue = null,
        flowSetpointRegulatingValue = null,
        targetDeadband = null,
        lowTapPosition = null,
        highTapPosition = null,
        tapPosition = null,
        steps = [],
        voltageLevelId,
        equipmentID,
        equipmentType,
    }: PhaseTapChangerFormDataInput,
    id: typeof FieldConstants.PHASE_TAP_CHANGER = FieldConstants.PHASE_TAP_CHANGER
) => ({
    [id]: {
        [FieldConstants.ENABLED]: enabled,
        [FieldConstants.REGULATION_MODE]: regulationMode,
        [FieldConstants.REGULATION_TYPE]: regulationType,
        [FieldConstants.REGULATION_SIDE]: regulationSide,
        [FieldConstants.CURRENT_LIMITER_REGULATING_VALUE]: currentLimiterRegulatingValue,
        [FieldConstants.FLOW_SET_POINT_REGULATING_VALUE]: flowSetpointRegulatingValue,
        [FieldConstants.TARGET_DEADBAND]: targetDeadband,
        [FieldConstants.LOW_TAP_POSITION]: lowTapPosition,
        [FieldConstants.HIGH_TAP_POSITION]: highTapPosition,
        [FieldConstants.TAP_POSITION]: tapPosition,
        [FieldConstants.STEPS]: steps,
        ...getRegulatingTerminalFormData({
            [FieldConstants.EQUIPMENT_ID]: equipmentID,
            [FieldConstants.EQUIPMENT_TYPE_FIELD]: equipmentType,
            [FieldConstants.VOLTAGE_LEVEL_ID]: voltageLevelId,
        }),
    },
});

type PhaseRegulationMode = (typeof PHASE_REGULATION_MODES)[keyof typeof PHASE_REGULATION_MODES] | undefined;

export const getComputedPhaseTapChangerRegulationMode = (
    phaseTapChangerFormValues?: TapChangerMapInfos
): PhaseRegulationMode => {
    if (
        phaseTapChangerFormValues?.[FieldConstants.REGULATION_MODE] === PHASE_REGULATION_MODES.OFF.id ||
        phaseTapChangerFormValues?.[FieldConstants.REGULATING] === false
    ) {
        return PHASE_REGULATION_MODES.OFF;
    }
    if (
        phaseTapChangerFormValues?.[FieldConstants.REGULATION_MODE] === PHASE_REGULATION_MODES.CURRENT_LIMITER.id &&
        phaseTapChangerFormValues?.[FieldConstants.REGULATING] === true
    ) {
        return PHASE_REGULATION_MODES.CURRENT_LIMITER;
    }
    if (
        phaseTapChangerFormValues?.[FieldConstants.REGULATION_MODE] ===
            PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id &&
        phaseTapChangerFormValues?.[FieldConstants.REGULATING] === true
    ) {
        return PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL;
    }
    return undefined;
};

export const getPhaseTapRegulationSideId = (twt?: TwoWindingsTransformerMapInfos): string | null => {
    const phaseTapChangerValues = twt?.phaseTapChanger;
    if (!phaseTapChangerValues || !twt) {
        return null;
    }
    if (phaseTapChangerValues?.regulatingTerminalConnectableId === twt?.id) {
        return phaseTapChangerValues?.regulatingTerminalVlId === twt?.voltageLevelId1
            ? REGULATION_SIDES.SIDE1.id
            : REGULATION_SIDES.SIDE2.id;
    }
    return null;
};

type RegulationType = (typeof REGULATION_TYPES)[keyof typeof REGULATION_TYPES] | null;

export const getComputedPhaseRegulationType = (twt?: TwoWindingsTransformerMapInfos): RegulationType => {
    if (!twt?.[FieldConstants.PHASE_TAP_CHANGER]?.regulatingTerminalConnectableId) {
        return null;
    }
    if (twt?.[FieldConstants.PHASE_TAP_CHANGER]?.regulatingTerminalConnectableId !== twt?.id) {
        return REGULATION_TYPES.DISTANT;
    }
    return REGULATION_TYPES.LOCAL;
};

export const getComputedPhaseRegulationTypeId = (twt?: TwoWindingsTransformerMapInfos): string | null => {
    const regulationType = getComputedPhaseRegulationType(twt);
    return regulationType?.id ?? null;
};

export const getComputedPreviousPhaseRegulationType = (
    previousValues?: TwoWindingsTransformerMapInfos
): string | null => {
    const previousRegulationType = getComputedPhaseRegulationType(previousValues);
    return previousRegulationType?.id ?? null;
};
