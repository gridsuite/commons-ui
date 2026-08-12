/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import { DeepNullable, FieldConstants } from '../../../../utils';
import {
    getBranchConnectivityWithPositionEmptyFormDataProps,
    getBranchConnectivityWithPositionSchema,
} from '../../common/connectivity';
import { modificationPropertiesSchema } from '../../common/properties';
import {
    getLimitsEmptyFormDataProps,
    getLimitsValidationSchemaProps,
} from '../../common/currentLimits/limitsPane.utils';
import { getTwtCharacteristicsEmptyFormData, getTwtCharacteristicsValidationSchemaProps } from '../characteristics';
import {
    getPhaseTapChangerEmptyFormData,
    getPhaseTapChangerValidationSchemaProps,
    getRatioTapChangerEmptyFormData,
    getRatioTapChangerValidationSchemaProps,
} from '../tapChanger';
import { getToBeEstimatedValidationSchemaObject, toBeEstimatedEmptyFormData } from './measurements';
import {
    getBranchActiveReactivePowerEmptyFormDataProperties,
    getBranchActiveReactivePowerValidationSchemaObject,
} from '../../common';

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
