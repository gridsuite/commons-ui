/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { VscHvdcLineDialogHeader, VscHvdcLineDialogHeaderProps } from './VscHvdcLineDialogHeader';
import { VscHvdcLineDialogTabs } from './VscHvdcLineDialogTabs';
import { VscHvdcLineDialogTabsContent, VscHvdcLineDialogTabsContentProps } from './VscHvdcLineDialogTabsContent';
import { VscHvdcLineDialogTab } from './vscHvdcLine.utils';
import { UpdateReactiveCapabilityCurveTableConverterStation } from '../converterStation/vscConverterStationPane.utils';
import { UseTabsReturn } from '../../../../../../hooks';

interface VscHvdcLineFormProps
    extends
        VscHvdcLineDialogHeaderProps,
        Omit<VscHvdcLineDialogTabsContentProps, 'tabIndex' | 'isModification' | 'hvdcLineToModify'> {
    updatePreviousReactiveCapabilityCurveTableConverterStation?: UpdateReactiveCapabilityCurveTableConverterStation;
    useTabsReturn: UseTabsReturn<VscHvdcLineDialogTab>;
}

export function VscHvdcLineForm({
    hvdcLineToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    updatePreviousReactiveCapabilityCurveTableConverterStation,
    isModification = false,
    useTabsReturn,
}: Readonly<VscHvdcLineFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2} height="100%">
            <VscHvdcLineDialogHeader hvdcLineToModify={hvdcLineToModify} isModification={isModification} />
            <VscHvdcLineDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
                isModification={isModification}
            />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 3 }}>
                <VscHvdcLineDialogTabsContent
                    tabIndex={selectedTab}
                    isModification={isModification}
                    hvdcLineToModify={hvdcLineToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    updatePreviousReactiveCapabilityCurveTableConverterStation={
                        updatePreviousReactiveCapabilityCurveTableConverterStation
                    }
                />
            </Box>
        </Stack>
    );
}
