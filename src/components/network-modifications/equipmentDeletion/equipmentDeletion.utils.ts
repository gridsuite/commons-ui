/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { mixed, object, string, type InferType } from 'yup';
import type { UUID } from 'node:crypto';
import { EquipmentType } from '../../../utils/types/equipmentType';
import { getHvdcLccDeletionSchema } from './hvdcLccDeletion';
import { DeepNullable, FieldConstants, ModificationType } from '../../../utils';
import type { EquipmentDeletionDto } from './equipmentDeletion.types';

export const equipmentDeletionFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().nullable().required(),
        [FieldConstants.TYPE]: mixed<EquipmentType>().oneOf(Object.values(EquipmentType)).nullable().required(),
        [FieldConstants.DELETION_SPECIFIC_DATA]: getHvdcLccDeletionSchema(),
    })
    .required();

export type EquipmentDeletionFormData = InferType<typeof equipmentDeletionFormSchema>;

export const equipmentDeletionEmptyFormData: DeepNullable<EquipmentDeletionFormData> = {
    equipmentID: '',
    type: null,
    equipmentInfos: null,
};

export const equipmentDeletionFormToDto = (form: EquipmentDeletionFormData): EquipmentDeletionDto => {
    return {
        type: ModificationType.EQUIPMENT_DELETION,
        equipmentId: form.equipmentID as UUID,
        equipmentType: form.type,
        equipmentInfos: form.equipmentInfos ?? undefined,
    };
};

export const newEquipmentDeletionDto = (equipmentType: EquipmentType, equipmentId: UUID): EquipmentDeletionDto => {
    return {
        type: ModificationType.EQUIPMENT_DELETION,
        equipmentId,
        equipmentType,
        equipmentInfos: undefined,
    };
};

export const equipmentDeletionDtoToForm = (dto: EquipmentDeletionDto): EquipmentDeletionFormData => {
    return {
        equipmentID: dto.equipmentId,
        type: dto.equipmentType,
        equipmentInfos: dto.equipmentInfos,
    };
};
