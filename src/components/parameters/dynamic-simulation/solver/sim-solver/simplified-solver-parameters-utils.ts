/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../../utils/yupConfig';
import { SimplifiedSolver } from './simplified-solver-parameters-constant';
import { getFormSchema as getCommonSolverFormSchema } from '../common-solver';

export const getSimplifiedFormSchema = () => {
    return yup.object().shape({
        [SimplifiedSolver.H_MIN]: yup.number().required(),
        [SimplifiedSolver.H_MAX]: yup.number().required(),
        [SimplifiedSolver.K_REDUCE_STEP]: yup.number().required(),
        [SimplifiedSolver.MAX_NEWTON_TRY]: yup.number().integer().required(),
        [SimplifiedSolver.LINEAR_SOLVER_NAME]: yup.string().required(),
        [SimplifiedSolver.F_NORM_TOL]: yup.number().required(),
        [SimplifiedSolver.INITIAL_ADD_TOL]: yup.number().required(),
        [SimplifiedSolver.SC_STEP_TOL]: yup.number().required(),
        [SimplifiedSolver.MX_NEW_T_STEP]: yup.number().required(),
        [SimplifiedSolver.MSBSET]: yup.number().integer().required(),
        [SimplifiedSolver.MX_ITER]: yup.number().integer().required(),
        [SimplifiedSolver.PRINT_FL]: yup.number().integer().required(),
        [SimplifiedSolver.OPTIMIZE_ALGEBRAIC_RESIDUALS_EVALUATIONS]: yup.boolean().required(),
        [SimplifiedSolver.SKIP_NR_IF_INITIAL_GUESS_OK]: yup.boolean().required(),
        [SimplifiedSolver.ENABLE_SILENT_Z]: yup.boolean().required(),
        [SimplifiedSolver.OPTIMIZE_RE_INIT_ALGEBRAIC_RESIDUALS_EVALUATIONS]: yup.boolean().required(),
        [SimplifiedSolver.MINIMUM_MODE_CHANGE_TYPE_FOR_ALGEBRAIC_RESTORATION]: yup.string().required(),
        [SimplifiedSolver.MINIMUM_MODE_CHANGE_TYPE_FOR_ALGEBRAIC_RESTORATION_INIT]: yup.string().required(),
        ...getCommonSolverFormSchema(),
    });
};
