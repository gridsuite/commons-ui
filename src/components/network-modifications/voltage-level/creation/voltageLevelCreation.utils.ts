/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IntlShape } from 'react-intl';
import yup from '../../../../utils/yupConfig';
import {
    copyEquipmentPropertiesForCreation,
    creationPropertiesSchema,
    emptyProperties,
    getPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, sanitizeString } from '../../../../utils';
import { convertInputValue, convertOutputValue } from '../../../../utils/conversionUtils';
import { FieldType } from '../../../../utils/types/fieldType';
import { MODIFICATION_TYPES } from '../../../../utils/types/modificationType';
import { SwitchKind, VoltageLevelCreationDto, VoltageLevelFormInfos } from './voltageLevelCreation.types';
import { Option } from '../../../../utils/types/types';

export const SWITCH_TYPE = {
    BREAKER: { id: SwitchKind.BREAKER, label: 'Breaker' },
    DISCONNECTOR: { id: SwitchKind.DISCONNECTOR, label: 'Disconnector' },
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
        [id]: yup
            .array()
            .nullable()
            .of(
                yup.object().shape({
                    [FieldConstants.SWITCH_KIND]: yup.string().nullable().required(),
                })
            ),
    };
};

export const getCreateSwitchesEmptyFormData = (sectionCount: number, id = FieldConstants.SWITCH_KINDS) => ({
    [id]: new Array(sectionCount - 1).fill({ [FieldConstants.SWITCH_KIND]: '' }),
});

export const voltageLevelCreationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup
            .string()
            .required()
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => !addSubstationCreation,
                then: (schema) =>
                    schema.notOneOf(
                        [yup.ref(FieldConstants.SUBSTATION_ID), null],
                        'CreateSubstationInVoltageLevelIdenticalId'
                    ),
            })
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => addSubstationCreation,
                then: (schema) =>
                    schema.notOneOf(
                        [yup.ref(FieldConstants.SUBSTATION_CREATION_ID), null],
                        'CreateSubstationInVoltageLevelIdenticalId'
                    ),
            }),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.ADD_SUBSTATION_CREATION]: yup.boolean().required(),
        [FieldConstants.SUBSTATION_ID]: yup
            .string()
            .nullable()
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => !addSubstationCreation,
                then: (schema) =>
                    schema
                        .required()
                        .notOneOf(
                            [yup.ref(FieldConstants.EQUIPMENT_ID), null],
                            'CreateSubstationInVoltageLevelIdenticalId'
                        ),
            }),
        [FieldConstants.SUBSTATION_CREATION_ID]: yup
            .string()
            .nullable()
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => addSubstationCreation,
                then: (schema) =>
                    schema
                        .required()
                        .notOneOf(
                            [yup.ref(FieldConstants.EQUIPMENT_ID), null],
                            'CreateSubstationInVoltageLevelIdenticalId'
                        ),
            }),
        [FieldConstants.SUBSTATION_NAME]: yup.string().nullable(),
        [FieldConstants.COUNTRY]: yup.string().nullable(),
        [FieldConstants.SUBSTATION_CREATION]: creationPropertiesSchema,
        [FieldConstants.HIDE_NOMINAL_VOLTAGE]: yup.boolean().required(),
        [FieldConstants.NOMINAL_V]: yup
            .number()
            .nullable()
            .when([FieldConstants.HIDE_NOMINAL_VOLTAGE], {
                is: (hideNominalVoltage: boolean) => !hideNominalVoltage,
                then: (schema) => schema.min(0, 'mustBeGreaterOrEqualToZero').required(),
            }),
        [FieldConstants.LOW_VOLTAGE_LIMIT]: yup
            .number()
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero')
            .max(yup.ref(FieldConstants.HIGH_VOLTAGE_LIMIT), 'voltageLevelNominalVoltageMaxValueError'),
        [FieldConstants.HIGH_VOLTAGE_LIMIT]: yup.number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: yup
            .number()
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .max(yup.ref(FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT), 'ShortCircuitCurrentLimitMinMaxError'),
        [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: yup
            .number()
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .when([FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT], {
                is: (lowShortCircuitCurrentLimit: number | null) => lowShortCircuitCurrentLimit != null,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.HIDE_BUS_BAR_SECTION]: yup.boolean().required(),
        [FieldConstants.BUS_BAR_COUNT]: yup
            .number()
            .nullable()
            .when([FieldConstants.HIDE_BUS_BAR_SECTION], {
                is: (hideBusBarSection: boolean) => !hideBusBarSection,
                then: (schema) => schema.min(1, 'BusBarCountMustBeGreaterThanOrEqualToOne').required(),
            }),
        [FieldConstants.SECTION_COUNT]: yup
            .number()
            .nullable()
            .when([FieldConstants.HIDE_BUS_BAR_SECTION], {
                is: (hideBusBarSection: boolean) => !hideBusBarSection,
                then: (schema) => schema.min(1, 'SectionCountMustBeGreaterThanOrEqualToOne').required(),
            }),
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: yup
            .string()
            .nullable()
            .when([FieldConstants.SECTION_COUNT], {
                is: (sectionCount: number) => sectionCount > 1,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.SWITCH_KINDS]: yup.array().of(
            yup.object().shape({
                [FieldConstants.SWITCH_KIND]: yup.string().required(),
            })
        ),
        [FieldConstants.TOPOLOGY_KIND]: yup.string().nullable(),
        [FieldConstants.COUPLING_OMNIBUS]: yup.array().of(
            yup.object().shape({
                [FieldConstants.BUS_BAR_SECTION_ID1]: yup.string().nullable().required(),
                [FieldConstants.BUS_BAR_SECTION_ID2]: yup
                    .string()
                    .nullable()
                    .required()
                    .notOneOf(
                        [yup.ref(FieldConstants.BUS_BAR_SECTION_ID1), null],
                        'CreateCouplingDeviceIdenticalBusBar'
                    ),
            })
        ),
    })
    .concat(creationPropertiesSchema);

export type VoltageLevelCreationFormData = yup.InferType<typeof voltageLevelCreationFormSchema>;

export const voltageLevelCreationEmptyFormData = {
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
    [FieldConstants.COUPLING_OMNIBUS]: [],
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
} as VoltageLevelCreationFormData;

export const voltageLevelCreationFormToDto = (
    voltageLevelForm: VoltageLevelCreationFormData
): VoltageLevelCreationDto => {
    const substationCreation = voltageLevelForm[FieldConstants.ADD_SUBSTATION_CREATION]
        ? {
              type: MODIFICATION_TYPES.SUBSTATION_CREATION.type,
              equipmentId: voltageLevelForm[FieldConstants.SUBSTATION_CREATION_ID] ?? null,
              equipmentName: voltageLevelForm[FieldConstants.SUBSTATION_NAME] ?? null,
              country: voltageLevelForm[FieldConstants.COUNTRY] ?? null,
              properties: toModificationProperties(voltageLevelForm[FieldConstants.SUBSTATION_CREATION]),
          }
        : null;

    return {
        type: MODIFICATION_TYPES.VOLTAGE_LEVEL_CREATION.type,
        equipmentId: voltageLevelForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: sanitizeString(voltageLevelForm[FieldConstants.EQUIPMENT_NAME]) ?? null,
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
        busbarCount: voltageLevelForm[FieldConstants.BUS_BAR_COUNT] ?? 1,
        sectionCount: voltageLevelForm[FieldConstants.SECTION_COUNT] ?? 1,
        switchKinds: (voltageLevelForm[FieldConstants.SWITCH_KINDS] ?? []).map(
            (e) => e[FieldConstants.SWITCH_KIND] as SwitchKind
        ),
        couplingDevices: (voltageLevelForm[FieldConstants.COUPLING_OMNIBUS] ?? []).map((device) => ({
            busbarSectionId1: device[FieldConstants.BUS_BAR_SECTION_ID1] ?? '',
            busbarSectionId2: device[FieldConstants.BUS_BAR_SECTION_ID2] ?? '',
        })),
        properties: toModificationProperties(voltageLevelForm),
    };
};

const translateSwitchKinds = (switchKinds: SwitchKind[] | null, intl?: IntlShape): string =>
    switchKinds?.map((kind) => (intl ? intl.formatMessage({ id: kind }) : kind)).join(' / ') ?? '';

export const voltageLevelCreationDtoToForm = (dto: VoltageLevelCreationDto, intl?: IntlShape) => {
    const isSubstationCreation = dto.substationCreation?.equipmentId != null;
    const substationProperties = isSubstationCreation
        ? {
              [FieldConstants.ADDITIONAL_PROPERTIES]: dto.substationCreation?.properties ?? [],
          }
        : emptyProperties;

    return {
        [FieldConstants.EQUIPMENT_ID]: dto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: dto.equipmentName ?? '',
        [FieldConstants.ADD_SUBSTATION_CREATION]: isSubstationCreation,
        [FieldConstants.SUBSTATION_ID]: isSubstationCreation ? null : dto.substationId,
        [FieldConstants.SUBSTATION_CREATION_ID]: isSubstationCreation ? dto.substationCreation!.equipmentId : null,
        [FieldConstants.SUBSTATION_NAME]: isSubstationCreation ? dto.substationCreation!.equipmentName : null,
        [FieldConstants.COUNTRY]: isSubstationCreation ? dto.substationCreation!.country : null,
        [FieldConstants.SUBSTATION_CREATION]: substationProperties,
        [FieldConstants.HIDE_NOMINAL_VOLTAGE]: false,
        [FieldConstants.HIDE_BUS_BAR_SECTION]: false,
        [FieldConstants.NOMINAL_V]: dto.nominalV,
        [FieldConstants.LOW_VOLTAGE_LIMIT]: dto.lowVoltageLimit,
        [FieldConstants.HIGH_VOLTAGE_LIMIT]: dto.highVoltageLimit,
        [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
            FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
            dto.ipMin
        ),
        [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
            FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
            dto.ipMax
        ),
        [FieldConstants.BUS_BAR_COUNT]: dto.busbarCount ?? 1,
        [FieldConstants.SECTION_COUNT]: dto.sectionCount ?? 1,
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: translateSwitchKinds(dto.switchKinds, intl),
        [FieldConstants.SWITCH_KINDS]:
            dto.switchKinds?.map((switchKind) => ({
                [FieldConstants.SWITCH_KIND]: switchKind,
            })) ?? [],
        [FieldConstants.COUPLING_OMNIBUS]:
            dto.couplingDevices?.map((device) => ({
                [FieldConstants.BUS_BAR_SECTION_ID1]: device.busbarSectionId1,
                [FieldConstants.BUS_BAR_SECTION_ID2]: device.busbarSectionId2,
            })) ?? [],
        ...getPropertiesFromModification(dto.properties),
    };
};

export const voltageLevelInfosToForm = (formInfos: VoltageLevelFormInfos, intl?: IntlShape) => ({
    [FieldConstants.EQUIPMENT_ID]: formInfos.id,
    [FieldConstants.EQUIPMENT_NAME]: formInfos.name ?? '',
    [FieldConstants.ADD_SUBSTATION_CREATION]: false,
    [FieldConstants.SUBSTATION_ID]: formInfos.substationId,
    [FieldConstants.SUBSTATION_CREATION_ID]: null,
    [FieldConstants.SUBSTATION_NAME]: null,
    [FieldConstants.COUNTRY]: null,
    [FieldConstants.SUBSTATION_CREATION]: emptyProperties,
    [FieldConstants.HIDE_NOMINAL_VOLTAGE]: false,
    [FieldConstants.HIDE_BUS_BAR_SECTION]: false,
    [FieldConstants.TOPOLOGY_KIND]: formInfos.topologyKind ?? null,
    [FieldConstants.NOMINAL_V]: formInfos.nominalV,
    [FieldConstants.LOW_VOLTAGE_LIMIT]: formInfos.lowVoltageLimit,
    [FieldConstants.HIGH_VOLTAGE_LIMIT]: formInfos.highVoltageLimit,
    [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
        FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
        formInfos.identifiableShortCircuit?.ipMin ?? null
    ),
    [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
        FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
        formInfos.identifiableShortCircuit?.ipMax ?? null
    ),
    [FieldConstants.BUS_BAR_COUNT]: formInfos.busbarCount ?? 1,
    [FieldConstants.SECTION_COUNT]: formInfos.sectionCount ?? 1,
    [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: translateSwitchKinds(formInfos.switchKinds, intl),
    [FieldConstants.SWITCH_KINDS]:
        formInfos.switchKinds?.map((switchKind) => ({
            [FieldConstants.SWITCH_KIND]: switchKind,
        })) ?? [],
    [FieldConstants.COUPLING_OMNIBUS]: [],
    ...copyEquipmentPropertiesForCreation({ properties: formInfos.properties ?? undefined }),
});
