/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { EquipmentType, FieldConstants, MODIFICATION_TYPES } from '../../../../../utils';
import {
    EquipmentAttributeModificationDto,
    TopologyVoltageLevelModificationDto,
} from './voltageLevelTopologyModification.types';
import { CURRENT_CONNECTION_STATUS, PREV_CONNECTION_STATUS, SWITCH_ID, TOPOLOGY_MODIFICATION_TABLE } from './constants';
import { getPropertiesFromModification } from '../../../common';

export const voltageLevelTopologyModificationFormSchema = yup.object().shape({
    [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
    [TOPOLOGY_MODIFICATION_TABLE]: yup
        .array()
        .of(
            yup.object().shape({
                [SWITCH_ID]: yup.string(),
                [PREV_CONNECTION_STATUS]: yup.boolean().nullable(), // presents 'open'
                [CURRENT_CONNECTION_STATUS]: yup.boolean().nullable(), // presents 'close'
            })
        )
        .required(),
});

export type VoltageLevelTopologyModificationFormSchemaType = yup.InferType<
    typeof voltageLevelTopologyModificationFormSchema
>;

export const voltageLevelTopologyModificationEmptyFormData = {
    [TOPOLOGY_MODIFICATION_TABLE]: [
        {
            [SWITCH_ID]: '',
            [PREV_CONNECTION_STATUS]: null,
            [CURRENT_CONNECTION_STATUS]: null,
        },
    ],
};

export const voltageLevelTopologyModificationFormToDto = (
    formData: VoltageLevelTopologyModificationFormSchemaType
): TopologyVoltageLevelModificationDto => {
    let equipmentAttributeModificationDto: EquipmentAttributeModificationDto[] = [];
    if (formData[TOPOLOGY_MODIFICATION_TABLE]?.length > 0) {
        equipmentAttributeModificationDto = formData[TOPOLOGY_MODIFICATION_TABLE].filter((item) => {
            return item?.currentConnectionStatus != null;
        }).map((item) => ({
            type: MODIFICATION_TYPES.EQUIPMENT_ATTRIBUTE_MODIFICATION.type,
            equipmentId: item.switchId ?? '',
            equipmentAttributeName: 'open',
            // Note that 'currentConnectionStatus' which presents 'close' should be inverted when submitting open attribute
            equipmentAttributeValue: Boolean(!item.currentConnectionStatus),
            equipmentType: EquipmentType.SWITCH,
        }));
    }
    return {
        type: MODIFICATION_TYPES.VOLTAGE_LEVEL_TOPOLOGY_MODIFICATION.type,
        equipmentId: formData.equipmentID,
        equipmentAttributeModificationList: equipmentAttributeModificationDto,
    };
};

export const voltageLevelTopologyModificationDtoToForm = (
    dto: TopologyVoltageLevelModificationDto,
    includePreviousValues = true
): VoltageLevelTopologyModificationFormSchemaType => {
    return {
        [FieldConstants.EQUIPMENT_ID]: dto.equipmentId,
        [TOPOLOGY_MODIFICATION_TABLE]: dto.equipmentAttributeModificationList.map((item) => ({
            [SWITCH_ID]: item.equipmentId,
            [CURRENT_CONNECTION_STATUS]: Boolean(!item.equipmentAttributeValue),
            [PREV_CONNECTION_STATUS]: null,
        })),
        ...getPropertiesFromModification(dto.properties, includePreviousValues),
    };
};
