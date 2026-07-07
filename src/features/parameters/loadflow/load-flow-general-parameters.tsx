/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { memo } from 'react';
import ParameterField from '../common/parameter-field';
import {
    BALANCE_TYPE,
    CONNECTED_MODE,
    COUNTRIES_TO_BALANCE,
    DC,
    HVDC_AC_EMULATION,
    PHASE_SHIFTER_REGULATION_ON,
} from './constants';
import { ParameterType, SpecificParameterInfos } from '../../../utils/types/parameters.type';
import { COMMON_PARAMETERS } from '../common';

const basicParams: SpecificParameterInfos[] = [
    {
        name: PHASE_SHIFTER_REGULATION_ON,
        type: ParameterType.BOOLEAN,
        label: 'descLfPhaseShifterRegulationOn',
    },
    {
        name: DC,
        type: ParameterType.BOOLEAN,
        label: 'descLfDC',
    },
    {
        name: BALANCE_TYPE,
        type: ParameterType.STRING,
        label: 'descLfBalanceType',
        possibleValues: [
            { id: 'PROPORTIONAL_TO_GENERATION_P', label: 'descLfBalanceTypeGenP' },
            { id: 'PROPORTIONAL_TO_GENERATION_P_MAX', label: 'descLfBalanceTypeGenPMax' },
            { id: 'PROPORTIONAL_TO_LOAD', label: 'descLfBalanceTypeLoad' },
            { id: 'PROPORTIONAL_TO_CONFORM_LOAD', label: 'descLfBalanceTypeConformLoad' },
        ],
    },
    {
        name: COUNTRIES_TO_BALANCE,
        type: ParameterType.COUNTRIES,
        label: 'descLfCountriesToBalance',
    },
    {
        name: CONNECTED_MODE,
        type: ParameterType.STRING,
        label: 'descLfConnectedComponentMode',
        possibleValues: [
            {
                id: 'MAIN_SYNCHRONOUS',
                label: 'descLfConnectedComponentModeMainSync',
            },
            {
                id: 'MAIN_CONNECTED',
                label: 'descLfConnectedComponentModeMainConnected',
            },
            {
                id: 'ALL_CONNECTED',
                label: 'descLfConnectedComponentModeAll',
            },
        ],
    },
    {
        name: HVDC_AC_EMULATION,
        type: ParameterType.BOOLEAN,
        label: 'descLfHvdcAcEmulation',
    },
];

function LoadFlowGeneralParameters() {
    return (
        <>
            {basicParams.map((item) => (
                <ParameterField id={COMMON_PARAMETERS} {...item} key={item.name} />
            ))}
        </>
    );
}

export default memo(LoadFlowGeneralParameters);
