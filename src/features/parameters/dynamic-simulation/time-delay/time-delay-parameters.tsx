/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { ParameterType, SpecificParameterInfos } from '../../../../utils';
import ParameterField from '../../common/parameter-field';
import { TimeDelay } from './time-delay-parameters-constants';

const params: SpecificParameterInfos[] = [
    {
        name: TimeDelay.START_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationStartTime',
    },
    {
        name: TimeDelay.STOP_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationStopTime',
    },
];

export function TimeDelayParameters({ path }: Readonly<{ path: string }>) {
    return (
        <Grid container>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
        </Grid>
    );
}
