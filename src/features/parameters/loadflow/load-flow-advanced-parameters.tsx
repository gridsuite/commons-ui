/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { memo } from 'react';
import ParameterField from '../common/parameter-field';
import {
    DC_POWER_FACTOR,
    DC_USE_TRANSFORMER_RATIO,
    DISTRIBUTED_SLACK,
    READ_SLACK_BUS,
    SHUNT_COMPENSATOR_VOLTAGE_CONTROL_ON,
    TWT_SPLIT_SHUNT_ADMITTANCE,
    USE_REACTIVE_LIMITS,
    VOLTAGE_INIT_MODE,
    WRITE_SLACK_BUS,
} from './constants';
import { ParameterType, SpecificParameterInfos } from '../../../utils/types/parameters.type';
import { ADVANCED_PARAMETERS } from '../common';

export const advancedParams: SpecificParameterInfos[] = [
    {
        name: VOLTAGE_INIT_MODE,
        type: ParameterType.STRING,
        label: 'descLfVoltageInitMode',
        possibleValues: [
            {
                id: 'UNIFORM_VALUES',
                label: 'descLfUniformValues',
            },
            {
                id: 'PREVIOUS_VALUES',
                label: 'descLfPreviousValues',
            },
            {
                id: 'DC_VALUES',
                label: 'descLfDcValues',
            },
        ],
    },
    {
        name: USE_REACTIVE_LIMITS,
        type: ParameterType.BOOLEAN,
        label: 'descLfUseReactiveLimits',
    },
    {
        name: TWT_SPLIT_SHUNT_ADMITTANCE,
        type: ParameterType.BOOLEAN,
        label: 'descLfTwtSplitShuntAdmittance',
    },
    {
        name: READ_SLACK_BUS,
        type: ParameterType.BOOLEAN,
        label: 'descLfReadSlackBus',
    },
    {
        name: WRITE_SLACK_BUS,
        type: ParameterType.BOOLEAN,
        label: 'descLfWriteSlackBus',
    },
    {
        name: DISTRIBUTED_SLACK,
        type: ParameterType.BOOLEAN,
        label: 'descLfDistributedSlack',
    },
    {
        name: SHUNT_COMPENSATOR_VOLTAGE_CONTROL_ON,
        type: ParameterType.BOOLEAN,
        label: 'descLfShuntCompensatorVoltageControlOn',
    },
    {
        name: DC_USE_TRANSFORMER_RATIO,
        type: ParameterType.BOOLEAN,
        label: 'descLfDcUseTransformerRatio',
    },
    {
        name: DC_POWER_FACTOR,
        type: ParameterType.DOUBLE,
        label: 'descLfDcPowerFactor',
    },
];

function LoadFlowAdvancedParameters() {
    return (
        <>
            {advancedParams.map((item) => (
                <ParameterField id={ADVANCED_PARAMETERS} {...item} key={item.name} />
            ))}
        </>
    );
}

export default memo(LoadFlowAdvancedParameters);
