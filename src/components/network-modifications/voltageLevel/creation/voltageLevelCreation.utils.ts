/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IntlShape } from 'react-intl';
import { array, boolean, InferType, number, object, ref, string } from 'yup';
import {
    creationPropertiesSchema,
    emptyProperties,
    getPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, sanitizeString, YUP_NOT_TYPE_NUMBER, YUP_REQUIRED } from '../../../../utils';
import { convertInputValue, convertOutputValue } from '../../../../utils/conversionUtils';
import { FieldType } from '../../../../utils/types/fieldType';
import { MODIFICATION_TYPES } from '../../../../utils/types/modificationType';
import { SwitchKind, VoltageLevelCreationDto } from './voltageLevelCreation.types';
import { Option } from '../../../../utils/types/types';
import { substationCreationEmptyFormData } from '../../substation';

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
                    [FieldConstants.SWITCH_KIND]: string().nullable().required(YUP_REQUIRED),
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
        [FieldConstants.ADD_SUBSTATION_CREATION]: boolean().required(YUP_REQUIRED),
        [FieldConstants.SUBSTATION_ID]: string()
            .nullable()
            .when([FieldConstants.ADD_SUBSTATION_CREATION], {
                is: (addSubstationCreation: boolean) => !addSubstationCreation,
                then: (schema) =>
                    schema
                        .required(YUP_REQUIRED)
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
                        .required(YUP_REQUIRED)
                        .notOneOf(
                            [ref(FieldConstants.EQUIPMENT_ID), null],
                            'CreateSubstationInVoltageLevelIdenticalId'
                        ),
            }),
        [FieldConstants.SUBSTATION_NAME]: string().nullable(),
        [FieldConstants.COUNTRY]: string().nullable(),
        [FieldConstants.SUBSTATION_CREATION]: creationPropertiesSchema,
        [FieldConstants.HIDE_NOMINAL_VOLTAGE]: boolean().required(YUP_REQUIRED),
        [FieldConstants.NOMINAL_V]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .when([FieldConstants.HIDE_NOMINAL_VOLTAGE], {
                is: (hideNominalVoltage: boolean) => !hideNominalVoltage,
                then: (schema) => schema.min(0, 'mustBeGreaterOrEqualToZero').required(YUP_REQUIRED),
            }),
        [FieldConstants.LOW_VOLTAGE_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero')
            .max(ref(FieldConstants.HIGH_VOLTAGE_LIMIT), 'voltageLevelNominalVoltageMaxValueError'),
        [FieldConstants.HIGH_VOLTAGE_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .max(ref(FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT), 'ShortCircuitCurrentLimitMinMaxError'),
        [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .when([FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT], {
                is: (lowShortCircuitCurrentLimit: number | null) => lowShortCircuitCurrentLimit != null,
                then: (schema) => schema.required(YUP_REQUIRED),
            }),
        [FieldConstants.HIDE_BUS_BAR_SECTION]: boolean().required(YUP_REQUIRED),
        [FieldConstants.BUS_BAR_COUNT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .when([FieldConstants.HIDE_BUS_BAR_SECTION], {
                is: (hideBusBarSection: boolean) => !hideBusBarSection,
                then: (schema) => schema.min(1, 'BusBarCountMustBeGreaterThanOrEqualToOne').required(YUP_REQUIRED),
            }),
        [FieldConstants.SECTION_COUNT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .when([FieldConstants.HIDE_BUS_BAR_SECTION], {
                is: (hideBusBarSection: boolean) => !hideBusBarSection,
                then: (schema) => schema.min(1, 'SectionCountMustBeGreaterThanOrEqualToOne').required(YUP_REQUIRED),
            }),
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: string()
            .nullable()
            .when([FieldConstants.SECTION_COUNT], {
                is: (sectionCount: number) => sectionCount > 1,
                then: (schema) => schema.required(YUP_REQUIRED),
            }),
        [FieldConstants.SWITCH_KINDS]: array().of(
            object().shape({
                [FieldConstants.SWITCH_KIND]: string().required(YUP_REQUIRED),
            })
        ),
        [FieldConstants.TOPOLOGY_KIND]: string().nullable(),
        [FieldConstants.COUPLING_OMNIBUS]: array().of(
            object().shape({
                [FieldConstants.BUS_BAR_SECTION_ID1]: string().nullable().required(YUP_REQUIRED),
                [FieldConstants.BUS_BAR_SECTION_ID2]: string()
                    .nullable()
                    .required(YUP_REQUIRED)
                    .notOneOf([ref(FieldConstants.BUS_BAR_SECTION_ID1), null], 'CreateCouplingDeviceIdenticalBusBar'),
            })
        ),
    })
    .concat(creationPropertiesSchema);

export type VoltageLevelCreationFormData = InferType<typeof voltageLevelCreationFormSchema>;

export const voltageLevelCreationEmptyFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.ADD_SUBSTATION_CREATION]: false,
    [FieldConstants.SUBSTATION_ID]: null,
    [FieldConstants.SUBSTATION_CREATION_ID]: null,
    [FieldConstants.SUBSTATION_NAME]: null,
    [FieldConstants.COUNTRY]: null,
    [FieldConstants.SUBSTATION_CREATION]: substationCreationEmptyFormData,
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
} satisfies VoltageLevelCreationFormData;

export const voltageLevelCreationFormToDto = (
    voltageLevelForm: VoltageLevelCreationFormData
): VoltageLevelCreationDto => {
    const substationCreation = voltageLevelForm[FieldConstants.ADD_SUBSTATION_CREATION]
        ? {
              type: MODIFICATION_TYPES.SUBSTATION_CREATION.type,
              equipmentId: voltageLevelForm[FieldConstants.SUBSTATION_CREATION_ID] ?? '',
              equipmentName: voltageLevelForm[FieldConstants.SUBSTATION_NAME] ?? null,
              country: voltageLevelForm[FieldConstants.COUNTRY] ?? null,
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

export const translateSwitchKinds = (switchKinds: SwitchKind[] | null, intl?: IntlShape): string =>
    switchKinds?.map((kind) => (intl ? intl.formatMessage({ id: kind }) : kind)).join(' / ') ?? '';

export const voltageLevelCreationDtoToForm = (
    voltageLevelDto: VoltageLevelCreationDto,
    intl?: IntlShape,
    includePreviousValue: boolean = true
) => {
    const isSubstationCreation = voltageLevelDto.substationCreation?.equipmentId != null;
    const substationProperties = isSubstationCreation
        ? getPropertiesFromModification(voltageLevelDto.substationCreation?.properties, includePreviousValue)
        : emptyProperties;

    return {
        [FieldConstants.EQUIPMENT_ID]: voltageLevelDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: voltageLevelDto.equipmentName ?? '',
        [FieldConstants.SUBSTATION_ID]: isSubstationCreation ? null : voltageLevelDto.substationId,
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
        [FieldConstants.SWITCHES_BETWEEN_SECTIONS]: translateSwitchKinds(voltageLevelDto.switchKinds, intl),
        [FieldConstants.COUPLING_OMNIBUS]: voltageLevelDto.couplingDevices ?? [],
        [FieldConstants.SWITCH_KINDS]:
            voltageLevelDto.switchKinds?.map((switchKind) => ({
                switchKind,
            })) ?? [],
        [FieldConstants.ADD_SUBSTATION_CREATION]: isSubstationCreation,
        [FieldConstants.SUBSTATION_CREATION_ID]: isSubstationCreation
            ? voltageLevelDto.substationCreation!.equipmentId
            : null,
        [FieldConstants.SUBSTATION_NAME]: isSubstationCreation
            ? voltageLevelDto.substationCreation!.equipmentName
            : null,
        [FieldConstants.COUNTRY]: isSubstationCreation ? voltageLevelDto.substationCreation!.country : null,
        [FieldConstants.SUBSTATION_CREATION]: substationProperties,
        [FieldConstants.HIDE_NOMINAL_VOLTAGE]: false,
        [FieldConstants.HIDE_BUS_BAR_SECTION]: false,
        ...getPropertiesFromModification(voltageLevelDto.properties, includePreviousValue),
    };
};

export function isSubstationTabError(errors: Record<string, unknown> | undefined) {
    return (
        errors?.[FieldConstants.ADD_SUBSTATION_CREATION] !== undefined ||
        errors?.[FieldConstants.SUBSTATION_ID] !== undefined ||
        errors?.[FieldConstants.SUBSTATION_NAME] !== undefined ||
        errors?.[FieldConstants.SUBSTATION_CREATION_ID] !== undefined ||
        errors?.[FieldConstants.SUBSTATION_CREATION] ||
        errors?.[FieldConstants.COUNTRY] !== undefined
    );
}

export function isCharacteristicsTabError(errors: Record<string, unknown> | undefined) {
    return (
        errors?.[FieldConstants.HIDE_NOMINAL_VOLTAGE] !== undefined ||
        errors?.[FieldConstants.NOMINAL_V] !== undefined ||
        errors?.[FieldConstants.LOW_VOLTAGE_LIMIT] !== undefined ||
        errors?.[FieldConstants.HIGH_VOLTAGE_LIMIT] !== undefined ||
        errors?.[FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT] ||
        errors?.[FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT] !== undefined
    );
}

export function isStructureTabError(errors: Record<string, unknown> | undefined) {
    return (
        errors?.[FieldConstants.HIDE_BUS_BAR_SECTION] !== undefined ||
        errors?.[FieldConstants.BUS_BAR_COUNT] !== undefined ||
        errors?.[FieldConstants.SECTION_COUNT] !== undefined ||
        errors?.[FieldConstants.SWITCHES_BETWEEN_SECTIONS] !== undefined ||
        errors?.[FieldConstants.SWITCH_KINDS] ||
        errors?.[FieldConstants.TOPOLOGY_KIND] !== undefined ||
        errors?.[FieldConstants.COUPLING_OMNIBUS] !== undefined
    );
}

export function isAdditionalInformationTabError(errors: Record<string, unknown> | undefined) {
    return errors?.[FieldConstants.ADDITIONAL_PROPERTIES] !== undefined;
}
