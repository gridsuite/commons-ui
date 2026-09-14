/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as yup from 'yup';
import { InferType } from 'yup';
import { FieldConstants, ModificationType } from '../../../../utils';
import { CouplingDeviceCreationDto } from './coupling-device-creation.types';

export const emptyCouplingDeviceCreationFormData = {
    [FieldConstants.EQUIPMENT_ID]: null,
    [FieldConstants.BUS_BAR_SECTION_ID1]: null,
    [FieldConstants.BUS_BAR_SECTION_ID2]: null,
};

export const couplingDeviceCreationFormSchema = yup.object().shape({
    [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
    [FieldConstants.BUS_BAR_SECTION_ID1]: yup.string().nullable().required(),
    [FieldConstants.BUS_BAR_SECTION_ID2]: yup
        .string()
        .nullable()
        .required()
        .notOneOf([yup.ref(FieldConstants.BUS_BAR_SECTION_ID1), null], 'CreateCouplingDeviceIdenticalBusBar'),
});

export type CouplingDeviceCreationFormData = InferType<typeof couplingDeviceCreationFormSchema>;

export const couplingDeviceCreationDtoToForm = (
    couplingDeviceCreation: CouplingDeviceCreationDto
): CouplingDeviceCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: couplingDeviceCreation.voltageLevelId,
        [FieldConstants.BUS_BAR_SECTION_ID1]: couplingDeviceCreation.couplingDeviceInfos.busbarSectionId1,
        [FieldConstants.BUS_BAR_SECTION_ID2]: couplingDeviceCreation.couplingDeviceInfos.busbarSectionId2,
    };
};

export const couplingDeviceCreationFormToDto = (
    couplingDeviceCreation: CouplingDeviceCreationFormData
): CouplingDeviceCreationDto => {
    return {
        type: ModificationType.CREATE_COUPLING_DEVICE,
        voltageLevelId: couplingDeviceCreation[FieldConstants.EQUIPMENT_ID],
        couplingDeviceInfos: {
            busbarSectionId1: couplingDeviceCreation[FieldConstants.BUS_BAR_SECTION_ID1],
            busbarSectionId2: couplingDeviceCreation[FieldConstants.BUS_BAR_SECTION_ID2],
        },
    };
};
