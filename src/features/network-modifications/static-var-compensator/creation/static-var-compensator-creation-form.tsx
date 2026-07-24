/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ConnectivityForm, ConnectivityNetworkProps, PropertiesForm } from '../../common';
import { GridItem } from '../../../../components';
import { Box, Grid2 as Grid } from '@mui/material';
import { StaticVarCompensatorDialogTab } from '../common/static-var-compensator-utils';
import { StandbyAutomatonForm } from '../common/standby-automaton-form';
import { SetPointsLimitsForm } from '../common/set-points-limits-form';
import { EquipmentType, Identifiable } from '../../../../utils';

export interface StaticVarCompensatorCreationFormProps extends ConnectivityNetworkProps {
    tabIndex: number;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function StaticVarCompensatorCreationForm({
    tabIndex,
    fetchVoltageLevelEquipments,
    voltageLevelOptions,
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: StaticVarCompensatorCreationFormProps) {
    const connectivityForm = (
        <ConnectivityForm
            previousValues={undefined}
            voltageLevelOptions={voltageLevelOptions}
            PositionDiagramPane={PositionDiagramPane}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    return (
        <>
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.CONNECTIVITY_TAB} p={1}>
                <Grid container spacing={2}>
                    <GridItem size={12}>{connectivityForm}</GridItem>
                </Grid>
            </Box>
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.SET_POINTS_LIMITS_TAB}>
                <SetPointsLimitsForm
                    voltageLevelOptions={voltageLevelOptions}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.AUTOMATON_TAB}>
                <StandbyAutomatonForm />
            </Box>
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.ADDITIONAL_INFO_TAB}>
                <PropertiesForm networkElementType={'staticCompensator'} />
            </Box>
        </>
    );
}
