/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { array, number, object, ref, string } from 'yup';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, sanitizeString, YUP_REQUIRED } from '../../../../utils';
import { convertInputValue, convertOutputValue } from '../../../../utils/conversionUtils';
import { FieldType } from '../../../../utils/types/fieldType';
import { FilledProperty } from '../../common';
import { CouplingDevice, SwitchKindFormData, VoltageLevelCreationDto } from './voltageLevelCreation.types';
import { Option } from '../../../../utils/types/types';

export const SWITCH_TYPE = {
    BREAKER: { id: 'BREAKER', label: 'Breaker' },
    DISCONNECTOR: { id: 'DISCONNECTOR', label: 'Disconnector' },
} as const;

export const buildNewBusbarSections = (equipmentId: string, sectionCount: number, busbarCount: number): Option[] => {
    const newBusbarSections: Option[] = [];
    for (let i = 0; i < busbarCount; i++) {
        for (let j = 0; j < sectionCount; j++) {
            newBusbarSections.push({
                id: `${equipmentId}_${i + 1}_${j + 1}`,
                label: '',
            });
        }
    }
    return newBusbarSections;
};

export const getCreateSwitchesValidationSchema = (id = FieldConstants.SWITCH_KINDS) => {
    return {
        [id]: array()
            .nullable()
            .of(
                object().shape({
                    [FieldConstants.SWITCH_KIND]: string().nullable().required(),
                })
            ),
    };
};

export const getCreateSwitchesEmptyFormData = (sectionCount: number, id = FieldConstants.SWITCH_KINDS) => ({
    [id]: new Array(sectionCount - 1).fill({ [FieldConstants.SWITCH_KIND]: '' }),
});

export const voltageLevelCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(YUP_REQUIRED),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.SUBSTATION_ID]: string().nullable().required(YUP_REQUIRED),
        [FieldConstants.NOMINAL_V]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(YUP_REQUIRED),
        [FieldConstants.LOW_VOLTAGE_LIMIT]: number()
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero')
            .max(ref(FieldConstants.HIGH_VOLTAGE_LIMIT), 'voltageLevelNominalVoltageMaxValueError'),
        [FieldConstants.HIGH_VOLTAGE_LIMIT]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .max(ref(FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT), 'ShortCircuitCurrentLimitMinMaxError'),
        [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .when([FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT], {
                is: (lowShortCircuitCurrentLimit: number | null) => lowShortCircuitCurrentLimit != null,
                then: (schema) => schema.required(YUP_REQUIRED),
            }),
        [FieldConstants.BUS_BAR_COUNT]: number()
            .nullable()
            .min(1, 'BusBarCountMustBeGreaterThanOrEqualToOne')
            .required(YUP_REQUIRED),
        [FieldConstants.SECTION_COUNT]: number()
            .nullable()
            .min(1, 'SectionCountMustBeGreaterThanOrEqualToOne')
            .required(YUP_REQUIRED),
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: string()
            .nullable()
            .when([FieldConstants.SECTION_COUNT], {
                is: (sectionCount: number) => sectionCount > 1,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.SWITCH_KINDS]: array().of(
            object().shape({
                [FieldConstants.SWITCH_KIND]: string().required(),
            })
        ),
        [FieldConstants.TOPOLOGY_KIND]: string().nullable(),
        [FieldConstants.COUPLING_OMNIBUS]: array().of(
            object().shape({
                [FieldConstants.BUS_BAR_SECTION_ID1]: string().nullable().required(),
                [FieldConstants.BUS_BAR_SECTION_ID2]: string()
                    .nullable()
                    .required()
                    .notOneOf([ref(FieldConstants.BUS_BAR_SECTION_ID1), null], 'CreateCouplingDeviceIdenticalBusBar'),
            })
        ),
    })
    .concat(creationPropertiesSchema);

export interface VoltageLevelCreationFormData {
    [FieldConstants.EQUIPMENT_ID]: string;
    [FieldConstants.EQUIPMENT_NAME]: string | null;
    [FieldConstants.SUBSTATION_ID]: string | null;
    [FieldConstants.NOMINAL_V]: number | null;
    [FieldConstants.LOW_VOLTAGE_LIMIT]: number | null;
    [FieldConstants.HIGH_VOLTAGE_LIMIT]: number | null;
    [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number | null;
    [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number | null;
    [FieldConstants.BUS_BAR_COUNT]: number;
    [FieldConstants.SECTION_COUNT]: number;
    [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: string;
    [FieldConstants.SWITCH_KINDS]: SwitchKindFormData[];
    [FieldConstants.TOPOLOGY_KIND]: string | null;
    [FieldConstants.COUPLING_OMNIBUS]: CouplingDevice[];
    [FieldConstants.ADDITIONAL_PROPERTIES]?: FilledProperty[];
}

export const voltageLevelCreationEmptyFormData: VoltageLevelCreationFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.SUBSTATION_ID]: null,
    [FieldConstants.NOMINAL_V]: null,
    [FieldConstants.LOW_VOLTAGE_LIMIT]: null,
    [FieldConstants.HIGH_VOLTAGE_LIMIT]: null,
    [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: null,
    [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: null,
    [FieldConstants.BUS_BAR_COUNT]: 1,
    [FieldConstants.SECTION_COUNT]: 1,
    [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: '',
    [FieldConstants.SWITCH_KINDS]: [],
    [FieldConstants.TOPOLOGY_KIND]: null,
    [FieldConstants.COUPLING_OMNIBUS]: [],
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const voltageLevelCreationFormToDto = (
    voltageLevelForm: VoltageLevelCreationFormData
): VoltageLevelCreationDto => {
    return {
        type: 'VOLTAGE_LEVEL_CREATION',
        equipmentId: voltageLevelForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: sanitizeString(voltageLevelForm[FieldConstants.EQUIPMENT_NAME]),
        substationId: voltageLevelForm[FieldConstants.SUBSTATION_ID] ?? null,
        nominalV: voltageLevelForm[FieldConstants.NOMINAL_V] ?? null,
        lowVoltageLimit: voltageLevelForm[FieldConstants.LOW_VOLTAGE_LIMIT] ?? null,
        highVoltageLimit: voltageLevelForm[FieldConstants.HIGH_VOLTAGE_LIMIT] ?? null,
        ipMin: convertOutputValue(
            FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelForm[FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]
        ),
        ipMax: convertOutputValue(
            FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelForm[FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]
        ),
        busbarCount: voltageLevelForm[FieldConstants.BUS_BAR_COUNT],
        sectionCount: voltageLevelForm[FieldConstants.SECTION_COUNT],
        switchKinds: voltageLevelForm[FieldConstants.SWITCH_KINDS].map((e) => e.switchKind),
        couplingDevices: voltageLevelForm[FieldConstants.COUPLING_OMNIBUS],
        topologyKind: voltageLevelForm[FieldConstants.TOPOLOGY_KIND] ?? null,
        properties: toModificationProperties(voltageLevelForm),
    };
};

export const voltageLevelCreationDtoToForm = (
    voltageLevelDto: VoltageLevelCreationDto
): VoltageLevelCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: voltageLevelDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: voltageLevelDto.equipmentName ?? '',
        [FieldConstants.SUBSTATION_ID]: voltageLevelDto.substationId,
        [FieldConstants.NOMINAL_V]: voltageLevelDto.nominalV,
        [FieldConstants.LOW_VOLTAGE_LIMIT]: voltageLevelDto.lowVoltageLimit,
        [FieldConstants.HIGH_VOLTAGE_LIMIT]: voltageLevelDto.highVoltageLimit,
        [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
            FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelDto.ipMin
        ),
        [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
            FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelDto.ipMax
        ),
        [FieldConstants.BUS_BAR_COUNT]: voltageLevelDto.busbarCount ?? 1,
        [FieldConstants.SECTION_COUNT]: voltageLevelDto.sectionCount ?? 1,
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: voltageLevelDto.switchKinds?.join(' / ') ?? '',
        [FieldConstants.SWITCH_KINDS]:
            voltageLevelDto.switchKinds?.map((switchKind) => ({
                switchKind,
            })) ?? [],
        [FieldConstants.TOPOLOGY_KIND]: voltageLevelDto.topologyKind ?? null,
        [FieldConstants.COUPLING_OMNIBUS]: voltageLevelDto.couplingDevices ?? [],
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(voltageLevelDto.properties),
    };
};
