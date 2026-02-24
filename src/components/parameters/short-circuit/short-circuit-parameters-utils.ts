/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import {
    InitialVoltage,
    NODE_CLUSTER,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTER,
    SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import yup from '../../../utils/yupConfig';
import { COMMON_PARAMETERS, SPECIFIC_PARAMETERS } from '../common';
import { ID, snackWithFallback, type SpecificParameterInfos, type SpecificParametersValues } from '../../../utils';

import {
    FilterPOJO,
    FormPowerElectronicsCluster,
    type PowerElectronicsCluster,
    type PowerElectronicsMaterial,
} from './short-circuit-parameters.type';
import {
    formatSpecificParameters,
    getDefaultSpecificParamsValues,
    getSpecificParametersFormSchema,
} from '../common/utils';
import { NAME } from '../../inputs';
import { SnackInputs } from '../../../hooks';

export enum ShortCircuitParametersTabValues {
    GENERAL = 'General',
    STUDY_AREA = 'StudyArea',
    POWER_ELECTRONICS = 'PowerElectronics',
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

    const powerElectronicsClustersParam = specificParametersDescriptionForProvider?.find(
        (specificParam) => specificParam.name === SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTER
    );

    const powerElectronicsClustersSchema = powerElectronicsClustersParam
        ? yup
              .array<FormPowerElectronicsCluster & { active: boolean }>()
              .of(
                  yup.object<FormPowerElectronicsCluster & { active: boolean }>().shape({
                      active: yup.boolean().required(),
                      alpha: yup.number().required(),
                      u0: yup.number().required(),
                      usMin: yup.number().required(),
                      usMax: yup.number().required(),
                      filters: yup.array().of(
                          yup.object<FilterPOJO>().shape({
                              [ID]: yup.string().required(),
                              [NAME]: yup.string().required(),
                          })
                      ),
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
        ...(powerElectronicsClustersSchema
            ? { [SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS]: powerElectronicsClustersSchema }
            : {}),
        ...{
            [NODE_CLUSTER]: yup.array().of(
                    yup.object<FilterPOJO>().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
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

const parsePowerElectronicsMaterialsParamString = (
    paramString: string,
    snackError: (message: SnackInputs) => void
): PowerElectronicsMaterial[] => {
    // Attempt to parse the string into an array of PowerElectronicsMaterial objects
    try {
        return JSON.parse(paramString);
    } catch (error) {
        console.error('Error parsing power electronics materials parameter string:', error);
        snackWithFallback(snackError, error, { headerId: 'ShortCircuitPowerElectronicsMaterialsParamParsingError' });
        return [];
    }
};

const parsePowerElectronicsClustersParamString = (
    paramString: string,
    snackError: (message: SnackInputs) => void
): (PowerElectronicsCluster & { active: boolean })[] => {
    // Attempt to parse the string into an array of PowerElectronicsCluster objects
    try {
        return JSON.parse(paramString);
    } catch (error) {
        snackWithFallback(snackError, error, { headerId: 'ShortCircuitPowerElectronicsClustersParamParsingError' });
        return [];
    }
};

export const getDefaultShortCircuitSpecificParamsValues = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[],
    snackError: (message: SnackInputs) => void
): SpecificParametersValues => {
    const defaultValues: SpecificParametersValues = getDefaultSpecificParamsValues(
        specificParametersDescriptionForProvider
    );
    const powerElectronicsMaterialsParam = specificParametersDescriptionForProvider.find(
        (specificParam) => specificParam.name === SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
    );
    if (powerElectronicsMaterialsParam) {
        const electronicsMaterialsArray: PowerElectronicsMaterial[] = parsePowerElectronicsMaterialsParamString(
            powerElectronicsMaterialsParam.defaultValue,
            snackError
        );

        defaultValues[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = electronicsMaterialsArray.map((material) => ({
            ...material,
            active: false,
        }));
    }
    defaultValues[NODE_CLUSTER] = [];
    const powerElectronicsClustersParam = specificParametersDescriptionForProvider.find(
        (specificParam) => specificParam.name === SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTER
    );
    if (powerElectronicsClustersParam) {
        defaultValues[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS] = []; // there is no default params for clusters for now
    }
    return defaultValues;
};

export const getShortCircuitSpecificParametersValues = (
    formData: Record<string, any>,
    _specificParametersValues: SpecificParametersValues
): SpecificParametersValues => {
    const powerElectronicsMaterialsParam: (PowerElectronicsMaterial & { active: boolean })[] =
        formData[SPECIFIC_PARAMETERS][SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS];
    const powerElectronicsClustersParam: (FormPowerElectronicsCluster & { active: boolean })[] =
        formData[SPECIFIC_PARAMETERS][SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS];
    const nodeCluster: FilterPOJO[] = formData[SPECIFIC_PARAMETERS][NODE_CLUSTER];
    let finalSpecificParameters: Record<string, any> = formData[SPECIFIC_PARAMETERS];
    if (powerElectronicsMaterialsParam && powerElectronicsClustersParam) {
        // create pretty JSON
        finalSpecificParameters[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = JSON.stringify(
            powerElectronicsMaterialsParam
                .filter((sParam) => sParam.active) // keep only active ones
                .map((sParam) => {
                    const { active, ...rest } = sParam; // remove 'active' property
                    return rest;
                })
        );
        finalSpecificParameters[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS] = JSON.stringify(
            powerElectronicsClustersParam.map((sParam) => {
                const { filters, ...rest } = sParam;
                const lightFilters = // keep only id and name in filters for backend
                    filters?.map((filter) => ({
                        filterId: filter[ID],
                        filterName: filter.name,
                    })) ?? [];
                return { ...rest, filters: lightFilters };
            })
        );
    }
    if (nodeCluster) {
        const lightFilters = nodeCluster.map((filter) => {
            return {
                filterId: filter[ID],
                filterName: filter.name
            }
        });
        finalSpecificParameters[NODE_CLUSTER] = JSON.stringify(lightFilters);
    }
    console.log('finalSpecificParameters', finalSpecificParameters);
    return finalSpecificParameters;
};

const formatElectronicsMaterialsParamString = (
    defaultValues: PowerElectronicsMaterial[],
    specificParamValue: string,
    snackError: (message: SnackInputs) => void
) => {
    const electronicsMaterialsArrayInParams: PowerElectronicsMaterial[] = parsePowerElectronicsMaterialsParamString(
        specificParamValue,
        snackError
    );
    return defaultValues.map((material) => {
        const foundInParams = electronicsMaterialsArrayInParams.find((m) => m.type === material.type);
        return foundInParams ? { ...foundInParams, active: true } : { ...material, active: false };
    });
};

const formatElectronicsClustersParamString = (
    defaultValues: PowerElectronicsCluster[],
    specificParamValue: string,
    snackError: (message: SnackInputs) => void
) => {
    const electronicsClustersArrayInParams: (PowerElectronicsCluster & { active: boolean })[] =
        parsePowerElectronicsClustersParamString(specificParamValue, snackError);
    return electronicsClustersArrayInParams.map((cluster) => {
        const { filters, ...rest } = cluster;
        return {
            ...rest,
            filters: filters.map((filter) => ({
                [ID]: filter.filterId,
                [NAME]: filter.filterName, // from back to front -> {id: uuid, name: string}
            })),
        };
    });
};

export const formatShortCircuitSpecificParameters = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[],
    specificParamsList: SpecificParametersValues,
    snackError: (message: SnackInputs) => void
): SpecificParametersValues => {
    if (!specificParamsList) {
        return getDefaultShortCircuitSpecificParamsValues(specificParametersDescriptionForProvider, snackError);
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
                getDefaultShortCircuitSpecificParamsValues([powerParam], snackError)?.[
                    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
                ],
                specificParamsList[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] as string,
                snackError
            );
        } else {
            formatted[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = getDefaultSpecificParamsValues([powerParam])?.[
                SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
            ];
        }
    }

    // handle special power-electronics-clusters case by overriding the generic result
    const powerElectronicsClustersParam = specificParametersDescriptionForProvider.find(
        (p) => p.name === SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTER
    );
    if (powerElectronicsClustersParam) {
        if (Object.hasOwn(specificParamsList, SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS)) {
            formatted[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS] = formatElectronicsClustersParamString(
                getDefaultShortCircuitSpecificParamsValues([powerElectronicsClustersParam], snackError)?.[
                    SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS
                ],
                specificParamsList[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS] as string,
                snackError
            );
        } else {
            formatted[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS] = getDefaultSpecificParamsValues([
                powerElectronicsClustersParam,
            ])?.[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS];
        }
    }
    if (Object.hasOwn(specificParamsList, NODE_CLUSTER)) {
        const filters = JSON.parse(specificParamsList[
            NODE_CLUSTER
            ]);
        formatted[NODE_CLUSTER] = filters.map(
            (filter: { filterId: any; filterName: any }) => ({
                [ID]: filter.filterId,
                [NAME]: filter.filterName, // from back to front -> {id: uuid, name: string}
            })
        );
    } else {
        formatted[NODE_CLUSTER] = [];
    }
    return formatted;
};
