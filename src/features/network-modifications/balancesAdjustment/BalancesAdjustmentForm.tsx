/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Tab, Tabs, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { UseTabsReturn } from '../../../hooks';
import { tabbedFormStyles } from '../common';
import { getTabIndicatorStyle, getTabStyle } from '../../parameters/parameters-style';
import { BalancesAdjustmentTab } from './balancesAdjustment.constants';
import { BalancesAdjustmentTable } from './BalancesAdjustmentTable';
import { BalancesAdjustmentAdvancedContent } from './BalancesAdjustmentAdvancedContent';

export interface BalancesAdjustmentFormProps {
    countryCodes: string[];
    translate: (countryCode: string) => string;
    useTabsReturn: UseTabsReturn<BalancesAdjustmentTab>;
}

export function BalancesAdjustmentForm({ countryCodes, translate, useTabsReturn }: BalancesAdjustmentFormProps) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <Box>
                <Tabs
                    value={selectedTab}
                    variant="scrollable"
                    onChange={onTabChange}
                    slotProps={{
                        indicator: {
                            sx: getTabIndicatorStyle(tabsWithError, selectedTab),
                        },
                    }}
                >
                    <Tab
                        label={<FormattedMessage id="Areas" />}
                        sx={getTabStyle(tabsWithError, BalancesAdjustmentTab.AREAS_TAB)}
                    />
                    <Tab
                        label={<FormattedMessage id="Advanced" />}
                        sx={getTabStyle(tabsWithError, BalancesAdjustmentTab.ADVANCED_TAB)}
                    />
                </Tabs>
            </Box>
            <Box sx={tabbedFormStyles.scrollableContent}>
                <Box hidden={selectedTab !== BalancesAdjustmentTab.AREAS_TAB}>
                    <BalancesAdjustmentTable countryCodes={countryCodes} translate={translate} />
                </Box>
                <Box hidden={selectedTab !== BalancesAdjustmentTab.ADVANCED_TAB}>
                    <BalancesAdjustmentAdvancedContent countryCodes={countryCodes} translate={translate} />
                </Box>
            </Box>
        </Stack>
    );
}
