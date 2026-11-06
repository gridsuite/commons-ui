/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Stack, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { GridSection, TextInput } from '../../../../components';
import { UseTabsReturn } from '../../../../hooks';
import { EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import {
    ConnectivityForm,
    ConnectivityNetworkProps,
    filledTextField,
    PropertiesForm,
    tabbedFormStyles,
} from '../../common';
import { SetPointsLimitsForm } from '../common/set-points-limits-form';
import { StaticVarCompensatorDialogTabs } from '../common/static-var-compensator-dialog-tabs';
import { StaticVarCompensatorDialogTab } from '../common/static-var-compensator-tab-utils';
import { StaticVarCompensatorFormInfo } from '../common/static-var-compensator.types';

export interface StaticVarCompensatorModificationFormProps extends ConnectivityNetworkProps {
    staticVarCompensatorToModify?: StaticVarCompensatorFormInfo | null;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    useTabsReturn: UseTabsReturn<StaticVarCompensatorDialogTab>;
}

export function StaticVarCompensatorModificationForm({
    staticVarCompensatorToModify,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
    useTabsReturn,
}: Readonly<StaticVarCompensatorModificationFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <TextField
                        size="small"
                        fullWidth
                        label="ID"
                        value={equipmentId ?? ''}
                        slotProps={{ input: { readOnly: true } }}
                        disabled
                        {...filledTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <TextInput
                        name={FieldConstants.EQUIPMENT_NAME}
                        label="Name"
                        formProps={filledTextField}
                        previousValue={staticVarCompensatorToModify?.name ?? undefined}
                        clearable
                    />
                </Grid>
            </Grid>
            <StaticVarCompensatorDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
                hideAutomatonTab
            />
            <Box sx={tabbedFormStyles.scrollableContent}>
                <Box hidden={selectedTab !== StaticVarCompensatorDialogTab.CONNECTIVITY_TAB}>
                    <GridSection title="Connectivity" />
                    <ConnectivityForm
                        isEquipmentModification
                        previousValues={{
                            connectablePosition: staticVarCompensatorToModify?.connectablePosition,
                            voltageLevelId: staticVarCompensatorToModify?.voltageLevelId,
                            busOrBusbarSectionId: staticVarCompensatorToModify?.busOrBusbarSectionId,
                            terminalConnected: staticVarCompensatorToModify?.terminalConnected ?? undefined,
                        }}
                        voltageLevelOptions={voltageLevelOptions}
                        PositionDiagramPane={PositionDiagramPane}
                        fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    />
                </Box>
                <Box hidden={selectedTab !== StaticVarCompensatorDialogTab.SET_POINTS_LIMITS_TAB}>
                    <SetPointsLimitsForm
                        isEquipmentModification
                        previousValues={staticVarCompensatorToModify}
                        voltageLevelOptions={voltageLevelOptions}
                        fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                    />
                </Box>
                <Box hidden={selectedTab !== StaticVarCompensatorDialogTab.ADDITIONAL_INFO_TAB}>
                    <PropertiesForm networkElementType="staticCompensator" isModification />
                </Box>
            </Box>
        </Stack>
    );
}
