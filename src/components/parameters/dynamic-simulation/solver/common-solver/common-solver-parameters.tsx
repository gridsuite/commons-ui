/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ParameterType, SpecificParameterInfos } from '../../../../../utils';
import { CommonSolver } from './common-solver-parameters-constants';
import ParameterField from '../../../common/parameter-field';

const params: SpecificParameterInfos[] = [
    {
        name: CommonSolver.F_NORM_TOL_ALG,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverFNormTolAlg',
    },
    {
        name: CommonSolver.INITIAL_ADD_TOL_ALG,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverInitialAddTolAlg',
    },
    {
        name: CommonSolver.SC_STEP_TOL_ALG,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverScStepTolAlg',
    },
    {
        name: CommonSolver.MX_NEW_T_STEP_ALG,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverMxNewTStepAlg',
    },
    {
        name: CommonSolver.MSBSET_ALG,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMsbsetAlg',
    },
    {
        name: CommonSolver.MX_ITER_ALG,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMxIterAlg',
    },
    {
        name: CommonSolver.PRINT_FL_ALG,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverPrintFlAlg',
    },
    {
        name: CommonSolver.F_NORM_TOL_ALG_J,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverFNormTolAlgJ',
    },
    {
        name: CommonSolver.INITIAL_ADD_TOL_ALG_J,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverInitialAddTolAlgJ',
    },
    {
        name: CommonSolver.SC_STEP_TOL_ALG_J,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverScStepTolAlgJ',
    },
    {
        name: CommonSolver.MX_NEW_T_STEP_ALG_J,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverMxNewTStepAlgJ',
    },
    {
        name: CommonSolver.MSBSET_ALG_J,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMsbsetAlgJ',
    },
    {
        name: CommonSolver.MX_ITER_ALG_J,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMxIterAlgJ',
    },
    {
        name: CommonSolver.PRINT_FL_ALG_J,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverPrintFlAlgJ',
    },
    {
        name: CommonSolver.F_NORM_TOL_ALG_INIT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverFNormTolAlgInit',
    },
    {
        name: CommonSolver.INITIAL_ADD_TOL_ALG_INIT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverInitialAddTolAlgInit',
    },
    {
        name: CommonSolver.SC_STEP_TOL_ALG_INIT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverScStepTolAlgInit',
    },
    {
        name: CommonSolver.MX_NEW_T_STEP_ALG_INIT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverMxNewTStepAlgInit',
    },
    {
        name: CommonSolver.MSBSET_ALG_INIT,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMsbsetAlgInit',
    },
    {
        name: CommonSolver.MX_ITER_ALG_INIT,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMxIterAlgInit',
    },
    {
        name: CommonSolver.PRINT_FL_ALG_INIT,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverPrintFlAlgInit',
    },
    {
        name: CommonSolver.MAXIMUM_NUMBER_SLOW_STEP_INCREASE,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSolverMaximumNumberSlowStepIncrease',
    },
    {
        name: CommonSolver.MINIMAL_ACCEPTABLE_STEP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSolverMinimalAcceptableStep',
    },
];

export function CommonSolverParameters({ path }: Readonly<{ path: string }>) {
    return (
        <>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
        </>
    );
}
