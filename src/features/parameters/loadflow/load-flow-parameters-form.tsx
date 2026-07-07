/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { UseLoadFlowParametersFormReturn } from './use-load-flow-parameters-form';
import LoadFlowParametersHeader from './load-flow-parameters-header';
import LoadFlowParametersContent from './load-flow-parameters-content';
import { parametersStyles } from '../parameters-style';

interface LoadFlowParametersFormProps {
    loadflowMethods: UseLoadFlowParametersFormReturn;
}

export function LoadFlowParametersForm({ loadflowMethods }: Readonly<LoadFlowParametersFormProps>) {
    const {
        selectedTab,
        handleTabChange,
        tabIndexesWithError,
        formattedProviders,
        specificParametersDescriptionForProvider,
        params,
        watchProvider,
        defaultLimitReductions,
    } = loadflowMethods;

    return (
        <Grid container sx={parametersStyles.scrollableGrid}>
            <Grid size={12}>
                <LoadFlowParametersHeader
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}
                    tabIndexesWithError={tabIndexesWithError}
                    formattedProviders={formattedProviders}
                />
            </Grid>
            <Grid size={12}>
                <LoadFlowParametersContent
                    selectedTab={selectedTab}
                    currentProvider={watchProvider ?? ''}
                    specificParameters={specificParametersDescriptionForProvider}
                    params={params}
                    defaultLimitReductions={defaultLimitReductions}
                />
            </Grid>
        </Grid>
    );
}
