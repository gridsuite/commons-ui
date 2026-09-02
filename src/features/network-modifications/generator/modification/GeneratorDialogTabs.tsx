/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { GeneratorDialogTab } from './generatorTabs.utils';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';

interface GeneratorDialogTabsProps {
    tabIndex: number;
    tabIndexesWithError: number[];
    onTabChange: (event: SyntheticEvent<Element, Event>, newValue: number) => void;
}

export function GeneratorDialogTabs({
    tabIndex,
    tabIndexesWithError,
    onTabChange,
}: Readonly<GeneratorDialogTabsProps>) {
    return (
        <Tabs
            value={tabIndex}
            variant="scrollable"
            onChange={onTabChange}
            slotProps={{
                indicator: {
                    sx: getTabIndicatorStyle(tabIndexesWithError, tabIndex),
                },
            }}
        >
            <Tab
                label={<FormattedMessage id="ConnectivityTab" />}
                sx={getTabStyle(tabIndexesWithError, GeneratorDialogTab.CONNECTIVITY_TAB)}
            />
            <Tab
                label={<FormattedMessage id="SetpointsAndLimitsTab" />}
                sx={getTabStyle(tabIndexesWithError, GeneratorDialogTab.SETPOINTS_AND_LIMITS_TAB)}
            />
            <Tab
                label={<FormattedMessage id="SpecificTab" />}
                sx={getTabStyle(tabIndexesWithError, GeneratorDialogTab.SPECIFIC_TAB)}
            />
            <Tab
                label={<FormattedMessage id="AdditionalInformation" />}
                sx={getTabStyle(tabIndexesWithError, GeneratorDialogTab.ADDITIONAL_INFORMATION_TAB)}
            />
        </Tabs>
    );
}
