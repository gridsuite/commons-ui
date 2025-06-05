/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid, LinearProgress } from '@mui/material';
import { ReactNode } from 'react';
import { CustomFormProvider } from '../../inputs';
import { parametersStyles } from '../parameters-style';
import ShortCircuitFields from './short-circuit-fields';
import { UseShortCircuitParametersFormReturn } from './use-short-circuit-parameters-form';

interface ShortCircuitParametersFormProps {
    shortCircuitMethods: UseShortCircuitParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
}

export function ShortCircuitParametersForm({
    shortCircuitMethods,
    renderTitleFields,
    renderActions,
}: Readonly<ShortCircuitParametersFormProps>) {
    const { formMethods, formSchema, paramsLoaded, resetAll } = shortCircuitMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <Grid container direction="column">
                <Grid item container direction="column">
                    {renderTitleFields?.()}
                </Grid>
                {paramsLoaded ? (
                    <Grid sx={parametersStyles.scrollableGrid}>
                        <ShortCircuitFields resetAll={resetAll} />
                    </Grid>
                ) : (
                    <LinearProgress />
                )}
                <Grid
                    item
                    container
                    direction="column"
                    sx={{
                        position: 'absolute',
                        bottom: '30px',
                    }}
                >
                    {renderActions?.()}
                </Grid>
            </Grid>
        </CustomFormProvider>
    );
}
