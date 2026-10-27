/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { DeepNullable, FieldConstants, ModificationType } from '../../../utils';
import { NetworkReductionDto } from './networkReduction.types';

export const networkReductionFormSchema = yup
    .object()
    .shape({
        [FieldConstants.FILTERS]: yup
            .array()
            .of(
                yup.object().shape({
                    [FieldConstants.ID]: yup.string().required(),
                    [FieldConstants.NAME]: yup.string().required(),
                })
            )
            .required(),
    })
    .required();

export type NetworkReductionFormData = yup.InferType<typeof networkReductionFormSchema>;

export const emptyNetworkReductionFormData: DeepNullable<NetworkReductionFormData> = {
    [FieldConstants.FILTERS]: [],
};

export const networkReductionDtoToForm = (dto: NetworkReductionDto): NetworkReductionFormData => ({
    [FieldConstants.FILTERS]: dto.filters,
});

export const networkReductionFormToDto = (formData: NetworkReductionFormData): NetworkReductionDto => ({
    type: ModificationType.NETWORK_REDUCTION,
    filters: formData[FieldConstants.FILTERS],
});
