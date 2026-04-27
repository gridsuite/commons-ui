/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { number, object, string } from 'yup';
import {
    getReactiveCapabilityCurveValidationSchema,
    getRowEmptyFormData,
} from './reactiveCapabilityCurve/reactiveCapability.utils';
import { ReactiveCapabilityCurvePoints } from './reactiveLimits.type';
import { FieldConstants, YUP_REQUIRED } from '../../../../utils';

export const REACTIVE_LIMIT_TYPES = [
    { id: 'MINMAX', label: 'ReactiveLimitsKindMinMax' },
    { id: 'CURVE', label: 'ReactiveLimitsKindCurve' },
] as const;

export const getReactiveLimitsFormData = ({
    id = FieldConstants.REACTIVE_LIMITS,
    reactiveCapabilityCurveChoice,
    minimumReactivePower,
    maximumReactivePower,
    reactiveCapabilityCurvePoints,
}: {
    id?: string;
    reactiveCapabilityCurveChoice: string;
    minimumReactivePower?: number | null;
    maximumReactivePower?: number | null;
    reactiveCapabilityCurvePoints?: ReactiveCapabilityCurvePoints[] | null;
}) => ({
    [id]: {
        [FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE]: reactiveCapabilityCurveChoice,
        [FieldConstants.MINIMUM_REACTIVE_POWER]: minimumReactivePower ?? null,
        [FieldConstants.MAXIMUM_REACTIVE_POWER]: maximumReactivePower ?? null,
        [FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE]: reactiveCapabilityCurvePoints ?? [
            getRowEmptyFormData(),
            getRowEmptyFormData(),
        ],
    },
});

export const getReactiveLimitsEmptyFormData = (id = FieldConstants.REACTIVE_LIMITS) => ({
    [id]: {
        [FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE]: 'MINMAX',
        [FieldConstants.MINIMUM_REACTIVE_POWER]: null,
        [FieldConstants.MAXIMUM_REACTIVE_POWER]: null,
        [FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE]: [getRowEmptyFormData(), getRowEmptyFormData()],
    },
});

export const getReactiveLimitsValidationSchema = (
    isEquipmentModification = false,
    positiveAndNegativePExist = false // if true, we check that Reactive Capability table have at least one row with negative P and one with positive one
) =>
    object().shape(
        {
            [FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE]: string().nullable().required(YUP_REQUIRED),
            [FieldConstants.MINIMUM_REACTIVE_POWER]: number()
                .nullable()
                .when([FieldConstants.MAXIMUM_REACTIVE_POWER], {
                    is: (maximumReactivePower: number) => !isEquipmentModification && maximumReactivePower != null,
                    then: (schema) => schema.required(YUP_REQUIRED),
                }),
            [FieldConstants.MAXIMUM_REACTIVE_POWER]: number()
                .nullable()
                .when([FieldConstants.MINIMUM_REACTIVE_POWER], {
                    is: (minimumReactivePower: number) => !isEquipmentModification && minimumReactivePower != null,
                    then: (schema) => schema.required(YUP_REQUIRED),
                }),
            ...getReactiveCapabilityCurveValidationSchema(
                FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE,
                positiveAndNegativePExist
            ),
        },
        [FieldConstants.MAXIMUM_REACTIVE_POWER, FieldConstants.MINIMUM_REACTIVE_POWER] as unknown as readonly [
            string,
            string,
        ][]
    );

export const getReactiveLimitsSchema = (
    isEquipmentModification = false,
    positiveAndNegativePExist = false,
    id = FieldConstants.REACTIVE_LIMITS
) => ({
    [id]: getReactiveLimitsValidationSchema(isEquipmentModification, positiveAndNegativePExist),
});
