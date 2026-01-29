/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../utils/yupConfig';
import {
    ACCURACY,
    CALCULATION_TYPE,
    LOAD_INCREASE_START_TIME,
    LOAD_INCREASE_STOP_TIME,
    LOAD_MODELS_RULE,
    LOADS_VARIATIONS,
    MARGIN_CALCULATION_START_TIME,
} from './constants';
import { ID, ParameterType, SpecificParameterInfos } from '../../../utils';
import ParameterField from '../common/parameter-field';
import { NAME } from '../../inputs';
import { CalculationType, LoadModelsRule } from '../../../services';

export const formSchema = yup.object().shape({
    [MARGIN_CALCULATION_START_TIME]: yup.number().required(),
    [LOAD_INCREASE_START_TIME]: yup.number().required(),
    [LOAD_INCREASE_STOP_TIME]: yup.number().required(),
    [CALCULATION_TYPE]: yup.string().required(),
    [ACCURACY]: yup.number().required(),
    [LOAD_MODELS_RULE]: yup.string().required(),
    [LOADS_VARIATIONS]: yup
        .array()
        .of(
            yup.object().shape({
                [ID]: yup.string().required(),
                [NAME]: yup.string().required(),
            })
        )
        .required(),
});

export const emptyFormData = {
    [MARGIN_CALCULATION_START_TIME]: 0,
    [LOAD_INCREASE_START_TIME]: 0,
    [LOAD_INCREASE_STOP_TIME]: 0,
    [CALCULATION_TYPE]: '',
    [ACCURACY]: 0,
    [LOAD_MODELS_RULE]: '',
    [LOADS_VARIATIONS]: [],
};

const params: SpecificParameterInfos[] = [
    {
        name: MARGIN_CALCULATION_START_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationMarginCalculationStartTime',
    },
    {
        name: LOAD_INCREASE_START_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationLoadIncreaseStartTime',
    },
    {
        name: LOAD_INCREASE_STOP_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationLoadIncreaseStopTime',
    },
    {
        name: CALCULATION_TYPE,
        type: ParameterType.STRING,
        label: 'DynamicMarginCalculationCalculationType',
        possibleValues: [
            { id: CalculationType.GLOBAL_MARGIN, label: 'DynamicMarginCalculationCalculationTypeGlobalMargin' },
            { id: CalculationType.LOCAL_MARGIN, label: 'DynamicMarginCalculationCalculationTypeLocalMargin' },
        ],
    },
    {
        name: ACCURACY,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationAccuracy',
    },
    {
        name: LOAD_MODELS_RULE,
        type: ParameterType.STRING,
        label: 'DynamicMarginCalculationLoadModelsRule',
        possibleValues: [
            { id: LoadModelsRule.ALL_LOADS, label: 'DynamicMarginCalculationLoadModelsRuleAllLoads' },
            { id: LoadModelsRule.TARGETED_LOADS, label: 'DynamicMarginCalculationLoadModelsRuleTargetedLoads' },
        ],
    },
    // TAB_LOADS_VARIATIONS is not yet displayed
];

export default function LoadsVariationsParameters({ path }: { path: string }) {
    return params.map((param: SpecificParameterInfos) => {
        const { name, type, ...otherParams } = param;
        return <ParameterField id={path} name={param.name} type={param.type} {...otherParams} />;
    });
}
