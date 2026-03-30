/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';
import { VoltageLevelTab } from './voltageLevel.constants';

interface VoltageLevelCreationTabsProps {
    tabIndex: number;
    tabIndexesWithError: number[];
    setTabIndex: (newTabIndex: number) => void;
}

export function VoltageLevelCreationTabs({
    tabIndex,
    tabIndexesWithError,
    setTabIndex,
}: Readonly<VoltageLevelCreationTabsProps>) {
    return (
        <Tabs
            value={tabIndex}
            variant="scrollable"
            onChange={(_, newValue) => setTabIndex(newValue)}
            TabIndicatorProps={{
                sx: getTabIndicatorStyle(tabIndexesWithError, tabIndex),
            }}
        >
            <Tab
                label={<FormattedMessage id="ConnectivityTab" />}
                sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.SUBSTATION_TAB)}
            />
            <Tab
                label={<FormattedMessage id="CharacteristicsTab" />}
                sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.CHARACTERISTICS_TAB)}
            />
            <Tab
                label={<FormattedMessage id="StructureTab" />}
                sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.STRUCTURE_TAB)}
            />
            <Tab
                label={<FormattedMessage id="AdditionalInformationTab" />}
                sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.ADDITIONAL_INFORMATION_TAB)}
            />
        </Tabs>
    );
}
