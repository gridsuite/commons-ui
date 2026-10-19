/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';

import {
    EXPERT,
    PENALTY_ACTIVE_POWER,
    PENALTY_INVEST_REA_NEG,
    PENALTY_INVEST_REA_POS,
    PENALTY_UNITS_REACTIVE,
} from './constants';
import { ParameterFloat } from '../common';
import { parametersStyles } from '../parameters-style';
import { ActivePowerAdornment, ReactivePowerAdornment } from '../../../utils/constants/adornments';

export function ExpertParameters() {
    return (
        <Grid>
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_INVEST_REA_POS}`}
                style={parametersStyles.parameterName}
                label="PenaltyInvestReaPos"
                adornment={ActivePowerAdornment}
                labelSize={8}
                inputSize={4}
            />
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_INVEST_REA_NEG}`}
                style={parametersStyles.parameterName}
                label="PenaltyInvestReaNeg"
                adornment={ReactivePowerAdornment}
                labelSize={8}
                inputSize={4}
            />
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_ACTIVE_POWER}`}
                style={parametersStyles.parameterName}
                label="PenaltyActivePower"
                adornment={ActivePowerAdornment}
                labelSize={8}
                inputSize={4}
            />
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_UNITS_REACTIVE}`}
                style={parametersStyles.parameterName}
                label="PenaltyUnitsReactive"
                adornment={ReactivePowerAdornment}
                labelSize={8}
                inputSize={4}
            />
        </Grid>
    );
}
