/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { UseShortCircuitParametersFormReturn } from './use-short-circuit-parameters-form';
import ShortCircuitParametersContent from './short-circuit-parameters-content';
import { parametersStyles } from '../parameters-style';

interface ShortCircuitParametersFormProps {
    shortCircuitMethods: UseShortCircuitParametersFormReturn;
}

export function ShortCircuitParametersForm({ shortCircuitMethods }: Readonly<ShortCircuitParametersFormProps>) {
    return (
        <Grid container sx={parametersStyles.scrollableGrid}>
            <ShortCircuitParametersContent shortCircuitMethods={shortCircuitMethods} />
        </Grid>
    );
}
