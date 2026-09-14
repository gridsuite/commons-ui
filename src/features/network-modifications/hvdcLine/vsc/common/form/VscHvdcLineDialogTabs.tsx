/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { VscHvdcLineDialogTab } from './vscHvdcLine.utils';
import { getTabIndicatorStyle, getTabStyle } from '../../../../../parameters';

interface VscHvdcLineDialogTabsProps {
    tabIndex: number;
    tabIndexesWithError: number[];
    onTabChange: (event: SyntheticEvent<Element, Event>, newValue: number) => void;
    isModification?: boolean;
}

export function VscHvdcLineDialogTabs({
    tabIndex,
    tabIndexesWithError,
    onTabChange,
    isModification = false,
}: Readonly<VscHvdcLineDialogTabsProps>) {
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
                value={VscHvdcLineDialogTab.HVDC_LINE_TAB}
                label={<FormattedMessage id="HvdcLineTab" />}
                sx={getTabStyle(tabIndexesWithError, VscHvdcLineDialogTab.HVDC_LINE_TAB)}
            />
            <Tab
                value={VscHvdcLineDialogTab.CONVERTER_STATION_1_TAB}
                label={<FormattedMessage id="ConverterStation1Tab" />}
                sx={getTabStyle(tabIndexesWithError, VscHvdcLineDialogTab.CONVERTER_STATION_1_TAB)}
            />
            <Tab
                value={VscHvdcLineDialogTab.CONVERTER_STATION_2_TAB}
                label={<FormattedMessage id="ConverterStation2Tab" />}
                sx={getTabStyle(tabIndexesWithError, VscHvdcLineDialogTab.CONVERTER_STATION_2_TAB)}
            />
            {isModification && (
                <Tab
                    value={VscHvdcLineDialogTab.STATE_ESTIMATION_TAB}
                    label={<FormattedMessage id="StateEstimationTab" />}
                    sx={getTabStyle(tabIndexesWithError, VscHvdcLineDialogTab.STATE_ESTIMATION_TAB)}
                />
            )}
        </Tabs>
    );
}
