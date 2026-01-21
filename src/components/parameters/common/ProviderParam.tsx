/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LineSeparator } from './line-separator';
import { parametersStyles } from '../parameters-style';
import { MuiSelectInput } from '../../inputs';
import { PROVIDER } from './constant';
import type { MuiStyles } from '../../../utils/styles';

export interface ProviderParamProps {
    options: { id: string; label: string }[];
}

const styles = {
    providerParam: {
        height: 'fit-content',
        justifyContent: 'space-between',
    },
} as const satisfies MuiStyles;

export function ProviderParam({ options }: Readonly<ProviderParamProps>) {
    return (
        <>
            <Grid xl={8} container sx={styles.providerParam} paddingRight={1}>
                <Grid item xs sx={parametersStyles.parameterName}>
                    <FormattedMessage id="Provider" />
                </Grid>
                <Grid item container xs={2} sx={parametersStyles.controlItem}>
                    <MuiSelectInput name={PROVIDER} size="small" fullWidth options={options} />
                </Grid>
            </Grid>
            <Grid container paddingTop={1} paddingRight={1} xl={8}>
                <LineSeparator />
            </Grid>
        </>
    );
}
