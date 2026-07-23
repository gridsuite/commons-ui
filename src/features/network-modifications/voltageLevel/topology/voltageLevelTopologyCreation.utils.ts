/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { IntlShape } from 'react-intl';
import { DeepNullable, FieldConstants, ModificationType } from '../../../../utils';
import { MAX_SECTIONS_COUNT } from '../creation/voltageLevel.constants';
import {
    CreateVoltageLevelTopologyDialogSchemaForm,
    CreateVoltageLevelTopologyInfos,
} from './voltageLevelTopologyCreation.types';

export const createVoltageLevelTopologyEmptyFormData: DeepNullable<CreateVoltageLevelTopologyDialogSchemaForm> = {
    [FieldConstants.SECTION_COUNT]: null,
    [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: '',
    [FieldConstants.SWITCH_KINDS]: [],
};

export const createVoltageLevelTopologyFormSchema = yup
    .object()
    .shape({
        [FieldConstants.SECTION_COUNT]: yup
            .number()
            .required()
            .nullable()
            .min(1, 'AtLeastOneSectionAdded')
            .max(MAX_SECTIONS_COUNT, 'SectionCountMustBeLessThanOrEqualToTwenty'),
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: yup
            .string()
            .nullable()
            .when([FieldConstants.SECTION_COUNT], {
                is: (sectionCount: number) => sectionCount > 1,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.SWITCH_KINDS]: yup.array().nullable(),
    })
    .required();

export const createVoltageLevelTopologyDtoToForm = (
    editData: CreateVoltageLevelTopologyInfos | undefined,
    intl: IntlShape
): DeepNullable<CreateVoltageLevelTopologyDialogSchemaForm> => {
    const switchKinds =
        editData?.switchKinds?.map((switchKind) => ({ [FieldConstants.SWITCH_KIND]: switchKind })) || [];
    const switchesBetweenSections =
        editData?.switchKinds?.map((switchKind) => intl.formatMessage({ id: switchKind })).join(' / ') || '';
    return {
        [FieldConstants.SECTION_COUNT]: editData?.sectionCount ?? null,
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: switchesBetweenSections,
        [FieldConstants.SWITCH_KINDS]: switchKinds,
    };
};

export const createVoltageLevelTopologyFormToDto = (
    voltageLevelTopology: CreateVoltageLevelTopologyDialogSchemaForm,
    voltageLevelId: string
): CreateVoltageLevelTopologyInfos =>
    ({
        type: ModificationType.CREATE_VOLTAGE_LEVEL_TOPOLOGY,
        voltageLevelId,
        sectionCount: voltageLevelTopology[FieldConstants.SECTION_COUNT],
        switchKinds: voltageLevelTopology[FieldConstants.SWITCH_KINDS]?.map(
            (switchKindData) => switchKindData[FieldConstants.SWITCH_KIND]
        ),
    }) satisfies CreateVoltageLevelTopologyInfos;
