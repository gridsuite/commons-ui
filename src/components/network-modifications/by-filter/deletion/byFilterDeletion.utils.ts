/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType } from 'yup';
import { FieldConstants, EquipmentType, YUP_REQUIRED, yupConfig as yup, ModificationType } from '../../../../utils';
import type { ByFilterDeletionDto } from './byFilterDeletion.types';

export const byFilterDeletionFormSchema = yup
    .object()
    .shape({
        [FieldConstants.TYPE]: yup.mixed<EquipmentType>().required(YUP_REQUIRED),
        [FieldConstants.FILTERS]: yup
            .array()
            .of(
                yup.object().shape({
                    [FieldConstants.ID]: yup.string().required(),
                    [FieldConstants.NAME]: yup.string().required(),
                })
            )
            .required()
            .min(1, YUP_REQUIRED),
    })
    .required();

export type ByFilterDeletionFormData = InferType<typeof byFilterDeletionFormSchema>;

export const byFilterDeletionDtoToForm = (dto: ByFilterDeletionDto): ByFilterDeletionFormData => ({
    [FieldConstants.TYPE]: dto.equipmentType,
    [FieldConstants.FILTERS]: dto.filters,
});

export const byFilterDeletionFormToDto = (formData: ByFilterDeletionFormData): ByFilterDeletionDto => ({
    type: ModificationType.BY_FILTER_DELETION,
    equipmentType: formData[FieldConstants.TYPE] as EquipmentType,
    filters: formData[FieldConstants.FILTERS],
});
