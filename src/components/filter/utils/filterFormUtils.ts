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
import { EquipmentType } from '../../../utils/types/equipmentType';
import { ExtendedEquipmentType } from '../../../utils';

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

const BASE_EQUIPMENTS: Partial<Record<EquipmentType, { id: EquipmentType; label: string }>> = {
    [EquipmentType.SUBSTATION]: {
        id: EquipmentType.SUBSTATION,
        label: 'Substations',
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        id: EquipmentType.VOLTAGE_LEVEL,
        label: 'VoltageLevels',
    },
    [EquipmentType.LINE]: {
        id: EquipmentType.LINE,
        label: 'Lines',
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        id: EquipmentType.TWO_WINDINGS_TRANSFORMER,
        label: 'TwoWindingsTransformers',
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        id: EquipmentType.THREE_WINDINGS_TRANSFORMER,
        label: 'ThreeWindingsTransformers',
    },
    [EquipmentType.GENERATOR]: {
        id: EquipmentType.GENERATOR,
        label: 'Generators',
    },
    [EquipmentType.BATTERY]: {
        id: EquipmentType.BATTERY,
        label: 'Batteries',
    },
    [EquipmentType.LOAD]: {
        id: EquipmentType.LOAD,
        label: 'Loads',
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        id: EquipmentType.SHUNT_COMPENSATOR,
        label: 'ShuntCompensators',
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        id: EquipmentType.STATIC_VAR_COMPENSATOR,
        label: 'StaticVarCompensators',
    },
    [EquipmentType.DANGLING_LINE]: {
        id: EquipmentType.DANGLING_LINE,
        label: 'DanglingLines',
    },
};

export const FILTER_EQUIPMENTS: Partial<Record<EquipmentType, { id: EquipmentType; label: string }>> = {
    ...BASE_EQUIPMENTS,
    [EquipmentType.HVDC_LINE]: {
        id: EquipmentType.HVDC_LINE,
        label: 'Hvdc',
    },
};

export const SEARCH_EQUIPMENTS: Partial<
    Record<EquipmentType | ExtendedEquipmentType, { id: EquipmentType | ExtendedEquipmentType; label: string }>
> = {
    ...BASE_EQUIPMENTS,
    [ExtendedEquipmentType.HVDC_LINE_LCC]: {
        id: ExtendedEquipmentType.HVDC_LINE_LCC,
        label: 'LCC',
    },
    [ExtendedEquipmentType.HVDC_LINE_VSC]: {
        id: ExtendedEquipmentType.HVDC_LINE_VSC,
        label: 'VSC',
    },
};
