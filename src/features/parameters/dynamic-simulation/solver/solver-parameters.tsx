/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, SxProps } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SolverType } from '../../../../utils/types/dynamic-simulation.type';
import ParameterField from '../../common/parameter-field';
import { ParameterType, SpecificParameterInfos } from '../../../../utils/types/parameters.type';
import { Solver } from './solver-parameters-constants';
import { IdaSolverParameters } from './ida-solver';
import { SimplifiedSolverParameters } from './sim-solver';
import { TabPanel } from '../../common/parameters';

const solvers = [SolverType.IDA, SolverType.SIM];
const solverOptions = solvers.map((elem) => ({ id: elem, label: `DynamicSimulationSolver${elem}` }));

interface SolverParametersProps {
    path: string;
}

export function SolverParameters({ path }: Readonly<SolverParametersProps>) {
    const { clearErrors, subscribe } = useFormContext();
    const solverPath = `${path}.${Solver.SOLVER}`;
    const selectedSolver = useWatch({ name: solverPath });

    useEffect(() => {
        const unsubscribe = subscribe({
            name: solverPath,
            formState: {
                values: true,
            },
            callback: () => {
                clearErrors(path);
            },
        });
        return () => unsubscribe();
    }, [clearErrors, subscribe, solverPath, path]);

    const params: (SpecificParameterInfos & { sx?: SxProps })[] = [
        {
            name: Solver.SOLVER,
            type: ParameterType.STRING,
            label: 'DynamicSimulationSolverType',
            possibleValues: solverOptions,
            sx: { width: '100%' },
        },
    ];

    return (
        <Grid container>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
            <TabPanel value={selectedSolver} index={SolverType.IDA}>
                <IdaSolverParameters path={`${path}.${Solver.SOLVERS}[0]`} />
            </TabPanel>
            <TabPanel value={selectedSolver} index={SolverType.SIM}>
                <SimplifiedSolverParameters path={`${path}.${Solver.SOLVERS}[1]`} />
            </TabPanel>
        </Grid>
    );
}
