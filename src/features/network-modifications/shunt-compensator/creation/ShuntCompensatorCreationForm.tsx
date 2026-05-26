/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { TextInput } from '../../../../components/ui';
import GridSection from '../../../../components/composite/grid/grid-section';
import { ConnectivityForm } from '../../common/connectivity/ConnectivityForm';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';
import { FieldConstants } from '../../../../utils';
import { CharacteristicsForm } from '../common/CharacteristicsForm';

export type ShuntCompensatorCreationFormProps = ConnectivityNetworkProps;

export function ShuntCompensatorCreationForm({
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
}: Readonly<ShuntCompensatorCreationFormProps>) {
    return (
        <Grid container direction="column" spacing={2}>
            <Grid>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <TextInput
                            name={FieldConstants.EQUIPMENT_ID}
                            label="ID"
                            formProps={{ autoFocus: true, ...filledTextField }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <GridSection title="Connectivity" />
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <ConnectivityForm
                            voltageLevelOptions={voltageLevelOptions}
                            PositionDiagramPane={PositionDiagramPane}
                            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <GridSection title="Characteristics" />
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <CharacteristicsForm isModification={false} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <PropertiesForm networkElementType="shuntCompensator" />
            </Grid>
        </Grid>
    );
}
