/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../utils/yupConfig';
import { SolverType } from '../../../../utils';
import { Solver } from './solver-parameters-constants';
import { getIdaFormSchema } from './ida-solver';
import { getSimplifiedFormSchema } from './sim-solver';

export const solverFormSchema = yup.object().shape({
    [Solver.SOLVER]: yup.string().required(),
    [Solver.SOLVERS]: yup.array().when([Solver.SOLVER], ([solver], schema) =>
        schema.of(
            yup.lazy((item) => {
                const { type } = item;

                // ignore validation if not current selected solver
                if (solver !== type) {
                    return yup.object().default(undefined);
                }

                // chose the right schema for each type of solver
                if (type === SolverType.IDA) {
                    return getIdaFormSchema();
                }
                return getSimplifiedFormSchema();
            })
        )
    ),
});

export const solverEmptyFormData = {
    [Solver.SOLVER]: '',
    [Solver.SOLVERS]: [],
};
