/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { TabValues } from './load-flow-parameters-utils';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { MuiSelectInput } from '../../inputs';
import { PROVIDER, LineSeparator } from '../common';

function LoadFlowParametersHeader({
    selectedTab,
    handleTabChange,
    tabIndexesWithError,
    formattedProviders,
}: Readonly<{
    selectedTab: string;
    handleTabChange: (event: React.SyntheticEvent, newValue: TabValues) => void;
    tabIndexesWithError: TabValues[];
    formattedProviders: { id: string; label: string }[];
}>) {
    return (
        <Box sx={{ flexGrow: 0, paddingLeft: 1, paddingTop: 1 }}>
            <Grid
                container
                spacing={1}
                sx={{
                    padding: 0,
                    paddingBottom: 0,
                    height: 'fit-content',
                }}
                justifyContent="space-between"
            >
                <Grid item xs={5} sx={parametersStyles.parameterName}>
                    <FormattedMessage id="Provider" />
                </Grid>
                <Grid item xs="auto" sx={parametersStyles.controlItem}>
                    <MuiSelectInput
                        data-testid="LfProvider"
                        name={PROVIDER}
                        size="small"
                        options={Object.values(formattedProviders)}
                    />
                </Grid>
                <LineSeparator />
                <Grid item sx={{ width: '100%' }}>
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                        <Tab
                            label={<FormattedMessage id={TabValues.GENERAL} />}
                            value={TabValues.GENERAL}
                            sx={getTabStyle(tabIndexesWithError, TabValues.GENERAL)}
                            data-testid="LfGeneralTab"
                        />
                        <Tab
                            label={<FormattedMessage id={TabValues.LIMIT_REDUCTIONS} />}
                            value={TabValues.LIMIT_REDUCTIONS}
                            sx={getTabStyle(tabIndexesWithError, TabValues.LIMIT_REDUCTIONS)}
                            data-testid="LfLimitReductionsTab"
                        />
                    </Tabs>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LoadFlowParametersHeader;
