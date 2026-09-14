/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { InferType, array, bool, mixed, number, object, ref, string } from 'yup';
import { TapChangerStep, TwoWindingsTransformerMapInfos } from '../../common/twoWindingsTransformer.types';
import { FieldConstants } from '../../../../../utils/constants/fieldConstants';
import { REGULATION_TYPES } from '../../../common/voltageRegulation/voltageRegulation.utils';
import {
    areArrayElementsUnique,
    areNumbersOrdered,
    DeepNullable,
    RATIO_REGULATION_MODES,
    REGULATION_SIDES,
    TARGET_DEADBAND_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
} from '../../../../../utils';
import {
    getRegulatingTerminalEmptyFormData,
    getRegulatingTerminalFormData,
} from '../../../common/regulatingTerminal/regulatingTerminal.utils';

const getRegulatingTerminalRatioTapChangerValidationSchema = () => ({
    [FieldConstants.VOLTAGE_LEVEL]: object()
        .nullable()
        .shape({
            [FieldConstants.ID]: string(),
            [FieldConstants.NAME]: string(),
            [FieldConstants.SUBSTATION_ID]: string(),
            [FieldConstants.NOMINAL_VOLTAGE]: string(),
            [FieldConstants.TOPOLOGY_KIND]: string().nullable(),
        })
        .when([FieldConstants.ENABLED, FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES, FieldConstants.REGULATION_TYPE], {
            is: (enabled: boolean, hasLoadTapChangingCapabilities: boolean, regulationType: string) =>
                enabled && hasLoadTapChangingCapabilities && regulationType === REGULATION_TYPES.DISTANT.id,
            then: (schema) => schema.required(),
        }),
    [FieldConstants.EQUIPMENT]: object()
        .nullable()
        .shape({
            [FieldConstants.ID]: string(),
            [FieldConstants.NAME]: string().nullable(),
            [FieldConstants.TYPE]: string(),
        })
        .when([FieldConstants.ENABLED, FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES, FieldConstants.REGULATION_TYPE], {
            is: (enabled: boolean, hasLoadTapChangingCapabilities: boolean, regulationType: string) =>
                enabled && hasLoadTapChangingCapabilities && regulationType === REGULATION_TYPES.DISTANT.id,
            then: (schema) => schema.required(),
        }),
});

export const getRatioTapChangerValidationSchemaProps = (isModification = false) =>
    object().shape({
        [FieldConstants.ENABLED]: bool().required(),
        [FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES]: isModification
            ? bool().nullable()
            : bool().nullable().required(),
        [FieldConstants.REGULATION_MODE]: string()
            .nullable()
            .when([FieldConstants.ENABLED, FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES], {
                is: (enabled: boolean, hasLoadTapChangingCapabilities: boolean) =>
                    enabled && hasLoadTapChangingCapabilities,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.REGULATION_TYPE]: string()
            .nullable()
            .when(
                [FieldConstants.ENABLED, FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES, FieldConstants.REGULATION_MODE],
                {
                    is: (enabled: boolean, hasLoadTapChangingCapabilities: boolean, regulationMode: string) =>
                        enabled &&
                        hasLoadTapChangingCapabilities &&
                        regulationMode === RATIO_REGULATION_MODES.VOLTAGE_REGULATION.id,
                    then: (schema) => schema.required(),
                }
            ),
        [FieldConstants.REGULATION_SIDE]: string()
            .nullable()
            .when(
                [FieldConstants.ENABLED, FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES, FieldConstants.REGULATION_TYPE],
                {
                    is: (enabled: boolean, hasLoadTapChangingCapabilities: boolean, regulationType: string) =>
                        enabled && hasLoadTapChangingCapabilities && regulationType === REGULATION_TYPES.LOCAL.id,
                    then: (schema) => schema.required(),
                }
            ),
        [FieldConstants.TARGET_V]: mixed()
            .nullable()
            .when([FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES], {
                is: true,
                then: () => number().nullable().positive('TargetVoltageMustBeGreaterThanZero'),
            })
            .when([FieldConstants.REGULATION_MODE, FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES], {
                is: (regulationMode: string, hasLoadTapChangingCapabilities: boolean) => {
                    return (
                        hasLoadTapChangingCapabilities &&
                        regulationMode === RATIO_REGULATION_MODES.VOLTAGE_REGULATION.id
                    );
                },
                then: (schema) => schema.required(),
            }),
        [FieldConstants.TARGET_DEADBAND]: mixed()
            .nullable()
            .when(FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES, {
                is: true,
                then: () => number().nullable().min(0, TARGET_DEADBAND_MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
            }),
        [FieldConstants.LOW_TAP_POSITION]: number()
            .nullable()
            .when(FieldConstants.ENABLED, {
                is: (enabled: boolean) => enabled && !isModification,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.HIGH_TAP_POSITION]: number()
            .nullable()
            .when(FieldConstants.ENABLED, {
                is: (enabled: boolean) => enabled && !isModification,
                then: (schema) => schema.required(),
            }),
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
                })
            )
            .when(FieldConstants.ENABLED, {
                is: true,
                then: (schema) => schema.min(1, 'GenerateRatioTapRowsError'),
            })
            .test('distinctOrderedRatio', 'RatioValuesError', (stepsArray) => {
                const ratioArray = (stepsArray ?? []).map((step) => step[FieldConstants.STEPS_RATIO]);
                return areNumbersOrdered(ratioArray) && areArrayElementsUnique(ratioArray);
            }),
        ...getRegulatingTerminalRatioTapChangerValidationSchema(),
    });

export type RatioTapChangerFormSchema = InferType<ReturnType<typeof getRatioTapChangerValidationSchemaProps>>;

export const getRatioTapChangerEmptyFormData = (isModification = false): DeepNullable<RatioTapChangerFormSchema> => {
    return {
        [FieldConstants.ENABLED]: false,
        [FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES]: isModification ? null : false,
        [FieldConstants.REGULATION_MODE]: null,
        [FieldConstants.REGULATION_TYPE]: null,
        [FieldConstants.REGULATION_SIDE]: isModification ? null : REGULATION_SIDES.SIDE1.id,
        [FieldConstants.TARGET_V]: null,
        [FieldConstants.TARGET_DEADBAND]: null,
        [FieldConstants.LOW_TAP_POSITION]: null,
        [FieldConstants.HIGH_TAP_POSITION]: null,
        [FieldConstants.TAP_POSITION]: null,
        [FieldConstants.STEPS]: [],
        ...getRegulatingTerminalEmptyFormData(),
    };
};

interface RatioTapChangerFormParams {
    enabled?: boolean;
    hasLoadTapChangingCapabilities?: boolean | null;
    regulationMode?: string | null;
    regulationType?: string | null;
    regulationSide?: string | null;
    targetV?: number | null;
    targetDeadband?: number | null;
    lowTapPosition?: number | null;
    highTapPosition?: number | null;
    tapPosition?: number | null;
    steps?: TapChangerStep[];
    voltageLevelId?: string;
    equipmentId?: string;
    equipmentType?: string;
}

export const getRatioTapChangerFormData = (
    {
        enabled = false,
        hasLoadTapChangingCapabilities = false,
        regulationMode = null,
        regulationType = null,
        regulationSide = REGULATION_SIDES.SIDE1.id,
        targetV = null,
        targetDeadband = null,
        lowTapPosition = null,
        highTapPosition = null,
        tapPosition = null,
        steps = [],
        voltageLevelId,
        equipmentId,
        equipmentType,
    }: RatioTapChangerFormParams,
    id: typeof FieldConstants.RATIO_TAP_CHANGER = FieldConstants.RATIO_TAP_CHANGER
) => ({
    [id]: {
        [FieldConstants.ENABLED]: enabled,
        [FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES]: hasLoadTapChangingCapabilities,
        [FieldConstants.REGULATION_MODE]: regulationMode,
        [FieldConstants.REGULATION_TYPE]: regulationType,
        [FieldConstants.REGULATION_SIDE]: regulationSide,
        [FieldConstants.TARGET_V]: targetV,
        [FieldConstants.TARGET_DEADBAND]: targetDeadband,
        [FieldConstants.LOW_TAP_POSITION]: lowTapPosition,
        [FieldConstants.HIGH_TAP_POSITION]: highTapPosition,
        [FieldConstants.TAP_POSITION]: tapPosition,
        [FieldConstants.STEPS]: steps,
        ...getRegulatingTerminalFormData({
            equipmentID: equipmentId,
            voltageLevelId,
            equipmentType,
        }),
    },
});

export const getComputedRegulationType = (twt: TwoWindingsTransformerMapInfos) => {
    if (
        !twt?.[FieldConstants.RATIO_TAP_CHANGER]?.[FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES] ||
        !twt?.[FieldConstants.RATIO_TAP_CHANGER]?.regulatingTerminalConnectableId
    ) {
        return null;
    }
    if (twt?.[FieldConstants.RATIO_TAP_CHANGER]?.regulatingTerminalConnectableId !== twt?.[FieldConstants.ID]) {
        return REGULATION_TYPES.DISTANT;
    }
    return REGULATION_TYPES.LOCAL;
};

export const getComputedRegulationTypeId = (twt: TwoWindingsTransformerMapInfos) => {
    const regulationType = getComputedRegulationType(twt);
    return regulationType?.id || null;
};

export const getComputedRegulationMode = (twt: TwoWindingsTransformerMapInfos) => {
    const ratioTapChangerValues = twt?.ratioTapChanger;
    if (!ratioTapChangerValues) {
        return null;
    }
    if (ratioTapChangerValues[FieldConstants.REGULATING]) {
        return RATIO_REGULATION_MODES.VOLTAGE_REGULATION;
    }
    return RATIO_REGULATION_MODES.FIXED_RATIO;
};

export const getInitialTwtRatioRegulationModeId = (twt: TwoWindingsTransformerMapInfos) => {
    // if onLoadTapChangingCapabilities is set to false or undefined, we set the regulation mode to null
    if (!twt?.ratioTapChanger?.hasLoadTapChangingCapabilities) {
        return null;
    }
    // otherwise, we compute it
    const computedRegulationMode = getComputedRegulationMode(twt);
    return computedRegulationMode?.id || null;
};

export const getComputedRegulationModeId = (twt: TwoWindingsTransformerMapInfos) => {
    return getComputedRegulationMode(twt)?.id || null;
};

export const getComputedPreviousRatioRegulationType = (previousValues: TwoWindingsTransformerMapInfos) => {
    const previousRegulationType = getComputedRegulationType(previousValues);
    return previousRegulationType?.id || null;
};

export const getComputedTapSide = (twt: TwoWindingsTransformerMapInfos) => {
    const ratioTapChangerValues = twt?.ratioTapChanger;
    if (!ratioTapChangerValues || !twt) {
        return null;
    }
    if (ratioTapChangerValues?.regulatingTerminalConnectableId === twt?.[FieldConstants.ID]) {
        return ratioTapChangerValues?.regulatingTerminalVlId === twt?.voltageLevelId1
            ? REGULATION_SIDES.SIDE1
            : REGULATION_SIDES.SIDE2;
    }
    return null;
};

export const getComputedTapSideId = (twt: TwoWindingsTransformerMapInfos) => {
    return getComputedTapSide(twt)?.id || null;
};

export const computeRatioTapChangerRegulating = (ratioTapChangerFormValues: RatioTapChangerFormSchema) => {
    return ratioTapChangerFormValues?.regulationMode === RATIO_REGULATION_MODES.VOLTAGE_REGULATION.id;
};
