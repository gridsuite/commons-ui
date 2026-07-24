import { Box, Grid2 as Grid } from '@mui/material';

import { ConnectivityForm, ConnectivityNetworkProps, PropertiesForm } from '../../common';
import { GridItem } from '../../../../components';
import { StandbyAutomatonForm } from '../common/standby-automaton-form';
import { SetPointsLimitsForm } from '../common/set-points-limits-form';
import { StaticVarCompensatorDialogTab } from './static-var-compensator-tab-utils';
import { EquipmentType, Identifiable } from '../../../../utils';

export interface StaticVarCompensatorTabsContentProps extends ConnectivityNetworkProps {
    tabIndex: number;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function StaticVarCompensatorTabsContent({
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    tabIndex,
    fetchVoltageLevelEquipments,
}: Readonly<StaticVarCompensatorTabsContentProps>) {
    return (
        <>
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.CONNECTIVITY_TAB} p={1}>
                <Grid container spacing={2}>
                    <GridItem size={12}>
                        <ConnectivityForm
                            previousValues={undefined}
                            voltageLevelOptions={voltageLevelOptions}
                            PositionDiagramPane={PositionDiagramPane}
                            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                        />
                    </GridItem>
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
                <PropertiesForm networkElementType="staticCompensator" />
            </Box>
        </>
    );
}
