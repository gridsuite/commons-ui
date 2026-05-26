/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../../utils/yupConfig';
import { CommonSolver } from './common-solver-parameters-constants';

export const getFormSchema = () => {
    return {
        [CommonSolver.F_NORM_TOL_ALG]: yup.number().required(),
        [CommonSolver.INITIAL_ADD_TOL_ALG]: yup.number().required(),
        [CommonSolver.SC_STEP_TOL_ALG]: yup.number().required(),
        [CommonSolver.MX_NEW_T_STEP_ALG]: yup.number().integer().required(),
        [CommonSolver.MSBSET_ALG]: yup.number().integer().required(),
        [CommonSolver.MX_ITER_ALG]: yup.number().integer().required(),
        [CommonSolver.PRINT_FL_ALG]: yup.number().integer().required(),
        [CommonSolver.F_NORM_TOL_ALG_J]: yup.number().required(),
        [CommonSolver.INITIAL_ADD_TOL_ALG_J]: yup.number().required(),
        [CommonSolver.SC_STEP_TOL_ALG_J]: yup.number().required(),
        [CommonSolver.MX_NEW_T_STEP_ALG_J]: yup.number().required(),
        [CommonSolver.MSBSET_ALG_J]: yup.number().integer().required(),
        [CommonSolver.MX_ITER_ALG_J]: yup.number().integer().required(),
        [CommonSolver.PRINT_FL_ALG_J]: yup.number().integer().required(),
        [CommonSolver.F_NORM_TOL_ALG_INIT]: yup.number().required(),
        [CommonSolver.INITIAL_ADD_TOL_ALG_INIT]: yup.number().required(),
        [CommonSolver.SC_STEP_TOL_ALG_INIT]: yup.number().required(),
        [CommonSolver.MX_NEW_T_STEP_ALG_INIT]: yup.number().required(),
        [CommonSolver.MSBSET_ALG_INIT]: yup.number().integer().required(),
        [CommonSolver.MX_ITER_ALG_INIT]: yup.number().integer().required(),
        [CommonSolver.PRINT_FL_ALG_INIT]: yup.number().integer().required(),
        [CommonSolver.MAXIMUM_NUMBER_SLOW_STEP_INCREASE]: yup.number().integer().required(),
        [CommonSolver.MINIMAL_ACCEPTABLE_STEP]: yup.number().required(),
    };
};
