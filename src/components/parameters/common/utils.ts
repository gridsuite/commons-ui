/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UseFormReturn } from 'react-hook-form';
import { ParameterType, SpecificParameterInfos, SpecificParametersPerProvider } from '../../../utils';
import { SPECIFIC_PARAMETERS } from './constant';
import yup from '../../../utils/yupConfig';

export const getSpecificParametersFormSchema = (specificParameters: SpecificParameterInfos[]) => {
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
    specificParams: SpecificParameterInfos[]
): SpecificParametersPerProvider => {
    return specificParams?.reduce((acc: Record<string, any>, param: SpecificParameterInfos) => {
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
    }, {});
};

export const setSpecificParameters = (
    provider: string,
    specificParamsDescriptions: Record<string, SpecificParameterInfos[]> | null,
    formMethods: UseFormReturn
) => {
    const specificParams = provider ? (specificParamsDescriptions?.[provider] ?? []) : [];
    const specificParamsValues = getDefaultSpecificParamsValues(specificParams);
    formMethods.setValue(SPECIFIC_PARAMETERS, specificParamsValues);
};
