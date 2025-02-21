/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FunctionComponent } from 'react';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { RangeInput } from '../../inputs/reactHookForm/numbers/RangeInput';
import { CountriesInput } from '../../inputs/reactHookForm/selectInputs/CountriesInput';
import { BASE_INFOS_EQUIPMENT_TYPES, EquipmentType } from '../../../utils/types/equipmentType';

const countries = {
    renderer: CountriesInput,
    props: {
        label: 'Countries',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.COUNTRIES}`,
    },
};
const countries1 = {
    renderer: CountriesInput,
    props: {
        label: 'Countries1',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.COUNTRIES_1}`,
    },
};
const countries2 = {
    renderer: CountriesInput,
    props: {
        label: 'Countries2',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.COUNTRIES_2}`,
    },
};
const nominalVoltage = {
    renderer: RangeInput,
    props: {
        label: 'nominalVoltage',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.NOMINAL_VOLTAGE}`,
    },
};
const nominalVoltage1 = {
    renderer: RangeInput,
    props: {
        label: 'nominalVoltage1',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.NOMINAL_VOLTAGE_1}`,
    },
};
const nominalVoltage2 = {
    renderer: RangeInput,
    props: {
        label: 'nominalVoltage2',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.NOMINAL_VOLTAGE_2}`,
    },
};
const nominalVoltage3 = {
    renderer: RangeInput,
    props: {
        label: 'nominalVoltage3',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.NOMINAL_VOLTAGE_3}`,
    },
};
export type FormField = {
    renderer: FunctionComponent<any>;
    props: {
        label: string;
        name: string;
    };
};
export type FormEquipment = {
    id: string;
    label: string;
    fields: FormField[];
};

export const CONTINGENCY_LIST_EQUIPMENTS: Record<
    | EquipmentType.BUSBAR_SECTION
    | EquipmentType.LINE
    | EquipmentType.TWO_WINDINGS_TRANSFORMER
    | EquipmentType.THREE_WINDINGS_TRANSFORMER
    | EquipmentType.GENERATOR
    | EquipmentType.BATTERY
    | EquipmentType.LOAD
    | EquipmentType.SHUNT_COMPENSATOR
    | EquipmentType.STATIC_VAR_COMPENSATOR
    | EquipmentType.HVDC_LINE
    | EquipmentType.DANGLING_LINE,
    FormEquipment
> = {
    BUSBAR_SECTION: {
        id: 'BUSBAR_SECTION',
        label: 'BusBarSections',
        fields: [countries, nominalVoltage],
    },
    LINE: {
        id: 'LINE',
        label: 'Lines',
        fields: [countries1, countries2, nominalVoltage1, nominalVoltage2],
    },
    TWO_WINDINGS_TRANSFORMER: {
        id: 'TWO_WINDINGS_TRANSFORMER',
        label: 'TwoWindingsTransformers',
        fields: [countries, nominalVoltage1, nominalVoltage2],
    },
    THREE_WINDINGS_TRANSFORMER: {
        id: 'THREE_WINDINGS_TRANSFORMER',
        label: 'ThreeWindingsTransformers',
        fields: [countries, nominalVoltage1, nominalVoltage2, nominalVoltage3],
    },
    GENERATOR: {
        id: 'GENERATOR',
        label: 'Generators',
        fields: [countries, nominalVoltage],
    },
    BATTERY: {
        id: 'BATTERY',
        label: 'Batteries',
        fields: [countries, nominalVoltage],
    },
    LOAD: {
        id: 'LOAD',
        label: 'Loads',
        fields: [countries, nominalVoltage],
    },
    SHUNT_COMPENSATOR: {
        id: 'SHUNT_COMPENSATOR',
        label: 'ShuntCompensators',
        fields: [countries, nominalVoltage],
    },
    STATIC_VAR_COMPENSATOR: {
        id: 'STATIC_VAR_COMPENSATOR',
        label: 'StaticVarCompensators',
        fields: [countries, nominalVoltage],
    },
    HVDC_LINE: {
        id: 'HVDC_LINE',
        label: 'HvdcLines',
        fields: [countries1, countries2, nominalVoltage],
    },
    DANGLING_LINE: {
        id: 'DANGLING_LINE',
        label: 'DanglingLines',
        fields: [countries, nominalVoltage],
    },
};

// order is important
export const FILTER_EQUIPMENT_TYPES: Partial<Record<EquipmentType, { label?: string }>> = {
    [EquipmentType.SUBSTATION]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.SUBSTATION],
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.VOLTAGE_LEVEL],
    },
    [EquipmentType.LINE]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.LINE],
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.TWO_WINDINGS_TRANSFORMER],
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.THREE_WINDINGS_TRANSFORMER],
    },
    [EquipmentType.GENERATOR]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.GENERATOR],
    },
    [EquipmentType.BATTERY]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.BATTERY],
    },
    [EquipmentType.LOAD]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.LOAD],
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.SHUNT_COMPENSATOR],
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.STATIC_VAR_COMPENSATOR],
    },
    [EquipmentType.DANGLING_LINE]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.DANGLING_LINE],
    },
    [EquipmentType.HVDC_LINE]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.HVDC_LINE],
    },
};
