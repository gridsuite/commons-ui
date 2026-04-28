/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { Network } from './network-parameters-constants';
import { ParameterType, SpecificParameterInfos } from '../../../../utils';
import ParameterField from '../../common/parameter-field';

const params = [
    {
        name: Network.CAPACITOR_NO_RECLOSING_DELAY,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkCapacitorNoReclosingDelay',
    },
    {
        name: Network.BOUNDARY_LINE_CURRENT_LIMIT_MAX_TIME_OPERATION,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkBoundaryLineCurrentLimitMaxTimeOperation',
    },
    {
        name: Network.LINE_CURRENT_LIMIT_MAX_TIME_OPERATION,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLineCurrentLimitMaxTimeOperation',
    },
    {
        name: Network.LOAD_TP,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadTp',
    },
    {
        name: Network.LOAD_TQ,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadTq',
    },
    {
        name: Network.LOAD_ALPHA,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadAlpha',
    },
    {
        name: Network.LOAD_ALPHA_LONG,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadAlphaLong',
    },
    {
        name: Network.LOAD_BETA,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadBeta',
    },
    {
        name: Network.LOAD_BETA_LONG,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadBetaLong',
    },
    {
        name: Network.LOAD_IS_CONTROLLABLE,
        type: ParameterType.BOOLEAN,
        label: 'DynamicSimulationNetworkLoadIsControllable',
    },
    {
        name: Network.LOAD_IS_RESTORATIVE,
        type: ParameterType.BOOLEAN,
        label: 'DynamicSimulationNetworkLoadIsRestorative',
    },
    {
        name: Network.LOAD_Z_PMAX,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadZPMax',
    },
    {
        name: Network.LOAD_Z_QMAX,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkLoadZQMax',
    },
    {
        name: Network.REACTANCE_NO_RECLOSING_DELAY,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkReactanceNoReclosingDelay',
    },
    {
        name: Network.TRANSFORMER_CURRENT_LIMIT_MAX_TIME_OPERATION,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkTransformerCurrentLimitMaxTimeOperation',
    },
    {
        name: Network.TRANSFORMER_T1_ST_HT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkTransformerT1StHT',
    },
    {
        name: Network.TRANSFORMER_T1_ST_THT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkTransformerT1StTHT',
    },
    {
        name: Network.TRANSFORMER_T_NEXT_HT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkTransformerTNextHT',
    },
    {
        name: Network.TRANSFORMER_T_NEXT_THT,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkTransformerTNextTHT',
    },
    {
        name: Network.TRANSFORMER_TO_LV,
        type: ParameterType.DOUBLE,
        label: 'DynamicSimulationNetworkTransformerTolV',
    },
];

export function NetworkParameters({ path }: Readonly<{ path: string }>) {
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
