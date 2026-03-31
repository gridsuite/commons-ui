/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType } from 'yup';
import {
    FieldConstants,
    EquipmentType,
    YUP_REQUIRED,
    yupConfig as yup,
    ModificationType,
    DeepNullable,
} from '../../../../utils';
import type { ByFilterDeletionDto } from './byFilterDeletion.types';

export const EQUIPMENT_TYPE_ORDER = [
    EquipmentType.SUBSTATION,
    EquipmentType.VOLTAGE_LEVEL,
    EquipmentType.LINE,
    EquipmentType.TWO_WINDINGS_TRANSFORMER,
    EquipmentType.THREE_WINDINGS_TRANSFORMER,
    EquipmentType.HVDC_LINE,
    EquipmentType.GENERATOR,
    EquipmentType.BATTERY,
    EquipmentType.LOAD,
    EquipmentType.SHUNT_COMPENSATOR,
    EquipmentType.DANGLING_LINE,
    EquipmentType.STATIC_VAR_COMPENSATOR,
];

export const byFilterDeletionFormSchema = yup
    .object()
    .shape({
        [FieldConstants.TYPE]: yup.mixed<EquipmentType>().oneOf(EQUIPMENT_TYPE_ORDER).required(YUP_REQUIRED),
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
    equipmentType: formData[FieldConstants.TYPE],
    filters: formData[FieldConstants.FILTERS],
});

export const emptyFormData: DeepNullable<ByFilterDeletionFormData> = {
    [FieldConstants.TYPE]: null,
    [FieldConstants.FILTERS]: [],
};
