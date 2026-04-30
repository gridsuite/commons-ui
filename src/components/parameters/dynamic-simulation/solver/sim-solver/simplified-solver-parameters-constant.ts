/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export enum SimplifiedSolver {
    H_MIN = 'hMin',
    H_MAX = 'hMax',
    K_REDUCE_STEP = 'kReduceStep',
    MAX_NEWTON_TRY = 'maxNewtonTry',
    LINEAR_SOLVER_NAME = 'linearSolverName',
    F_NORM_TOL = 'fNormTol',
    INITIAL_ADD_TOL = 'initialAddTol',
    SC_STEP_TOL = 'scStepTol',
    MX_NEW_T_STEP = 'mxNewTStep',
    MSBSET = 'msbset',
    MX_ITER = 'mxIter',
    PRINT_FL = 'printFl',
    OPTIMIZE_ALGEBRAIC_RESIDUALS_EVALUATIONS = 'optimizeAlgebraicResidualsEvaluations',
    SKIP_NR_IF_INITIAL_GUESS_OK = 'skipNRIfInitialGuessOK',
    ENABLE_SILENT_Z = 'enableSilentZ',
    OPTIMIZE_RE_INIT_ALGEBRAIC_RESIDUALS_EVALUATIONS = 'optimizeReInitAlgebraicResidualsEvaluations',
    MINIMUM_MODE_CHANGE_TYPE_FOR_ALGEBRAIC_RESTORATION = 'minimumModeChangeTypeForAlgebraicRestoration',
    MINIMUM_MODE_CHANGE_TYPE_FOR_ALGEBRAIC_RESTORATION_INIT = 'minimumModeChangeTypeForAlgebraicRestorationInit',
}
