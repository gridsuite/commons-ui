/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UseFormReturn } from 'react-hook-form';
import {
    ParameterType,
    SpecificParameterInfos,
    SpecificParametersDescription,
    SpecificParametersValues,
} from '../../../utils';
import { SPECIFIC_PARAMETERS } from './constants';
import yup from '../../../utils/yupConfig';

export const getSpecificParametersFormSchema = (specificParameters: SpecificParameterInfos[] | undefined) => {
    const shape: { [key: string]: yup.AnySchema } = {};

    specificParameters?.forEach((param: SpecificParameterInfos) => {
        switch (param.type) {
            case ParameterType.STRING:
                shape[param.name] = yup.string().required();
                break;
            case ParameterType.DOUBLE:
                shape[param.name] = yup.number().required();
                break;
            case ParameterType.INTEGER:
                shape[param.name] = yup.number().required();
                break;
            case ParameterType.BOOLEAN:
                shape[param.name] = yup.boolean().required();
                break;
            case ParameterType.STRING_LIST:
                shape[param.name] = yup.array().of(yup.string()).required();
                break;
            default:
                shape[param.name] = yup.mixed().required();
        }
    });

    return yup.object().shape({
        [SPECIFIC_PARAMETERS]: yup.object().shape(shape),
    });
};

export const getDefaultSpecificParamsValues = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[]
): SpecificParametersValues => {
    return specificParametersDescriptionForProvider.reduce(
        (acc: SpecificParametersValues, param: SpecificParameterInfos) => {
            if (param.type === ParameterType.STRING_LIST && param.defaultValue === null) {
                acc[param.name] = [];
            } else if (
                (param.type === ParameterType.DOUBLE || param.type === ParameterType.INTEGER) &&
                Number.isNaN(Number(param.defaultValue))
            ) {
                acc[param.name] = 0;
            } else {
                acc[param.name] = param.defaultValue;
            }
            return acc;
        },
        {}
    );
};

export const formatSpecificParameters = (
    specificParametersDescriptionForProvider: SpecificParameterInfos[],
    specificParamsList: SpecificParametersValues
): SpecificParametersValues => {
    return specificParametersDescriptionForProvider.reduce(
        (acc: SpecificParametersValues, param: SpecificParameterInfos) => {
            if (specificParamsList && Object.hasOwn(specificParamsList, param.name)) {
                if (param.type === ParameterType.BOOLEAN) {
                    acc[param.name] = specificParamsList[param.name] === 'true';
                } else if (param.type === ParameterType.STRING_LIST) {
                    acc[param.name] =
                        specificParamsList[param.name] === ''
                            ? []
                            : (specificParamsList[param.name] as string).split(',');
                } else {
                    acc[param.name] = specificParamsList[param.name];
                }
            } else {
                acc[param.name] = getDefaultSpecificParamsValues([param])?.[param.name];
            }
            return acc;
        },
        {}
    );
};

export const getAllSpecificParametersValues = (
    formData: Record<string, any>,
    _specificParametersValues: SpecificParametersValues
): SpecificParametersValues => {
    return Object.keys(formData[SPECIFIC_PARAMETERS]).reduce((acc: SpecificParametersValues, key: string) => {
        if (_specificParametersValues[key].toString() !== formData[SPECIFIC_PARAMETERS][key].toString()) {
            acc[key] = formData[SPECIFIC_PARAMETERS][key];
        }
        return acc;
    }, {});
};

export const setSpecificParameters = (
    provider: string,
    specificParamsDescriptions: SpecificParametersDescription | null,
    formMethods: UseFormReturn
) => {
    const specificParams = provider ? (specificParamsDescriptions?.[provider] ?? []) : [];
    const specificParamsValues = getDefaultSpecificParamsValues(specificParams);
    formMethods.setValue(SPECIFIC_PARAMETERS, specificParamsValues);
};
