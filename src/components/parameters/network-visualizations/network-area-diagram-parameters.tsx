/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import {
    NAD_POSITIONS_GENERATION_MODE_LABEL,
    NAD_POSITIONS_GENERATION_MODE,
    NetworkVisualizationTabValues as TabValues,
    PARAM_NAD_POSITIONS_GENERATION_MODE,
} from './constants';
import { parametersStyles } from '../parameters-style';
import { MuiSelectInput } from '../../inputs';

export function NetworkAreaDiagramParameters() {
    const {
        formState: { errors },
    } = useFormContext();
    const fieldError = errors?.[TabValues.NETWORK_AREA_DIAGRAM]?.[
        PARAM_NAD_POSITIONS_GENERATION_MODE as keyof (typeof errors)[TabValues.NETWORK_AREA_DIAGRAM]
    ] as { message?: string } | undefined;

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
                    options={Object.values(NAD_POSITIONS_GENERATION_MODE)?.map((option) => option)}
                    error={!!fieldError}
                    helperText={fieldError?.message}
                />
            </Grid>
        </Grid>
    );
}
