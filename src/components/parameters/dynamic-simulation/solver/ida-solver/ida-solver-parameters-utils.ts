/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../../utils/yupConfig';
import { IdaSolver } from './ida-solver-parameters-constants';
import { getFormSchema as getCommonSolverFormSchema } from '../common-solver';

export const getIdaFormSchema = () =>
    yup.object().shape({
        [IdaSolver.ORDER]: yup
            .number()
            .integer()
            .oneOf([1, 2], 'DynamicSimulationIDASolverOrderMustBeOneOfValues')
            .required(),
        [IdaSolver.INIT_STEP]: yup.number().required(),
        [IdaSolver.MIN_STEP]: yup.number().required(),
        [IdaSolver.MAX_STEP]: yup.number().required(),
        [IdaSolver.ABS_ACCURACY]: yup.number().required(),
        [IdaSolver.REL_ACCURACY]: yup.number().required(),
        ...getCommonSolverFormSchema(),
    });
