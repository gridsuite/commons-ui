/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
    INTL_LINE_FLOW_MODE_OPTIONS,
    INTL_MAP_BASE_MAP_OPTIONS,
    LINE_FLOW_MODE,
    MAP_BASE_MAP,
    MAP_MANUAL_REFRESH,
    PARAM_LINE_FULL_PATH,
    PARAM_MAP_BASEMAP,
    NetworkVisualizationTabValues as TabValues,
    PARAM_LINE_PARALLEL_PATH,
    PARAM_LINE_FLOW_MODE,
    PARAM_MAP_MANUAL_REFRESH,
    LineFlowMode,
} from './constants';
import { LineSeparator } from '../common';
import { parametersStyles } from '../parameters-style';
import { MuiSelectInput, SwitchInput } from '../../inputs';

export function MapParameters() {
    // fields definition
    const lineSwitch = (name: string, label: string) => (
        <>
            <Grid item xs={8} sx={parametersStyles.parameterName}>
                <FormattedMessage id={label} />
            </Grid>
            <Grid item container xs={4} sx={parametersStyles.controlItem}>
                <SwitchInput name={`${TabValues.MAP}.${name}`} />
            </Grid>
        </>
    );

    const lineFlow = (name: string, label: string, options: { id: LineFlowMode; label: string }[]) => (
        <>
            <Grid item xs={5} sx={parametersStyles.parameterName}>
                <FormattedMessage id={label} />
            </Grid>
            <Grid item xs={4} sx={parametersStyles.controlItem}>
                <MuiSelectInput
                    fullWidth
                    name={`${TabValues.MAP}.${name}`}
                    size="small"
                    options={Object.values(options)?.map((option) => option)}
                />
            </Grid>
        </>
    );

    const mapBaseMap = (
        <>
            <Grid item xs={5} sx={parametersStyles.parameterName}>
                <FormattedMessage id={MAP_BASE_MAP} />
            </Grid>
            <Grid item xs={4} sx={parametersStyles.controlItem}>
                <MuiSelectInput
                    fullWidth
                    name={`${TabValues.MAP}.${PARAM_MAP_BASEMAP}`}
                    size="small"
                    options={Object.values(INTL_MAP_BASE_MAP_OPTIONS)?.map((option) => option)}
                />
            </Grid>
        </>
    );

    return (
        <Grid
            xl={6}
            container
            spacing={1}
            sx={parametersStyles.scrollableGrid}
            key="mapParameters"
            marginTop={-3}
            justifyContent="space-between"
        >
            {lineSwitch(PARAM_LINE_FULL_PATH, PARAM_LINE_FULL_PATH)}
            <LineSeparator />

            {lineSwitch(PARAM_LINE_PARALLEL_PATH, PARAM_LINE_PARALLEL_PATH)}
            <LineSeparator />

            {lineFlow(PARAM_LINE_FLOW_MODE, LINE_FLOW_MODE, INTL_LINE_FLOW_MODE_OPTIONS)}
            <LineSeparator />

            {lineSwitch(PARAM_MAP_MANUAL_REFRESH, MAP_MANUAL_REFRESH)}
            <LineSeparator />
            {mapBaseMap}
        </Grid>
    );
}
