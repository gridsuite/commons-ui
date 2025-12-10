/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    InitialVoltage,
    PredefinedParameters,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_OPTION,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import yup from '../../../utils/yupConfig';
import { COMMON_PARAMETERS, SPECIFIC_PARAMETERS } from '../common';
import { SpecificParameterInfos, SpecificParametersValues } from '../../../utils';
import type { PowerElectronicsMaterial } from './short-circuit-parameters.type';
import { getAllSpecificParametersValues } from '../common/utils';

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

export const getSpecificShortCircuitParameterHelpersFormSchema = (
    specificParameters: SpecificParameterInfos[] | undefined
) => {
    if (!specificParameters) {
        return yup.object().shape({});
    }
    if (Object.hasOwn(specificParameters, SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS)) {
        return yup.object().shape({
            [SHORT_CIRCUIT_POWER_ELECTRONICS_OPTION]: yup.boolean().required(),
            [SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS]: yup
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
                .required(),
        });
    }
    return yup.object().shape({});
};

export const getDefaultShortCircuitSpecificParamsValues = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[]
): SpecificParametersValues => {
    const defaultValues: SpecificParametersValues = {};
    console.log('SBO # getDefaultShortCircuitSpecificParamsValues', specificParametersDescriptionForProvider);
    const powerElectronicsMaterialsParam = specificParametersDescriptionForProvider.find(
        (specificParam) => specificParam.name === SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
    );
    if (powerElectronicsMaterialsParam) {
        console.log(
            `SBO # getDefaultShortCircuitSpecificParamsValues, specificParametersDescriptionForProvider has ${SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS} key`,
            powerElectronicsMaterialsParam.defaultValue,
            powerElectronicsMaterialsParam.defaultValue.join('')
        );
        // try simple repairs then parse
        let repaired = powerElectronicsMaterialsParam.defaultValue.join('');
        // ensure ":" between a quoted key and a number (e.g. `"u0" 97.0` -> `"u0": 97.0`)
        repaired = repaired.replace(/"(\w+)"\s+(-?\d+(\.\d+)?)/g, '"$1": $2');
        // ensure ":" between a quoted key and a quoted value (e.g. `"type" "HVDC"` -> `"type": "HVDC"`)
        repaired = repaired.replace(/"(\w+)"\s+"([A-Za-z0-9_\- ]+)"/g, '"$1": "$2"');
        // add comma between key/value pairs inside an object if missing
        // e.g. `"alpha": 0.9 "u0": 97.0` -> `"alpha": 0.9, "u0": 97.0`
        repaired = repaired.replace(/([0-9]+(?:\.\d+)?|"[^"]*")\s+(")/g, '$1, $2');
        // add comma between adjacent objects if missing (`}{` -> `},{`)
        repaired = repaired.replace(/}\s*{/g, '},{');
        console.log(`SBO # getDefaultShortCircuitSpecificParamsValues, repaired :`, repaired);

        const electronicsMaterialsArray: PowerElectronicsMaterial[] = JSON.parse(repaired);

        defaultValues[SHORT_CIRCUIT_POWER_ELECTRONICS_OPTION] = false;
        defaultValues[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS] = electronicsMaterialsArray.map((material) => ({
            ...material,
            active: false,
        }));
    }
    console.log('SBO # getDefaultShortCircuitSpecificParamsValues result defaultValues', defaultValues);
    return defaultValues;
};

export const getShortCircuitSpecificParametersValues = (
    formData: Record<string, any>,
    _specificParametersValues: SpecificParametersValues
): SpecificParametersValues => {
    console.log('SBO # getShortCircuitSpecificParametersValues, formData:', formData);
    let results: SpecificParametersValues = {};
    const powerElectronicsMaterialsParam: (PowerElectronicsMaterial & { active: boolean })[] =
        formData[SPECIFIC_PARAMETERS][SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS];
    console.log(
        'SBO # getShortCircuitSpecificParametersValues, powerElectronicsMaterialsParam:',
        powerElectronicsMaterialsParam
    );

    if (powerElectronicsMaterialsParam) {
        // create pretty JSON
        const json = JSON.stringify(
            powerElectronicsMaterialsParam.filter((sParam) => sParam.active),
            null,
            2
        );
        console.log('SBO # getShortCircuitSpecificParametersValues, json:', json);
        // split into small tokens similar to the example (keys, numbers, braces, strings)
        const tokens = json.match(/"[^"]*"|[0-9]+(?:\.[0-9]+)?|[\[\]\{\},:]/g);
        // fallback to single-element array if tokenization fails
        console.log('SBO # getShortCircuitSpecificParametersValues, tokens:', tokens);

        results = tokens?.length ? tokens : [json];
    }

    return {
        ...getAllSpecificParametersValues(formData, _specificParametersValues),
        [SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS]: results,
    };
};

export const formatShortCircuitSpecificParameters = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[],
    specificParamsList: SpecificParametersValues
): SpecificParametersValues => {
    if (!specificParamsList) {
        return getDefaultShortCircuitSpecificParamsValues(specificParametersDescriptionForProvider);
    }
    // console.log(`SBO # formatShortCircuitSpecificParameters called with specificParamsList`, specificParamsList);
    // const powerElectronicsMaterialsParam = specificParamsList[SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS];

    // if (powerElectronicsMaterialsParam) {
    //     console.log(
    //         `SBO # formatShortCircuitSpecificParameters, specificParamsList has ${
    //             SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS
    //         } key`,
    //         powerElectronicsMaterialsParam
    //     );
    //     return {
    //         ...specificParamsList,
    //         [SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS]: [JSON.stringify(powerElectronicsMaterialsParam)],
    //     };
    // }
    console.log(`SBO ### formatShortCircuitSpecificParameters, specificParamsList `, specificParamsList);
    return specificParamsList;
};

export const resetSpecificParameters = (
    specificDefaultValues: SpecificParametersValues,
    predefinedParameter: PredefinedParameters
) => {
    if (Object.hasOwn(specificDefaultValues, SHORT_CIRCUIT_ONLY_STARTED_GENERATORS)) {
        return {
            ...specificDefaultValues,
            // Forced to override specificly this param here because its default value depends of the PredefinedParameters value
            [SHORT_CIRCUIT_ONLY_STARTED_GENERATORS]:
                predefinedParameter === PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
            [SHORT_CIRCUIT_POWER_ELECTRONICS_OPTION]: false,
        };
    }
    return { ...specificDefaultValues };
};
