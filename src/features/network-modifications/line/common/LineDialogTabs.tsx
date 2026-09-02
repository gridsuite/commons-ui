/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LineDialogOptions, LineDialogTab } from './line.utils';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';

interface LineDialogTabsProps extends LineDialogOptions {
    tabIndex: number;
    tabIndexesWithError: number[];
    onTabChange: (event: SyntheticEvent<Element, Event>, newValue: number) => void;
}

export function LineDialogTabs({
    tabIndex,
    tabIndexesWithError,
    onTabChange,
    isModification = false,
    withConnectivity = true,
}: Readonly<LineDialogTabsProps>) {
    return (
        <Tabs
            value={tabIndex}
            variant="scrollable"
            onChange={onTabChange}
            slotProps={{
                indicator: { sx: getTabIndicatorStyle(tabIndexesWithError, tabIndex) },
            }}
        >
            {withConnectivity && (
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
