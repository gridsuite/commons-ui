/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yup from '../../../utils/yupConfig';
import { START_TIME, STOP_TIME } from './constants';
import { ParameterType, SpecificParameterInfos } from '../../../utils';
import ParameterField from '../common/parameter-field';

export const formSchema = yup.object().shape({
    [START_TIME]: yup.number().required(),
    [STOP_TIME]: yup.number().required(),
});

export const emptyFormData = {
    [START_TIME]: 0,
    [STOP_TIME]: 0,
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
];

export default function TimeDelayParameters({ path }: { path: string }) {
    return params.map((param: SpecificParameterInfos) => {
        const { name, type, ...otherParams } = param;
        return <ParameterField id={param.name} name={`${path}.${param.name}`} type={param.type} {...otherParams} />;
    });
}
