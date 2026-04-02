/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { TextInput } from '../../../inputs';
import { FieldConstants } from '../../../../utils';
import { VOLTAGE_LEVEL_TAB_FIELDS, VoltageLevelTab } from './voltageLevel.constants';
import { CharacteristicsTab, StructureTab, SubstationTab } from './tabs';
import { PropertiesForm } from '../../common';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';
import { useTabsWithError } from '../../../../hooks';

export interface VoltageLevelCreationFormProps {
    substationOptions?: string[];
    showDeleteSubstationButton?: boolean;
}

export function VoltageLevelCreationForm({
    substationOptions,
    showDeleteSubstationButton = true,
}: VoltageLevelCreationFormProps = {}) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<VoltageLevelTab>(
        VOLTAGE_LEVEL_TAB_FIELDS,
        VoltageLevelTab.SUBSTATION_TAB
    );

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextInput
                        name={FieldConstants.EQUIPMENT_ID}
                        label="ID"
                        formProps={{ autoFocus: true, margin: 'normal' }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={{ margin: 'normal' }} />
                </Grid>
            </Grid>
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
            <Box hidden={tabIndex !== VoltageLevelTab.SUBSTATION_TAB}>
                <SubstationTab substationOptions={substationOptions} showDeleteButton={showDeleteSubstationButton} />
            </Box>
            <Box hidden={tabIndex !== VoltageLevelTab.CHARACTERISTICS_TAB}>
                <CharacteristicsTab />
            </Box>
            <Box hidden={tabIndex !== VoltageLevelTab.STRUCTURE_TAB}>
                <StructureTab />
            </Box>
            <Box hidden={tabIndex !== VoltageLevelTab.ADDITIONAL_INFORMATION_TAB}>
                <PropertiesForm networkElementType="voltageLevel" />
            </Box>
        </>
    );
}
