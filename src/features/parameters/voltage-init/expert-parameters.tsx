/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
    EXPERT,
    PENALTY_ACTIVE_POWER,
    PENALTY_INVEST_REA_NEG,
    PENALTY_INVEST_REA_POS,
    PENALTY_UNITS_REACTIVE,
} from './constants';
import { ParameterFloat } from '../common';
import { parametersStyles } from '../parameters-style';

export function ExpertParameters() {
    return (
        <Grid>
            <Typography component="span" variant="h6">
                <FormattedMessage id="objectiveFunctionWeights" />
            </Typography>
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_INVEST_REA_POS}`}
                style={parametersStyles.parameterName}
                label="PenaltyInvestReaPos"
                labelSize={8}
                inputSize={4}
            />
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_INVEST_REA_NEG}`}
                style={parametersStyles.parameterName}
                label="PenaltyInvestReaNeg"
                labelSize={8}
                inputSize={4}
            />
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_ACTIVE_POWER}`}
                style={parametersStyles.parameterName}
                label="PenaltyActivePower"
                labelSize={8}
                inputSize={4}
            />
            <ParameterFloat
                name={`${EXPERT}.${PENALTY_UNITS_REACTIVE}`}
                style={parametersStyles.parameterName}
                label="PenaltyUnitsReactive"
                labelSize={8}
                inputSize={4}
            />
        </Grid>
    );
}
