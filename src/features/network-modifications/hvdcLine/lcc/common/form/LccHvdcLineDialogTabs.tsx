/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LccHvdcLineDialogTab } from '../lccHvdcLine.types';
import { getTabIndicatorStyle, getTabStyle } from '../../../../../parameters';

interface LccCreationDialogTabsProps {
    tabIndex: number;
    tabIndexesWithError: number[];
    onTabChange: (event: SyntheticEvent<Element, Event>, newValue: number) => void;
}

export function LccHvdcLineDialogTabs({
    tabIndex,
    tabIndexesWithError,
    onTabChange,
}: Readonly<LccCreationDialogTabsProps>) {
    return (
        <Tabs
            value={tabIndex}
            variant="scrollable"
            onChange={onTabChange}
            slotProps={{
                indicator: { sx: getTabIndicatorStyle(tabIndexesWithError, tabIndex) },
            }}
        >
            <Tab
                value={LccHvdcLineDialogTab.HVDC_LINE_TAB}
                label={<FormattedMessage id="HVDC_LINE" />}
                sx={getTabStyle(tabIndexesWithError, LccHvdcLineDialogTab.HVDC_LINE_TAB)}
            />
            <Tab
                value={LccHvdcLineDialogTab.CONVERTER_STATION_1_TAB}
                label={<FormattedMessage id="converterStation1" />}
                sx={getTabStyle(tabIndexesWithError, LccHvdcLineDialogTab.CONVERTER_STATION_1_TAB)}
            />
            <Tab
                value={LccHvdcLineDialogTab.CONVERTER_STATION_2_TAB}
                label={<FormattedMessage id="converterStation2" />}
                sx={getTabStyle(tabIndexesWithError, LccHvdcLineDialogTab.CONVERTER_STATION_2_TAB)}
            />
        </Tabs>
    );
}
