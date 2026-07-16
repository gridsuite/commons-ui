/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid, Stack, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getTabIndicatorStyle, getTabStyle, parametersStyles } from '../parameters-style';
import { TabPanel } from '../common';
import { UseVoltageInitParametersFormReturn } from './use-voltage-init-parameters-form';
import { VoltageInitTabValues as TabValues } from './constants';
import { GeneralParameters } from './general-parameters';
import { EquipmentSelectionParameters } from './equipment-selection-parameters';
import { VoltageLimitsParameters } from './voltage-limits-parameters';

interface VoltageInitParametersFormProps {
    voltageInitMethods: UseVoltageInitParametersFormReturn;
    showActionsButtons?: boolean;
}

export function VoltageInitParametersForm({
    voltageInitMethods,
    showActionsButtons,
}: Readonly<VoltageInitParametersFormProps>) {
    const { selectedTab, handleTabChange, tabIndexesWithError } = voltageInitMethods;

    return (
        <Stack sx={parametersStyles.scrollableGrid}>
            <Tabs
                value={selectedTab}
                variant="scrollable"
                onChange={handleTabChange}
                slotProps={{
                    indicator: {
                        sx: getTabIndicatorStyle(tabIndexesWithError, selectedTab),
                    },
                }}
            >
                <Tab
                    label={<FormattedMessage id="VoltageInitParametersGeneralTabLabel" />}
                    value={TabValues.GENERAL}
                    sx={getTabStyle(tabIndexesWithError, TabValues.GENERAL)}
                />
                <Tab
                    label={<FormattedMessage id="VoltageLimits" />}
                    value={TabValues.VOLTAGE_LIMITS}
                    sx={getTabStyle(tabIndexesWithError, TabValues.VOLTAGE_LIMITS)}
                />
                <Tab
                    label={<FormattedMessage id="EquipmentSelection" />}
                    value={TabValues.EQUIPMENTS_SELECTION}
                    sx={getTabStyle(tabIndexesWithError, TabValues.EQUIPMENTS_SELECTION)}
                />
            </Tabs>
            <Grid container>
                <TabPanel value={selectedTab} index={TabValues.GENERAL}>
                    <GeneralParameters withApplyModifications={!!showActionsButtons} />
                </TabPanel>
                <TabPanel value={selectedTab} index={TabValues.VOLTAGE_LIMITS}>
                    <VoltageLimitsParameters />
                </TabPanel>
                <TabPanel value={selectedTab} index={TabValues.EQUIPMENTS_SELECTION}>
                    <EquipmentSelectionParameters />
                </TabPanel>
            </Grid>
        </Stack>
    );
}
