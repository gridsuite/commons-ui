/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FunctionComponent } from 'react';
import FieldConstants from '../../../utils/field-constants';
import RangeInput from '../../inputs/react-hook-form/range-input';
import CountriesInput from '../../inputs/react-hook-form/select-inputs/countries-input';
import SelectInput from '../../inputs/react-hook-form/select-inputs/select-input';
import { EquipmentType } from '../../../utils/EquipmentType';

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
const energySource = {
    renderer: SelectInput,
    props: {
        label: 'EnergySourceText',
        name: `${FieldConstants.CRITERIA_BASED}.${FieldConstants.ENERGY_SOURCE}`,
        options: [
            { id: 'HYDRO', label: 'Hydro' },
            { id: 'NUCLEAR', label: 'Nuclear' },
            { id: 'WIND', label: 'Wind' },
            { id: 'THERMAL', label: 'Thermal' },
            { id: 'SOLAR', label: 'Solar' },
            { id: 'OTHER', label: 'Other' },
        ],
    },
};
type FormField = {
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
    | EquipmentType.GENERATOR
    | EquipmentType.SHUNT_COMPENSATOR
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
    GENERATOR: {
        id: 'GENERATOR',
        label: 'Generators',
        fields: [countries, nominalVoltage],
    },
    SHUNT_COMPENSATOR: {
        id: 'SHUNT_COMPENSATOR',
        label: 'ShuntCompensators',
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
export const FILTER_EQUIPMENTS: Record<
    | EquipmentType.SUBSTATION
    | EquipmentType.VOLTAGE_LEVEL
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
    SUBSTATION: {
        id: 'SUBSTATION',
        label: 'Substations',
        fields: [countries, nominalVoltage],
    },
    VOLTAGE_LEVEL: {
        id: 'VOLTAGE_LEVEL',
        label: 'VoltageLevels',
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
        fields: [countries, energySource, nominalVoltage],
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
        label: 'Hvdc',
        fields: [countries1, countries2, nominalVoltage],
    },
    DANGLING_LINE: {
        id: 'DANGLING_LINE',
        label: 'DanglingLines',
        fields: [countries, nominalVoltage],
    },
};
