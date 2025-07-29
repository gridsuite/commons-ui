/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useMemo } from 'react';
import {
    INIT_NAD_WITH_GEO_DATA,
    NAD_GENERATION_MODE_OPTIONS,
    NetworkVisualizationTabValues as TabValues,
    PARAM_NAD_GENERATION_MODE,
} from './constants';
import { parametersStyles } from '../parameters-style';
import { MuiSelectInput } from '../../inputs';
import { useNadeGenerationMode } from '../../../hooks/useNadGenerationMode';

export function NetworkAreaDiagramParameters() {
    const { nadMode } = useNadeGenerationMode();
    // the translation of values
    const nadGenerationModeOptions = useMemo(() => {
        return [
            ...NAD_GENERATION_MODE_OPTIONS,
            {
                id: nadMode,
                label: nadMode,
            },
        ];
    }, [nadMode]);

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
                <MuiSelectInput
                    fullWidth
                    name={`${TabValues.NETWORK_AREA_DIAGRAM}.${PARAM_NAD_GENERATION_MODE}`}
                    size="small"
                    options={Object.values(nadGenerationModeOptions)?.map((option) => option)}
                />
            </Grid>
        </Grid>
    );
}
