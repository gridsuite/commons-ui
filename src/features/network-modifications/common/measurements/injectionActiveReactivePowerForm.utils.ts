/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object } from 'yup';
import {
    getPowerWithValidityEditData,
    getPowerWithValidityEmptyFormData,
    getPowerWithValidityValidationSchema,
} from './powerWithValidity.utils';
import { FieldConstants } from '../../../../utils';
import { InjectionMeasurementsEditData } from './measurement.type';

export function getInjectionActiveReactivePowerEmptyFormDataProperties() {
    return {
        ...getPowerWithValidityEmptyFormData(FieldConstants.MEASUREMENT_P),
        ...getPowerWithValidityEmptyFormData(FieldConstants.MEASUREMENT_Q),
    };
}
export function getInjectionActiveReactivePowerEmptyFormData(id: string) {
    return {
        [id]: {
            ...getInjectionActiveReactivePowerEmptyFormDataProperties(),
        },
    };
}

export const getInjectionActiveReactivePowerValidationSchemaProperties = () =>
    object().shape({
        ...getPowerWithValidityValidationSchema(FieldConstants.MEASUREMENT_P),
        ...getPowerWithValidityValidationSchema(FieldConstants.MEASUREMENT_Q),
    });

export type InjectionActiveReactivePowerFormData = InferType<
    ReturnType<typeof getInjectionActiveReactivePowerValidationSchemaProperties>
>;

export const getInjectionActiveReactivePowerValidationSchema = (id: string) => ({
    [id]: getInjectionActiveReactivePowerValidationSchemaProperties(),
});

export function getInjectionActiveReactivePowerEditDataProperties(injectionData: InjectionMeasurementsEditData) {
    return {
        ...getPowerWithValidityEditData(FieldConstants.MEASUREMENT_P, {
            value: injectionData?.pMeasurementValue?.value,
            validity: injectionData?.pMeasurementValidity?.value,
        }),
        ...getPowerWithValidityEditData(FieldConstants.MEASUREMENT_Q, {
            value: injectionData?.qMeasurementValue?.value,
            validity: injectionData?.qMeasurementValidity?.value,
        }),
    };
}
