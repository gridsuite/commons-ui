/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Tab, Tabs, TextField } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { LoadFormInfos } from './load.types';
import { LOAD_TAB_FIELDS, LoadDialogTab } from './load.utils';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { filledTextField } from '../../common';
import { SelectInput, TextInput } from '../../../inputs';
import { FieldConstants, getLoadTypeLabel, LOAD_TYPES } from '../../../../utils';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';
import { useTabsWithError } from '../../../../hooks';
import { ConnectivityForm } from '../../common/connectivity/ConnectivityForm';
import { SetPointsForm } from '../../common/setpoints/SetPointsForm';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import GridSection from '../../../grid/grid-section';
import { PowerMeasurementsForm } from '../../common/measurements/PowerMeasurementsForm';

export interface LoadFormProps extends ConnectivityNetworkProps {
    loadToModify?: LoadFormInfos | null;
    isModification?: boolean;
}

export function LoadForm({
    loadToModify,
    isModification = false,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<LoadFormProps>) {
    const intl = useIntl();
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<LoadDialogTab>(
        LOAD_TAB_FIELDS,
        LoadDialogTab.CONNECTIVITY_TAB
    );

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    {isModification ? (
                        <TextField
                            size="small"
                            fullWidth
                            label="ID"
                            value={equipmentId ?? ''}
                            InputProps={{ readOnly: true }}
                            disabled
                            {...filledTextField}
                        />
                    ) : (
                        <TextInput
                            name={FieldConstants.EQUIPMENT_ID}
                            label="ID"
                            formProps={{ autoFocus: true, ...filledTextField }}
                        />
                    )}
                </Grid>
                <Grid item xs={4}>
                    <TextInput
                        name={FieldConstants.EQUIPMENT_NAME}
                        label="Name"
                        formProps={filledTextField}
                        previousValue={loadToModify?.name}
                        clearable
                    />
                </Grid>
                <Grid item xs={4}>
                    <SelectInput
                        name={FieldConstants.LOAD_TYPE}
                        label="loadType"
                        options={Object.values(LOAD_TYPES)}
                        fullWidth
                        size="small"
                        formProps={filledTextField}
                        previousValue={
                            loadToModify?.type && loadToModify.type !== 'UNDEFINED'
                                ? intl.formatMessage({ id: getLoadTypeLabel(loadToModify.type) })
                                : undefined
                        }
                    />
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
                    sx={getTabStyle(tabIndexesWithError, LoadDialogTab.CONNECTIVITY_TAB)}
                />
                <Tab
                    label={<FormattedMessage id="CharacteristicsTab" />}
                    sx={getTabStyle(tabIndexesWithError, LoadDialogTab.CHARACTERISTICS_TAB)}
                />
                {isModification && (
                    <Tab
                        label={<FormattedMessage id="StateEstimationTab" />}
                        sx={getTabStyle(tabIndexesWithError, LoadDialogTab.STATE_ESTIMATION_TAB)}
                    />
                )}
            </Tabs>
            <Box hidden={tabIndex !== LoadDialogTab.CONNECTIVITY_TAB}>
                <GridSection title="Connectivity" />
                <ConnectivityForm
                    withPosition
                    isEquipmentModification={isModification}
                    previousValues={{
                        connectablePosition: loadToModify?.connectablePosition,
                        voltageLevelId: loadToModify?.voltageLevelId,
                        busOrBusbarSectionId: loadToModify?.busOrBusbarSectionId,
                        terminalConnected: loadToModify?.terminalConnected,
                    }}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>
            <Box hidden={tabIndex !== LoadDialogTab.CHARACTERISTICS_TAB}>
                <SetPointsForm
                    previousValues={{
                        activePower: loadToModify?.p0,
                        reactivePower: loadToModify?.q0,
                    }}
                    isModification={isModification}
                />
                <PropertiesForm networkElementType="load" isModification={isModification} />
            </Box>
            {isModification && (
                <Box hidden={tabIndex !== LoadDialogTab.STATE_ESTIMATION_TAB}>
                    <GridSection title="MeasurementsSection" />
                    <PowerMeasurementsForm
                        activePowerMeasurement={loadToModify?.measurementP}
                        reactivePowerMeasurement={loadToModify?.measurementQ}
                    />
                </Box>
            )}
        </>
    );
}
