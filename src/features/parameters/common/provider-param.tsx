/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid, SxProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LineSeparator } from './line-separator';
import { parametersStyles } from '../parameters-style';
import { MuiSelectInput } from '../../../components/ui';
import { PROVIDER } from './constants';
import { mergeSx, MuiStyles } from '../../../utils';

export interface ProviderParamProps {
    options: { id: string; label: string }[];
    id?: string;
    sx?: SxProps;
}

const styles = {
    providerParam: {
        padding: 0,
    },
} as const satisfies MuiStyles;

export function ProviderParam({ options, id, sx }: Readonly<ProviderParamProps>) {
    return (
        <Grid container spacing={1} sx={mergeSx(styles.providerParam, sx)} justifyContent="space-between">
            <Grid size="auto" sx={mergeSx(parametersStyles.parameterName, { paddingRight: 2 })}>
                <FormattedMessage id="Provider" />
            </Grid>
            <Grid size="auto" sx={parametersStyles.controlItem}>
                <MuiSelectInput name={PROVIDER} size="small" options={options} data-testid={`${id}Provider`} />
            </Grid>
            <LineSeparator />
        </Grid>
    );
}
