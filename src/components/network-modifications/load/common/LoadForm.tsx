/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { LoadDialogTabsContent, LoadDialogTabsContentProps } from './LoadDialogTabsContent';
import { LoadDialogHeader, LoadDialogHeaderProps } from './LoadDialogHeader';
import { LoadDialogTab } from './load.utils';
import { FieldConstants } from '../../../../utils';
import { LoadDialogTabs } from './LoadDialogTabs';

interface LoadFormProps
    extends LoadDialogHeaderProps,
        Omit<LoadDialogTabsContentProps, 'tabIndex' | 'isModification' | 'loadToModify'> {}

export function LoadForm({
    loadToModify,
    isModification,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
}: Readonly<LoadFormProps>) {
    const [tabIndexesWithError, setTabIndexesWithError] = useState<number[]>([]);
    const [tabIndex, setTabIndex] = useState<number>(LoadDialogTab.CONNECTIVITY_TAB);

    const { errors } = useFormState();

    useEffect(() => {
        const tabsInError: number[] = [];
        if (errors?.[FieldConstants.CONNECTIVITY] !== undefined) {
            tabsInError.push(LoadDialogTab.CONNECTIVITY_TAB);
        }
        if (
            errors?.[FieldConstants.ACTIVE_POWER_SET_POINT] !== undefined ||
            errors?.[FieldConstants.REACTIVE_POWER_SET_POINT] !== undefined ||
            errors?.[FieldConstants.ADDITIONAL_PROPERTIES] !== undefined
        ) {
            tabsInError.push(LoadDialogTab.CHARACTERISTICS_TAB);
        }
        if (tabsInError.length > 0) {
            setTabIndex((currentTabIndex) => {
                return tabsInError.includes(currentTabIndex) ? currentTabIndex : tabsInError[0];
            });
        }
        setTabIndexesWithError(tabsInError);
    }, [errors]);

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <LoadDialogHeader loadToModify={loadToModify} isModification={isModification} />
            </Grid>
            <Grid item>
                <LoadDialogTabs
                    tabIndex={tabIndex}
                    tabIndexesWithError={tabIndexesWithError}
                    setTabIndex={setTabIndex}
                    isModification={isModification}
                />
            </Grid>
            <Grid item>
                <LoadDialogTabsContent
                    tabIndex={tabIndex}
                    loadToModify={loadToModify}
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                />
            </Grid>
        </Grid>
    );
}
