/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { LineSeparator } from '../common';
import {
    CENTER_LABEL,
    COMPONENT_LIBRARY,
    DIAGONAL_LABEL,
    INTL_SUBSTATION_LAYOUT_OPTIONS,
    PARAM_COMPONENT_LIBRARY,
    PARAM_SUBSTATION_LAYOUT,
    SUBSTATION_LAYOUT,
    NetworkVisualizationTabValues as TabValues,
    PARAM_DIAGONAL_LABEL,
    PARAM_CENTER_LABEL,
} from './constants';
import { MuiSelectInput, SwitchInput } from '../../inputs';
import { parametersStyles } from '../parameters-style';

export interface SingleLineDiagramParametersProps {
    componentLibraries: string[];
}

export function SingleLineDiagramParameters({ componentLibraries }: Readonly<SingleLineDiagramParametersProps>) {
    const componentLibsRenderCache = useMemo(
        () => Object.fromEntries(componentLibraries.filter(Boolean).map((libLabel) => [libLabel, libLabel])),
        [componentLibraries]
    );

    // the translation of values
    const substationLayoutOptions = useMemo(() => {
        return INTL_SUBSTATION_LAYOUT_OPTIONS;
    }, []);

    const labelPosition = (name: string, label: string) => (
        <>
            <Grid item xs={8} sx={parametersStyles.parameterName}>
                <FormattedMessage id={label} />
            </Grid>
            <Grid item container xs={4} sx={parametersStyles.controlItem}>
                <SwitchInput name={`${TabValues.SINGLE_LINE_DIAGRAM}.${name}`} />
            </Grid>
        </>
    );
    const substationLineDropDown = (
        <>
            <Grid item xs={8} sx={parametersStyles.parameterName}>
                <FormattedMessage id={SUBSTATION_LAYOUT} />
            </Grid>
            <Grid item xs={4} sx={parametersStyles.controlItem}>
                <MuiSelectInput
                    fullWidth
                    name={`${TabValues.SINGLE_LINE_DIAGRAM}.${PARAM_SUBSTATION_LAYOUT}`}
                    size="small"
                    options={Object.values(substationLayoutOptions)?.map((option) => option)}
                />
            </Grid>
        </>
    );
    const componentLineDropDown = (
        <>
            <Grid item xs={8} sx={parametersStyles.parameterName}>
                <FormattedMessage id={COMPONENT_LIBRARY} />
            </Grid>
            <Grid item xs={4} sx={parametersStyles.controlItem}>
                <MuiSelectInput
                    fullWidth
                    name={`${TabValues.SINGLE_LINE_DIAGRAM}.${PARAM_COMPONENT_LIBRARY}`}
                    size="small"
                    options={Object.values(componentLibsRenderCache)?.map((option) => {
                        return { id: option, label: option };
                    })}
                />
            </Grid>
        </>
    );

    return (
        <Grid
            container
            spacing={1}
            sx={parametersStyles.scrollableGrid}
            key="singleLineDiagramParameters"
            marginTop={-3}
            justifyContent="space-between"
        >
            {labelPosition(PARAM_DIAGONAL_LABEL, DIAGONAL_LABEL)}
            <LineSeparator />
            {labelPosition(PARAM_CENTER_LABEL, CENTER_LABEL)}
            <LineSeparator />
            {substationLineDropDown}
            <LineSeparator />
            {componentLineDropDown}
        </Grid>
    );
}
