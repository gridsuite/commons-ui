/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid } from '@mui/material';
import { ConnectivityForm, ConnectivityNetworkProps, PropertiesForm } from '../../common';
import { GridItem } from '../../../../components';
import { StandbyAutomatonForm } from '../common/standby-automaton-form';
import { SetPointsLimitsForm } from '../common/set-points-limits-form';
import { StaticVarCompensatorDialogTab } from './static-var-compensator-tab-utils';
import { EquipmentType, Identifiable } from '../../../../utils';
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';

export interface StaticVarCompensatorTabsContentProps extends ConnectivityNetworkProps {
    tabIndex: number;
    isEquipmentModification?: boolean;
    previousValues?: StaticVarCompensatorFormInfo | null;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function StaticVarCompensatorTabsContent({
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    tabIndex,
    isEquipmentModification = false,
    previousValues,
    fetchVoltageLevelEquipments,
}: Readonly<StaticVarCompensatorTabsContentProps>) {
    return (
        <>
            <Box
                hidden={tabIndex !== StaticVarCompensatorDialogTab.CONNECTIVITY_TAB}
                sx={{
                    p: 1,
                }}
            >
                <Grid container spacing={2}>
                    <GridItem size={12}>
                        <ConnectivityForm
                            isEquipmentModification={isEquipmentModification}
                            previousValues={
                                previousValues
                                    ? {
                                          connectablePosition: previousValues.connectablePosition,
                                          voltageLevelId: previousValues.voltageLevelId,
                                          busOrBusbarSectionId: previousValues.busOrBusbarSectionId,
                                          terminalConnected: previousValues.terminalConnected ?? undefined,
                                      }
                                    : undefined
                            }
                            voltageLevelOptions={voltageLevelOptions}
                            PositionDiagramPane={PositionDiagramPane}
                            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                        />
                    </GridItem>
                </Grid>
            </Box>
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.SET_POINTS_LIMITS_TAB}>
                <SetPointsLimitsForm
                    isEquipmentModification={isEquipmentModification}
                    previousValues={previousValues}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
            {/* TODO: the automaton tab of the modification is added in a next PR */}
            {!isEquipmentModification && (
                <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.AUTOMATON_TAB}>
                    <StandbyAutomatonForm />
                </Box>
            )}
            <Box hidden={tabIndex !== StaticVarCompensatorDialogTab.ADDITIONAL_INFO_TAB}>
                <PropertiesForm networkElementType="staticCompensator" isModification={isEquipmentModification} />
            </Box>
        </>
    );
}
