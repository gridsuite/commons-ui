/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { TabValues } from './load-flow-parameters-utils';
import { getTabStyle } from '../parameters-style';
import { ProviderParam } from '../common';

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
        <Stack>
            <ProviderParam options={formattedProviders} id="Lf" />
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab
                    label={<FormattedMessage id={TabValues.GENERAL} />}
                    value={TabValues.GENERAL}
                    sx={getTabStyle(tabIndexesWithError, TabValues.GENERAL, selectedTab)}
                    data-testid="LfGeneralTab"
                />
                <Tab
                    label={<FormattedMessage id={TabValues.LIMIT_REDUCTIONS} />}
                    value={TabValues.LIMIT_REDUCTIONS}
                    sx={getTabStyle(tabIndexesWithError, TabValues.LIMIT_REDUCTIONS, selectedTab)}
                    data-testid="LfLimitReductionsTab"
                />
            </Tabs>
        </Stack>
    );
}

export default LoadFlowParametersHeader;
