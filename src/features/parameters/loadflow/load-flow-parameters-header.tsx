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
    disableSpecificProviderParams,
}: Readonly<{
    selectedTab: string;
    handleTabChange: (event: React.SyntheticEvent, newValue: TabValues) => void;
    tabIndexesWithError: TabValues[];
    formattedProviders: { id: string; label: string }[];
    disableSpecificProviderParams: boolean;
}>) {
    return (
        <Stack>
            <ProviderParam options={formattedProviders} id="Lf" />
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
                <Tab
                    label={<FormattedMessage id={TabValues.ADVANCED} />}
                    value={TabValues.ADVANCED}
                    sx={getTabStyle(tabIndexesWithError, TabValues.ADVANCED)}
                    data-testid="LfAdvancedTab"
                />
                <Tab
                    label={<FormattedMessage id={TabValues.PROVIDER_SPECIFIC} />}
                    value={TabValues.PROVIDER_SPECIFIC}
                    sx={getTabStyle(tabIndexesWithError, TabValues.PROVIDER_SPECIFIC)}
                    data-testid="LfProviderSpecificTab"
                    disabled={disableSpecificProviderParams}
                />
            </Tabs>
        </Stack>
    );
}

export default LoadFlowParametersHeader;
