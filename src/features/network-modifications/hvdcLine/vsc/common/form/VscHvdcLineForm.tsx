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
import { HVDC_LINE_TAB_FIELDS, VscHvdcLineDialogTab } from './vscHvdcLine.utils';
import { useTabsWithError } from '../../../../hooks/useTabsWithError';
import { UpdateReactiveCapabilityCurveTableConverterStation } from '../converterStation/vscConverterStationPane.utils';

interface VscHvdcLineFormProps
    extends
        VscHvdcLineDialogHeaderProps,
        Omit<VscHvdcLineDialogTabsContentProps, 'tabIndex' | 'isModification' | 'hvdcLineToModify'> {
    updatePreviousReactiveCapabilityCurveTableConverterStation: UpdateReactiveCapabilityCurveTableConverterStation;
}

export function VscHvdcLineForm({
    hvdcLineToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    updatePreviousReactiveCapabilityCurveTableConverterStation,
    isModification = false,
}: Readonly<VscHvdcLineFormProps>) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<VscHvdcLineDialogTab>(
        HVDC_LINE_TAB_FIELDS,
        VscHvdcLineDialogTab.HVDC_LINE_TAB
    );

    return (
        <Stack spacing={2} height="100%">
            <VscHvdcLineDialogHeader hvdcLineToModify={hvdcLineToModify} isModification={isModification} />
            <VscHvdcLineDialogTabs
                tabIndex={tabIndex}
                tabIndexesWithError={tabIndexesWithError}
                setTabIndex={setTabIndex}
                isModification={isModification}
            />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 3 }}>
                <VscHvdcLineDialogTabsContent
                    tabIndex={tabIndex}
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
