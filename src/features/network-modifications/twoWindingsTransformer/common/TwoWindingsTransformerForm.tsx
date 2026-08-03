/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { useFormState } from 'react-hook-form';
import {
    TwoWindingsTransformerDialogHeader,
    TwoWindingsTransformerDialogHeaderProps,
} from './TwoWindingsTransformerDialogHeader';
import { useTabsWithError } from '../../hooks';
import { TwoWindingsTransformerDialogTab, TWT_TAB_FIELDS } from './twoWindingsTransformer.utils';
import { TwoWindingsTransformerDialogTabs } from './TwoWindingsTransformerDialogTabs';
import {
    TwoWindingsTransformerDialogTabsContent,
    TwoWindingsTransformerDialogTabsContentProps,
} from './TwoWindingsTransformerDialogTabsContent';

interface TwoWindingsTransformerFormProps
    extends
        TwoWindingsTransformerDialogHeaderProps,
        Omit<TwoWindingsTransformerDialogTabsContentProps, 'tabIndex' | 'isModification' | 'twtToModify'> {}

export function TwoWindingsTransformerForm({
    twtToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    fetchVoltageLevelEquipments,
    isModification = false,
}: Readonly<TwoWindingsTransformerFormProps>) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<TwoWindingsTransformerDialogTab>(
        TWT_TAB_FIELDS,
        TwoWindingsTransformerDialogTab.CONNECTIVITY_TAB
    );
    const { errors } = useFormState();

    return (
        <Stack spacing={2} height="100%">
            <TwoWindingsTransformerDialogHeader twtToModify={twtToModify} isModification={isModification} />
            <TwoWindingsTransformerDialogTabs
                tabIndex={tabIndex}
                tabIndexesWithError={tabIndexesWithError}
                setTabIndex={setTabIndex}
                isModification={isModification}
            />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 3 }}>
                <TwoWindingsTransformerDialogTabsContent
                    tabIndex={tabIndex}
                    twtToModify={twtToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    isModification={isModification}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
            {/* TODO remove debug block: dumps every react-hook-form error for this form */}
            {Object.keys(errors).length > 0 && (
                <Box
                    component="pre"
                    sx={{
                        maxHeight: 200,
                        overflow: 'auto',
                        fontSize: 12,
                        color: 'error.main',
                        border: '1px dashed',
                        borderColor: 'error.main',
                        p: 1,
                        m: 0,
                    }}
                >
                    {JSON.stringify(
                        errors,
                        (key, value) => (key === 'ref' ? undefined : value),
                        2
                    )}
                </Box>
            )}
        </Stack>
    );
}
