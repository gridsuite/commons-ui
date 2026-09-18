/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { BatteryDialogHeader, BatteryDialogHeaderProps } from './BatteryDialogHeader';
import { BatteryDialogTabs } from './BatteryDialogTabs';
import { BatteryDialogTabsContent, BatteryDialogTabsContentProps } from './BatteryDialogTabsContent';
import { BatteryDialogTab } from './batteryTabs.utils';
import { EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import { UseTabsReturn } from '../../../../hooks';
import { tabbedFormStyles } from '../../common';

interface BatteryModificationFormProps
    extends BatteryDialogHeaderProps, Omit<BatteryDialogTabsContentProps, 'tabIndex'> {
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    useTabsReturn: UseTabsReturn<BatteryDialogTab>;
}

export function BatteryModificationForm({
    batteryToModify,
    updatePreviousReactiveCapabilityCurveTable,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    fetchVoltageLevelEquipments,
    useTabsReturn,
}: Readonly<BatteryModificationFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <Grid>
                <BatteryDialogHeader batteryToModify={batteryToModify} equipmentId={equipmentId} />
            </Grid>
            <Grid>
                <BatteryDialogTabs
                    tabIndex={selectedTab}
                    tabIndexesWithError={tabsWithError}
                    onTabChange={onTabChange}
                />
            </Grid>
            <Box sx={tabbedFormStyles.scrollableContent}>
                <BatteryDialogTabsContent
                    tabIndex={selectedTab}
                    batteryToModify={batteryToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTable}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
        </Stack>
    );
}
