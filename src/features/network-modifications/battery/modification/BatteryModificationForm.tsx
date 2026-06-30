/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { BatteryDialogHeader, BatteryDialogHeaderProps } from './BatteryDialogHeader';
import { BatteryDialogTabs } from './BatteryDialogTabs';
import { BatteryDialogTabsContent, BatteryDialogTabsContentProps } from './BatteryDialogTabsContent';
import { BATTERY_TAB_FIELDS, BatteryDialogTab } from './batteryTabs.utils';
import { FieldConstants } from '../../../../utils';
import { useTabsWithError } from '../../hooks';

interface BatteryModificationFormProps
    extends BatteryDialogHeaderProps,
        Omit<BatteryDialogTabsContentProps, 'tabIndex'> {}

export function BatteryModificationForm({
    batteryToModify,
    updatePreviousReactiveCapabilityCurveTable,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
}: Readonly<BatteryModificationFormProps>) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<BatteryDialogTab>(
        BATTERY_TAB_FIELDS,
        BatteryDialogTab.CONNECTIVITY_TAB
    );
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    return (
        <Stack spacing={2}>
            <Grid>
                <BatteryDialogHeader batteryToModify={batteryToModify} equipmentId={equipmentId} />
            </Grid>
            <Grid>
                <BatteryDialogTabs
                    tabIndex={tabIndex}
                    tabIndexesWithError={tabIndexesWithError}
                    setTabIndex={setTabIndex}
                />
            </Grid>
            <Grid>
                <BatteryDialogTabsContent
                    tabIndex={tabIndex}
                    batteryToModify={batteryToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTable}
                />
            </Grid>
        </Stack>
    );
}
