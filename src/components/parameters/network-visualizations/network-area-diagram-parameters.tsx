/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import {
    NAD_POSITIONS_GENERATION_MODE_LABEL,
    NAD_POSITIONS_GENERATION_MODE,
    NetworkVisualizationTabValues as TabValues,
    PARAM_NAD_POSITIONS_GENERATION_MODE,
} from './constants';
import { parametersStyles } from '../parameters-style';
import { MuiSelectInput } from '../../inputs';
import { fetchNadPositionsGenerationMode } from '../../../services';

export function NetworkAreaDiagramParameters() {
    const [isNadPositionsProvided, setIsNadPositionsProvided] = useState<boolean>(false);

    useEffect(() => {
        fetchNadPositionsGenerationMode().then(({ enableProvidedNadPositionsGenerationMode }) => {
            setIsNadPositionsProvided(enableProvidedNadPositionsGenerationMode);
        });
    }, []);

    // the translation of values
    const nadPositionsGenerationMode = NAD_POSITIONS_GENERATION_MODE.filter(
        (option) => !(isNadPositionsProvided && option.id === 'PROVIDED')
    );

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
                <FormattedMessage id={NAD_POSITIONS_GENERATION_MODE_LABEL} />
            </Grid>
            <Grid item container xs={4} sx={parametersStyles.controlItem}>
                <MuiSelectInput
                    fullWidth
                    name={`${TabValues.NETWORK_AREA_DIAGRAM}.${PARAM_NAD_POSITIONS_GENERATION_MODE}`}
                    size="small"
                    options={Object.values(nadPositionsGenerationMode)?.map((option) => option)}
                />
            </Grid>
        </Grid>
    );
}
