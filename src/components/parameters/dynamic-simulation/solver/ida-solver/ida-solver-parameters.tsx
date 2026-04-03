/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CommonSolverParameters } from '../common-solver';
import { ParameterType, SpecificParameterInfos } from '../../../../../utils';
import ParameterField from '../../../common/parameter-field';
import { IdaSolver } from './ida-solver-parameters-constants';

const params: SpecificParameterInfos[] = [
    {
        name: IdaSolver.ORDER,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationIDASolverOrder',
    },
    {
        name: IdaSolver.INIT_STEP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationIDASolverInitStep',
    },
    {
        name: IdaSolver.MIN_STEP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationIDASolverMinStep',
    },
    {
        name: IdaSolver.MAX_STEP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationIDASolverMaxStep',
    },
    {
        name: IdaSolver.ABS_ACCURACY,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationIDASolverAbsAccuracy',
    },
    {
        name: IdaSolver.REL_ACCURACY,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationIDASolverRelAccuracy',
    },
];

export function IdaSolverParameters({ path }: { path: string }) {
    return (
        <>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
            <CommonSolverParameters path={path} />
        </>
    );
}
