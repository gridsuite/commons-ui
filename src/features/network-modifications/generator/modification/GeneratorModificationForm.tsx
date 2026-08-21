/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Stack } from '@mui/material';
import { useFormState, useWatch } from 'react-hook-form';
import { GENERATOR_TAB_FIELDS, GeneratorDialogTab } from './generatorTabs.utils';
import { GeneratorDialogHeader, GeneratorDialogHeaderProps } from './GeneratorDialogHeader';
import { GeneratorDialogTabs } from './GeneratorDialogTabs';
import { GeneratorDialogTabsContent, GeneratorDialogTabsContentProps } from './GeneratorDialogTabsContent';
import { EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import { useTabs } from '../../../../hooks';

interface GeneratorModificationFormProps
    extends GeneratorDialogHeaderProps, Omit<GeneratorDialogTabsContentProps, 'tabIndex'> {
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function GeneratorModificationForm({
    generatorToModify,
    updatePreviousReactiveCapabilityCurveTable,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    fetchVoltageLevelEquipments,
}: Readonly<GeneratorModificationFormProps>) {
    const { errors } = useFormState();
    const {
        selectedTab: tabIndex,
        setSelectedTab: setTabIndex,
        tabsWithError: tabIndexesWithError,
    } = useTabs<GeneratorDialogTab>({
        defaultTab: GeneratorDialogTab.CONNECTIVITY_TAB,
        errors,
        tabFields: GENERATOR_TAB_FIELDS,
    });
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    return (
        <Stack spacing={2}>
            <Grid>
                <GeneratorDialogHeader generatorToModify={generatorToModify} equipmentId={equipmentId} />
            </Grid>
            <Grid>
                <GeneratorDialogTabs
                    tabIndex={tabIndex}
                    tabIndexesWithError={tabIndexesWithError}
                    setTabIndex={setTabIndex}
                />
            </Grid>
            <Grid>
                <GeneratorDialogTabsContent
                    tabIndex={tabIndex}
                    generatorToModify={generatorToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTable}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Grid>
        </Stack>
    );
}
