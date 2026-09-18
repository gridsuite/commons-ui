/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import {
    TwoWindingsTransformerDialogHeader,
    TwoWindingsTransformerDialogHeaderProps,
} from './TwoWindingsTransformerDialogHeader';
import { TwoWindingsTransformerDialogTab } from './twoWindingsTransformer.utils';
import { TwoWindingsTransformerDialogTabs } from './TwoWindingsTransformerDialogTabs';
import {
    TwoWindingsTransformerDialogTabsContent,
    TwoWindingsTransformerDialogTabsContentProps,
} from './TwoWindingsTransformerDialogTabsContent';
import { UseTabsReturn } from '../../../../hooks';
import { tabbedFormStyles } from '../../common';

interface TwoWindingsTransformerFormProps
    extends
        TwoWindingsTransformerDialogHeaderProps,
        Omit<TwoWindingsTransformerDialogTabsContentProps, 'tabIndex' | 'isModification' | 'twtToModify'> {
    useTabsReturn: UseTabsReturn<TwoWindingsTransformerDialogTab>;
}

export function TwoWindingsTransformerForm({
    twtToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    fetchVoltageLevelEquipments,
    editData,
    isModification = false,
    useTabsReturn,
}: Readonly<TwoWindingsTransformerFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <TwoWindingsTransformerDialogHeader twtToModify={twtToModify} isModification={isModification} />
            <TwoWindingsTransformerDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
                isModification={isModification}
            />
            <Box sx={tabbedFormStyles.scrollableContent}>
                <TwoWindingsTransformerDialogTabsContent
                    tabIndex={selectedTab}
                    twtToModify={twtToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    isModification={isModification}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                    editData={editData}
                />
            </Box>
        </Stack>
    );
}
