/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ParameterType, SpecificParameterInfos } from '../../../../../utils';
import ParameterField from '../../../common/parameter-field';
import { SimplifiedSolver } from './simplified-solver-parameters-constant';
import { CommonSolverParameters } from '../common-solver';

const params: SpecificParameterInfos[] = [
    {
        name: SimplifiedSolver.H_MIN,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverHMin',
    },
    {
        name: SimplifiedSolver.H_MAX,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverHMax',
    },
    {
        name: SimplifiedSolver.K_REDUCE_STEP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverKReduceStep',
    },
    {
        name: SimplifiedSolver.MAX_NEWTON_TRY,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSimplifiedSolverMaxNewtonTry',
    },
    {
        name: SimplifiedSolver.LINEAR_SOLVER_NAME,
        type: ParameterType.STRING,
        label: 'DynamicSimulationSimplifiedSolverLinearSolverName',
    },
    {
        name: SimplifiedSolver.F_NORM_TOL,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverFNormTol',
    },
    {
        name: SimplifiedSolver.INITIAL_ADD_TOL,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverInitialAddTol',
    },
    {
        name: SimplifiedSolver.SC_STEP_TOL,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverScStepTol',
    },
    {
        name: SimplifiedSolver.MX_NEW_T_STEP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationSimplifiedSolverMxNewTStep',
    },
    {
        name: SimplifiedSolver.MSBSET,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSimplifiedSolverMsbset',
    },
    {
        name: SimplifiedSolver.MX_ITER,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSimplifiedSolverMxIter',
    },
    {
        name: SimplifiedSolver.PRINT_FL,
        type: ParameterType.INTEGER,
        label: 'DynamicSimulationSimplifiedSolverPrintFl',
    },
    {
        name: SimplifiedSolver.OPTIMIZE_ALGEBRAIC_RESIDUALS_EVALUATIONS,
        type: ParameterType.BOOLEAN,
        label: 'DynamicSimulationSimplifiedSolverOptimizeAlgebraicResidualsEvaluations',
    },
    {
        name: SimplifiedSolver.SKIP_NR_IF_INITIAL_GUESS_OK,
        type: ParameterType.BOOLEAN,
        label: 'DynamicSimulationSimplifiedSolverSkipNRIfInitialGuessOK',
    },
    {
        name: SimplifiedSolver.ENABLE_SILENT_Z,
        type: ParameterType.BOOLEAN,
        label: 'DynamicSimulationSimplifiedSolverEnableSilentZ',
    },
    {
        name: SimplifiedSolver.OPTIMIZE_RE_INIT_ALGEBRAIC_RESIDUALS_EVALUATIONS,
        type: ParameterType.BOOLEAN,
        label: 'DynamicSimulationSimplifiedSolverOptimizeReInitAlgebraicResidualsEvaluations',
    },
    {
        name: SimplifiedSolver.MINIMUM_MODE_CHANGE_TYPE_FOR_ALGEBRAIC_RESTORATION,
        type: ParameterType.STRING,
        label: 'DynamicSimulationSimplifiedSolverMinimumModeChangeTypeForAlgebraicRestoration',
    },
    {
        name: SimplifiedSolver.MINIMUM_MODE_CHANGE_TYPE_FOR_ALGEBRAIC_RESTORATION_INIT,
        type: ParameterType.STRING,
        label: 'DynamicSimulationSimplifiedSolverMinimumModeChangeTypeForAlgebraicRestorationInit',
    },
];

export function SimplifiedSolverParameters({ path }: { path: string }) {
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
