/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { array, boolean, number, object, ref, string } from 'yup';
import {
    creationPropertiesSchema,
    emptyProperties,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, sanitizeString, YUP_REQUIRED } from '../../../../utils';
import { convertInputValue, convertOutputValue } from '../../../../utils/conversionUtils';
import { FieldType } from '../../../../utils/types/fieldType';
import { Properties, Property } from '../../common';
import { MODIFICATION_TYPES } from '../../../../utils/types/modificationType';
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
        [FieldConstants.EQUIPMENT_ID]: string()
            .required(YUP_REQUIRED)
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => !addSubstationCreation,
                then: (schema) =>
                    schema.notOneOf(
                        [ref(FieldConstants.SUBSTATION_ID), null],
                        'CreateSubstationInVoltageLevelIdenticalId'
                    ),
            })
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => addSubstationCreation,
                then: (schema) =>
                    schema.notOneOf(
                        [ref(FieldConstants.SUBSTATION_CREATION_ID), null],
                        'CreateSubstationInVoltageLevelIdenticalId'
                    ),
            }),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.ADD_SUBSTATION_CREATION]: boolean().required(),
        [FieldConstants.SUBSTATION_ID]: string()
            .nullable()
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => !addSubstationCreation,
                then: (schema) =>
                    schema
                        .required()
                        .notOneOf(
                            [ref(FieldConstants.EQUIPMENT_ID), null],
                            'CreateSubstationInVoltageLevelIdenticalId'
                        ),
            }),
        [FieldConstants.SUBSTATION_CREATION_ID]: string()
            .nullable()
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => addSubstationCreation,
                then: (schema) =>
                    schema
                        .required()
                        .notOneOf(
                            [ref(FieldConstants.EQUIPMENT_ID), null],
                            'CreateSubstationInVoltageLevelIdenticalId'
                        ),
            }),
        [FieldConstants.SUBSTATION_NAME]: string().nullable(),
        [FieldConstants.COUNTRY]: string().nullable(),
        [FieldConstants.SUBSTATION_CREATION]: creationPropertiesSchema,
        [FieldConstants.HIDE_NOMINAL_VOLTAGE]: boolean().required(),
        [FieldConstants.NOMINAL_V]: number()
            .nullable()
            .when([FieldConstants.HIDE_NOMINAL_VOLTAGE], {
                is: (hideNominalVoltage: boolean) => !hideNominalVoltage,
                then: (schema) => schema.min(0, 'mustBeGreaterOrEqualToZero').required(),
            }),
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
                then: (schema) => schema.required(),
            }),
        [FieldConstants.HIDE_BUS_BAR_SECTION]: boolean().required(),
        [FieldConstants.BUS_BAR_COUNT]: number()
            .nullable()
            .when([FieldConstants.HIDE_BUS_BAR_SECTION], {
                is: (hideBusBarSection: boolean) => !hideBusBarSection,
                then: (schema) => schema.min(1, 'BusBarCountMustBeGreaterThanOrEqualToOne').required(),
            }),
        [FieldConstants.SECTION_COUNT]: number()
            .nullable()
            .when([FieldConstants.HIDE_BUS_BAR_SECTION], {
                is: (hideBusBarSection: boolean) => !hideBusBarSection,
                then: (schema) => schema.min(1, 'SectionCountMustBeGreaterThanOrEqualToOne').required(),
            }),
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
    [FieldConstants.ADD_SUBSTATION_CREATION]: boolean;
    [FieldConstants.SUBSTATION_ID]: string | null;
    [FieldConstants.SUBSTATION_CREATION_ID]: string | null;
    [FieldConstants.SUBSTATION_NAME]: string | null;
    [FieldConstants.COUNTRY]: string | null;
    [FieldConstants.SUBSTATION_CREATION]: Properties;
    [FieldConstants.HIDE_NOMINAL_VOLTAGE]: boolean;
    [FieldConstants.NOMINAL_V]: number | null;
    [FieldConstants.LOW_VOLTAGE_LIMIT]: number | null;
    [FieldConstants.HIGH_VOLTAGE_LIMIT]: number | null;
    [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number | null;
    [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number | null;
    [FieldConstants.HIDE_BUS_BAR_SECTION]: boolean;
    [FieldConstants.BUS_BAR_COUNT]: number;
    [FieldConstants.SECTION_COUNT]: number;
    [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: string;
    [FieldConstants.SWITCH_KINDS]: SwitchKindFormData[];
    [FieldConstants.TOPOLOGY_KIND]: string | null;
    [FieldConstants.COUPLING_OMNIBUS]: CouplingDevice[];
    [FieldConstants.ADDITIONAL_PROPERTIES]?: Property[];
}

export const voltageLevelCreationEmptyFormData: VoltageLevelCreationFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.ADD_SUBSTATION_CREATION]: false,
    [FieldConstants.SUBSTATION_ID]: null,
    [FieldConstants.SUBSTATION_CREATION_ID]: null,
    [FieldConstants.SUBSTATION_NAME]: null,
    [FieldConstants.COUNTRY]: null,
    [FieldConstants.SUBSTATION_CREATION]: emptyProperties,
    [FieldConstants.HIDE_NOMINAL_VOLTAGE]: false,
    [FieldConstants.NOMINAL_V]: null,
    [FieldConstants.LOW_VOLTAGE_LIMIT]: null,
    [FieldConstants.HIGH_VOLTAGE_LIMIT]: null,
    [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: null,
    [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: null,
    [FieldConstants.HIDE_BUS_BAR_SECTION]: false,
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
    const substationCreation = voltageLevelForm[FieldConstants.ADD_SUBSTATION_CREATION]
        ? {
              type: MODIFICATION_TYPES.SUBSTATION_CREATION.type,
              equipmentId: voltageLevelForm[FieldConstants.SUBSTATION_CREATION_ID],
              equipmentName: voltageLevelForm[FieldConstants.SUBSTATION_NAME],
              country: voltageLevelForm[FieldConstants.COUNTRY],
              properties: toModificationProperties(voltageLevelForm[FieldConstants.SUBSTATION_CREATION]),
          }
        : null;

    return {
        type: MODIFICATION_TYPES.VOLTAGE_LEVEL_CREATION.type,
        equipmentId: voltageLevelForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: sanitizeString(voltageLevelForm[FieldConstants.EQUIPMENT_NAME]),
        substationId: substationCreation ? null : (voltageLevelForm[FieldConstants.SUBSTATION_ID] ?? null),
        substationCreation,
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
    const isSubstationCreation = voltageLevelDto.substationCreation?.equipmentId != null;
    const substationProperties = isSubstationCreation
        ? {
              [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(
                  voltageLevelDto.substationCreation?.properties
              ),
          }
        : emptyProperties;

    return {
        [FieldConstants.EQUIPMENT_ID]: voltageLevelDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: voltageLevelDto.equipmentName ?? '',
        [FieldConstants.ADD_SUBSTATION_CREATION]: isSubstationCreation,
        [FieldConstants.SUBSTATION_ID]: isSubstationCreation ? null : voltageLevelDto.substationId,
        [FieldConstants.SUBSTATION_CREATION_ID]: isSubstationCreation
            ? voltageLevelDto.substationCreation!.equipmentId
            : null,
        [FieldConstants.SUBSTATION_NAME]: isSubstationCreation
            ? voltageLevelDto.substationCreation!.equipmentName
            : null,
        [FieldConstants.COUNTRY]: isSubstationCreation ? voltageLevelDto.substationCreation!.country : null,
        [FieldConstants.SUBSTATION_CREATION]: substationProperties,
        [FieldConstants.HIDE_NOMINAL_VOLTAGE]: false,
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
        [FieldConstants.HIDE_BUS_BAR_SECTION]: false,
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
