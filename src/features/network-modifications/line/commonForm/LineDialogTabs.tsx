/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LineDialogTab } from './line.utils';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';

interface LineDialogTabsProps {
    tabIndex: number;
    tabIndexesWithError: number[];
    setTabIndex: (newTabIndex: number) => void;
    isModification?: boolean;
}

export function LineDialogTabs({
    tabIndex,
    tabIndexesWithError,
    setTabIndex,
    isModification = false,
}: Readonly<LineDialogTabsProps>) {
    return (
        <Tabs
            value={tabIndex}
            variant="scrollable"
            onChange={(event: React.SyntheticEvent, newValue: number) => setTabIndex(newValue)}
            TabIndicatorProps={{
                sx: getTabIndicatorStyle(tabIndexesWithError, tabIndex),
            }}
        >
            {!isModification && (
                <Tab
                    value={LineDialogTab.CONNECTIVITY_TAB}
                    label={<FormattedMessage id="ConnectivityTab" />}
                    sx={getTabStyle(tabIndexesWithError, LineDialogTab.CONNECTIVITY_TAB)}
                />
            )}
            <Tab
                value={LineDialogTab.CHARACTERISTICS_TAB}
                label={<FormattedMessage id="CharacteristicsTab" />}
                sx={getTabStyle(tabIndexesWithError, LineDialogTab.CHARACTERISTICS_TAB)}
            />
            <Tab
                value={LineDialogTab.LIMITS_TAB}
                label={<FormattedMessage id="LimitsTab" />}
                sx={getTabStyle(tabIndexesWithError, LineDialogTab.LIMITS_TAB)}
            />
            {isModification && (
                <Tab
                    value={LineDialogTab.STATE_ESTIMATION_TAB}
                    label={<FormattedMessage id="StateEstimationTab" />}
                    sx={getTabStyle(tabIndexesWithError, LineDialogTab.STATE_ESTIMATION_TAB)}
                />
            )}
        </Tabs>
    );
}
