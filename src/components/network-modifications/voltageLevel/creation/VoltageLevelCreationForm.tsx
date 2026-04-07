/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import GridItem from '../../../grid/grid-item';
import { TextInput } from '../../../inputs';
import { FieldConstants } from '../../../../utils';
import { VoltageLevelTab } from './voltageLevel.constants';
import {
    isAdditionalInformationTabError,
    isCharacteristicsTabError,
    isStructureTabError,
    isSubstationTabError,
} from './voltageLevelCreation.utils';
import { CharacteristicsTab, StructureTab, SubstationTab } from './tabs';
import { PropertiesForm } from '../../common';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';

export interface VoltageLevelCreationFormProps {
    substationOptions?: string[];
    showDeleteSubstationButton?: boolean;
}

export function VoltageLevelCreationForm({
    substationOptions,
    showDeleteSubstationButton = true,
}: VoltageLevelCreationFormProps = {}) {
    const [tabIndex, setTabIndex] = useState(0);
    const [tabIndexesWithError, setTabIndexesWithError] = useState<number[]>([]);
    const { errors } = useFormState();
    const watchHideBusBarSection = useWatch({ name: FieldConstants.HIDE_BUS_BAR_SECTION });

    useEffect(() => {
        const tabsInError: number[] = [];
        if (isSubstationTabError(errors)) {
            tabsInError.push(VoltageLevelTab.SUBSTATION_TAB);
        }
        if (isCharacteristicsTabError(errors)) {
            tabsInError.push(VoltageLevelTab.CHARACTERISTICS_TAB);
        }
        if (isStructureTabError(errors)) {
            tabsInError.push(VoltageLevelTab.STRUCTURE_TAB);
        }
        if (isAdditionalInformationTabError(errors)) {
            tabsInError.push(VoltageLevelTab.ADDITIONAL_INFORMATION_TAB);
        }
        if (tabsInError.length > 0) {
            setTabIndex((currentTabIndex) => {
                return tabsInError.includes(currentTabIndex) ? currentTabIndex : tabsInError[0];
            });
        }
        setTabIndexesWithError(tabsInError);
    }, [errors]);

    return (
        <>
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput
                        name={FieldConstants.EQUIPMENT_ID}
                        label="ID"
                        formProps={{ autoFocus: true, margin: 'normal' }}
                    />
                </GridItem>
                <GridItem>
                    <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={{ margin: 'normal' }} />
                </GridItem>
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
                    label={<FormattedMessage id="SubstationTab" />}
                    sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.SUBSTATION_TAB)}
                />
                <Tab
                    label={<FormattedMessage id="CharacteristicsTab" />}
                    sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.CHARACTERISTICS_TAB)}
                />
                <Tab
                    label={<FormattedMessage id="StructureTab" />}
                    sx={getTabStyle(tabIndexesWithError, VoltageLevelTab.STRUCTURE_TAB)}
                    disabled={watchHideBusBarSection}
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
