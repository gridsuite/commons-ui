/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { getTabIndicatorStyle, getTabStyle } from '../parameters-style';
import { CustomFormProvider } from '../../inputs';
import { TabPanel } from '../common';
import { UseVoltageInitParametersFormReturn } from './use-voltage-init-parameters-form';
import { VoltageInitTabValues as TabValues } from './constants';
import { GeneralParameters } from './general-parameters';
import { EquipmentSelectionParameters } from './equipment-selection-parameters';
import { VoltageLimitsParameters } from './voltage-limits-parameters';

interface VoltageInitParametersFormProps {
    voltageInitMethods: UseVoltageInitParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
}

export function VoltageInitParametersForm({
    voltageInitMethods,
    renderTitleFields,
    renderActions,
}: Readonly<VoltageInitParametersFormProps>) {
    const { formMethods, formSchema, selectedTab, handleTabChange, paramsLoading, tabIndexesWithError } =
        voltageInitMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    flexDirection: 'column',
                }}
            >
                <Grid item container direction="column">
                    {renderTitleFields?.()}
                </Grid>
                {paramsLoading ? (
                    <LinearProgress />
                ) : (
                    <Grid item container direction="column">
                        <Tabs
                            value={selectedTab}
                            variant="scrollable"
                            onChange={handleTabChange}
                            TabIndicatorProps={{
                                sx: getTabIndicatorStyle(tabIndexesWithError, selectedTab),
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
                                <GeneralParameters withApplyModifications={renderActions != null} />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={TabValues.VOLTAGE_LIMITS}>
                                <VoltageLimitsParameters />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={TabValues.EQUIPMENTS_SELECTION}>
                                <EquipmentSelectionParameters />
                            </TabPanel>
                        </Grid>
                    </Grid>
                )}
                <Grid
                    item
                    container
                    direction="column"
                    sx={{
                        position: 'absolute',
                        bottom: '15px',
                    }}
                >
                    {renderActions?.()}
                </Grid>
            </Box>
        </CustomFormProvider>
    );
}
