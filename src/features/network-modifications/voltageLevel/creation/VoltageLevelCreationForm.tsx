/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Tab, Tabs, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { TextInput } from '../../../../components/ui';
import { FieldConstants } from '../../../../utils';
import { VoltageLevelTab } from './voltageLevel.constants';
import { CharacteristicsTab, StructureTab, SubstationTab } from './tabs';
import { filledTextField, PropertiesForm } from '../../common';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';
import { UseTabsReturn } from '../../../../hooks';

export interface VoltageLevelCreationFormProps {
    substationOptions?: string[];
    showDeleteSubstationButton?: boolean;
    useTabsReturn: UseTabsReturn<VoltageLevelTab>;
}

export function VoltageLevelCreationForm({
    substationOptions,
    showDeleteSubstationButton = true,
    useTabsReturn,
}: VoltageLevelCreationFormProps) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    const watchHideBusBarSection = useWatch({ name: FieldConstants.HIDE_BUS_BAR_SECTION });

    return (
        <Stack spacing={2}>
            <Grid>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <TextInput
                            name={FieldConstants.EQUIPMENT_ID}
                            label="ID"
                            formProps={{ autoFocus: true, ...filledTextField }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
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
                        label={<FormattedMessage id="SubstationTab" />}
                        sx={getTabStyle(tabsWithError, VoltageLevelTab.SUBSTATION_TAB)}
                    />
                    <Tab
                        label={<FormattedMessage id="CharacteristicsTab" />}
                        sx={getTabStyle(tabsWithError, VoltageLevelTab.CHARACTERISTICS_TAB)}
                    />
                    <Tab
                        label={<FormattedMessage id="StructureTab" />}
                        sx={getTabStyle(tabsWithError, VoltageLevelTab.STRUCTURE_TAB)}
                        disabled={watchHideBusBarSection}
                    />
                    <Tab
                        label={<FormattedMessage id="AdditionalInformationTab" />}
                        sx={getTabStyle(tabsWithError, VoltageLevelTab.ADDITIONAL_INFORMATION_TAB)}
                    />
                </Tabs>
            </Grid>
            <Grid>
                <Box hidden={selectedTab !== VoltageLevelTab.SUBSTATION_TAB}>
                    <SubstationTab
                        substationOptions={substationOptions}
                        showDeleteButton={showDeleteSubstationButton}
                    />
                </Box>
                <Box hidden={selectedTab !== VoltageLevelTab.CHARACTERISTICS_TAB}>
                    <CharacteristicsTab />
                </Box>
                <Box hidden={selectedTab !== VoltageLevelTab.STRUCTURE_TAB}>
                    <StructureTab />
                </Box>
                <Box hidden={selectedTab !== VoltageLevelTab.ADDITIONAL_INFORMATION_TAB}>
                    <PropertiesForm networkElementType="voltageLevel" />
                </Box>
            </Grid>
        </Stack>
    );
}
