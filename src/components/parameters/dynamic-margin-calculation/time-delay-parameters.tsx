/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yup from '../../../utils/yupConfig';
import {
    LOAD_INCREASE_START_TIME,
    LOAD_INCREASE_STOP_TIME,
    MARGIN_CALCULATION_START_TIME,
    START_TIME,
    STOP_TIME,
} from './constants';
import { ParameterType, SpecificParameterInfos } from '../../../utils';
import ParameterField from '../common/parameter-field';

export const formSchema = yup.object().shape({
    [START_TIME]: yup.number().required(),
    [STOP_TIME]: yup.number().required(),
    [MARGIN_CALCULATION_START_TIME]: yup.number().required(),
    [LOAD_INCREASE_START_TIME]: yup.number().required(),
    [LOAD_INCREASE_STOP_TIME]: yup.number().required(),
});

export const emptyFormData = {
    [START_TIME]: 0,
    [STOP_TIME]: 0,
    [MARGIN_CALCULATION_START_TIME]: 0,
    [LOAD_INCREASE_START_TIME]: 0,
    [LOAD_INCREASE_STOP_TIME]: 0,
};

const params: SpecificParameterInfos[] = [
    {
        name: START_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationStartTime',
    },
    {
        name: STOP_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationStopTime',
    },
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
];

export default function TimeDelayParameters({ path }: { path: string }) {
    return params.map((param: SpecificParameterInfos) => {
        const { name, type, ...otherParams } = param;
        return <ParameterField id={path} name={param.name} type={param.type} {...otherParams} />;
    });
}
