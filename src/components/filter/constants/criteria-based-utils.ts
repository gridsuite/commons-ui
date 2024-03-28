/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import CountriesInput from '../../../utils/rhf-inputs/select-inputs/countries-input';
import { FieldConstants } from './field-constants';
import RangeInput, {
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from '../../../utils/rhf-inputs/range-input';
import yup from '../../../utils/yup-config';
import SelectInput from '../../react-hook-form/select-input';

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

interface Equipment {
    id: string;
    label: string;
    fields: unknown[];
}

export const CONTINGENCY_LIST_EQUIPMENTS: Record<string, Equipment> = {
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
    BUSBAR_SECTION: {
        id: 'BUSBAR_SECTION',
        label: 'BusBarSections',
        fields: [countries, nominalVoltage],
    },
    DANGLING_LINE: {
        id: 'DANGLING_LINE',
        label: 'DanglingLines',
        fields: [countries, nominalVoltage],
    },
};

export const FILTER_EQUIPMENTS: Record<string, Equipment> = {
    ...CONTINGENCY_LIST_EQUIPMENTS,
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
    LOAD: {
        id: 'LOAD',
        label: 'Loads',
        fields: [countries, nominalVoltage],
    },
    BATTERY: {
        id: 'BATTERY',
        label: 'Batteries',
        fields: [countries, nominalVoltage],
    },
    LCC_CONVERTER_STATION: {
        id: 'LCC_CONVERTER_STATION',
        label: 'LccConverterStations',
        fields: [countries, nominalVoltage],
    },
    VSC_CONVERTER_STATION: {
        id: 'VSC_CONVERTER_STATION',
        label: 'VscConverterStations',
        fields: [countries, nominalVoltage],
    },
    VOLTAGE_LEVEL: {
        id: 'VOLTAGE_LEVEL',
        label: 'VoltageLevels',
        fields: [countries, nominalVoltage],
    },
    SUBSTATION: {
        id: 'SUBSTATION',
        label: 'Substations',
        fields: [countries, nominalVoltage],
    },
};

export const getCriteriaBasedSchema = (extraFields: any) => ({
    [FieldConstants.CRITERIA_BASED]: yup.object().shape({
        [FieldConstants.COUNTRIES]: yup.array().of(yup.string()),
        [FieldConstants.COUNTRIES_1]: yup.array().of(yup.string()),
        [FieldConstants.COUNTRIES_2]: yup.array().of(yup.string()),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_1),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_2),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_3),
        ...extraFields,
    }),
});

export const getCriteriaBasedFormData = (
    criteriaValues: any,
    extraFields: any
) => ({
    [FieldConstants.CRITERIA_BASED]: {
        [FieldConstants.COUNTRIES]:
            criteriaValues?.[FieldConstants.COUNTRIES] ?? [],
        [FieldConstants.COUNTRIES_1]:
            criteriaValues?.[FieldConstants.COUNTRIES_1] ?? [],
        [FieldConstants.COUNTRIES_2]:
            criteriaValues?.[FieldConstants.COUNTRIES_2] ?? [],
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_1,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_1] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_2,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_2] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_3,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_3] ??
                DEFAULT_RANGE_VALUE
        ),
        ...extraFields,
    },
});
