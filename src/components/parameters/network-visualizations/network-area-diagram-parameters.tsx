/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
    INIT_NAD_WITH_GEO_DATA,
    NetworkVisualizationTabValues as TabValues,
    PARAM_INIT_NAD_WITH_GEO_DATA,
} from './constants';
import { parametersStyles } from '../parameters-style';
import { SwitchInput } from '../../inputs';

export function NetworkAreaDiagramParameters() {
    return (
        <Grid
            container
            spacing={1}
            sx={parametersStyles.scrollableGrid}
            key="networkAreaDiagramParameters"
            marginTop={-3}
            justifyContent="space-between"
        >
            <Grid item xs={8} sx={parametersStyles.parameterName}>
                <FormattedMessage id={INIT_NAD_WITH_GEO_DATA} />
            </Grid>
            <Grid item container xs={4} sx={parametersStyles.controlItem}>
                <SwitchInput name={`${TabValues.NETWORK_AREA_DIAGRAM}.${PARAM_INIT_NAD_WITH_GEO_DATA}`} />
            </Grid>
        </Grid>
    );
}
