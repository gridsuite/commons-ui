/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import {
    InitialVoltage,
    SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import yup from '../../../utils/yupConfig';
import { COMMON_PARAMETERS, SPECIFIC_PARAMETERS } from '../common';
import { EquipmentType, type SpecificParameterInfos, type SpecificParametersValues } from '../../../utils';

import type { PowerElectronicsMaterial } from './short-circuit-parameters.type';
import {
    formatSpecificParameters,
    getAllSpecificParametersValues,
    getDefaultSpecificParamsValues,
    getSpecificParametersFormSchema,
} from '../common/utils';

export enum ShortCircuitParametersTabValues {
    GENERAL = 'General',
    STUDY_AREA = 'StudyArea',
}

export enum ShortCircuitParametersFieldConstants {
    SUB_EQUIPMENT_TYPES_BY_FILTER = 'subEquipmentTypesByFilter',
    FILTER_ID = 'filterId',
    SUB_EQUIPMENT_TYPES = 'subEquipmentTypes',
}

export interface FilterSubEquipments {
    [ShortCircuitParametersFieldConstants.FILTER_ID]: string;
    [ShortCircuitParametersFieldConstants.SUB_EQUIPMENT_TYPES]: string[];
}

export interface FilterElement {
    id: UUID;
    name: string;
    specificMetadata: {
        equipmentType: string;
    };
}

export const getCommonShortCircuitParametersFormSchema = () => {
    return yup.object().shape({
        [COMMON_PARAMETERS]: yup.object().shape({
            [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_LOADS]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: yup.boolean().required(),
            [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]: yup
                .mixed<InitialVoltage>()
                .oneOf(Object.values(InitialVoltage))
                .required(),
        }),
    });
};

export const getSpecificShortCircuitParametersFormSchema = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[] | undefined
) => {
    const defaultSchema = getSpecificParametersFormSchema(specificParametersDescriptionForProvider);

    const powerElectronicsMaterialsParam = specificParametersDescriptionForProvider?.find(
        (specificParam) => specificParam.name === SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
    );

    const powerElectronicsMaterialsSchema = powerElectronicsMaterialsParam
        ? yup
              .array<PowerElectronicsMaterial & { active: boolean }>()
              .of(
                  yup.object<PowerElectronicsMaterial & { active: boolean }>().shape({
                      active: yup.boolean().required(),
                      alpha: yup.number().required(),
                      u0: yup.number().required(),
                      usMin: yup.number().required(),
                      usMax: yup.number().required(),
                      type: yup.string().oneOf(['WIND', 'SOLAR', 'HVDC']).required(),
                  })
              )
              .required()
        : undefined;

    // try to extract existing SPECIFIC_PARAMETERS fields from defaultSchema (if present)
    const existingSpecificSchema = (defaultSchema as any).fields?.[SPECIFIC_PARAMETERS] as
        | yup.ObjectSchema<any>
        | undefined;
    const existingSpecificFields = existingSpecificSchema ? (existingSpecificSchema as any).fields || {} : {};

    const mergedSpecificShape: { [key: string]: yup.AnySchema } = {
        ...existingSpecificFields,
        ...(powerElectronicsMaterialsSchema
            ? { [SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS]: powerElectronicsMaterialsSchema }
            : {}),
        ...{
            [SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS]: yup.array().of(
                yup.object().shape({
                    [ShortCircuitParametersFieldConstants.FILTER_ID]: yup.string().required(),
                    [ShortCircuitParametersFieldConstants.SUB_EQUIPMENT_TYPES]: yup
                        .array()
                        .required()
                        .of(yup.string().required()),
                })
            ),
        },
    };

    const overrideSchema = yup.object().shape({
        [SPECIFIC_PARAMETERS]: yup.object().shape(mergedSpecificShape),
    });

    // merge defaultSchema with our override (preserves other keys from defaultSchema)
    return defaultSchema.concat(overrideSchema);
};

const parsepowerElectronicsMaterialsParamString = (paramString: string): PowerElectronicsMaterial[] => {
    // Attempt to parse the string into an array of PowerElectronicsMaterial objects
    try {
        return JSON.parse(paramString);
    } catch (error) {
        console.error('Error parsing power electronics materials parameter string:', error);
        return [];
    }
};

export const getDefaultShortCircuitSpecificParamsValues = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[]
): SpecificParametersValues => {
    const defaultValues: SpecificParametersValues = getDefaultSpecificParamsValues(
        specificParametersDescriptionForProvider
    );
    const powerElectronicsMaterialsParam = specificParametersDescriptionForProvider.find(
        (specificParam) => specificParam.name === SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
    );
    if (powerElectronicsMaterialsParam) {
        const electronicsMaterialsArray: PowerElectronicsMaterial[] = parsepowerElectronicsMaterialsParamString(
            powerElectronicsMaterialsParam.defaultValue
        );

        defaultValues[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = electronicsMaterialsArray.map((material) => ({
            ...material,
            active: false,
        }));
    }
    return defaultValues;
};

export const getShortCircuitSpecificParametersValues = (
    formData: Record<string, any>,
    _specificParametersValues: SpecificParametersValues
): SpecificParametersValues => {
    const powerElectronicsMaterialsParam: (PowerElectronicsMaterial & { active: boolean })[] =
        formData[SPECIFIC_PARAMETERS][SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS];
    if (powerElectronicsMaterialsParam) {
        // create pretty JSON
        return {
            ...getAllSpecificParametersValues(formData, _specificParametersValues),
            [SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS]: JSON.stringify(
                powerElectronicsMaterialsParam
                    .filter((sParam) => sParam.active) // keep only active ones
                    .map((sParam) => {
                        const { active, ...rest } = sParam; // remove 'active' property
                        return rest;
                    })
            ),
        };
    }
    return getAllSpecificParametersValues(formData, _specificParametersValues);
};

const formatElectronicsMaterialsParamString = (
    defaultValues: PowerElectronicsMaterial[],
    specificParamValue: string
) => {
    const electronicsMaterialsArrayInParams: PowerElectronicsMaterial[] =
        parsepowerElectronicsMaterialsParamString(specificParamValue);
    return defaultValues.map((material) => {
        const foundInParams = electronicsMaterialsArrayInParams.find((m) => m.type === material.type);
        return foundInParams ? { ...foundInParams, active: true } : { ...material, active: false };
    });
};

export const formatShortCircuitSpecificParameters = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[],
    specificParamsList: SpecificParametersValues
): SpecificParametersValues => {
    if (!specificParamsList) {
        return getDefaultShortCircuitSpecificParamsValues(specificParametersDescriptionForProvider);
    }

    // reuse generic formatter for specific params
    const formatted = formatSpecificParameters(specificParametersDescriptionForProvider, specificParamsList);

    // handle special power-electronics-materials case by overriding the generic result
    const powerParam = specificParametersDescriptionForProvider.find(
        (p) => p.name === SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
    );
    if (powerParam) {
        if (Object.hasOwn(specificParamsList, SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS)) {
            formatted[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = formatElectronicsMaterialsParamString(
                getDefaultShortCircuitSpecificParamsValues([powerParam])?.[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS],
                specificParamsList[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] as string
            );
        } else {
            formatted[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = getDefaultSpecificParamsValues([powerParam])?.[
                SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
            ];
        }
    }
    return formatted;
};

export function isSubstationOrVoltageLevelFilter(filter: FilterElement) {
    return (
        filter.specificMetadata.equipmentType === EquipmentType.SUBSTATION ||
        filter.specificMetadata.equipmentType === EquipmentType.VOLTAGE_LEVEL
    );
}
