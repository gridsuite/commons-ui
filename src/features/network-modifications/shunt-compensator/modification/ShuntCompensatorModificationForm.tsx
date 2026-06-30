/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, TextField, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { TextInput } from '../../../../components/ui';
import { Grid2Section as GridSection } from '../../../../components/composite/grid/grid2-section';
import { ConnectivityForm } from '../../common/connectivity/ConnectivityForm';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { PowerMeasurementsForm } from '../../common/measurements/PowerMeasurementsForm';
import { filledTextField } from '../../common';
import { FieldConstants } from '../../../../utils';
import { CharacteristicsForm } from '../common/CharacteristicsForm';
import { ShuntCompensatorFormInfos } from '../common/shuntCompensator.types';

export interface ShuntCompensatorModificationFormProps extends ConnectivityNetworkProps {
    shuntCompensatorToModify?: ShuntCompensatorFormInfos | null;
}

export function ShuntCompensatorModificationForm({
    shuntCompensatorToModify,
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
}: Readonly<ShuntCompensatorModificationFormProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    return (
        <Stack spacing={2}>
            <Grid>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <TextField
                            size="small"
                            fullWidth
                            label="ID"
                            value={equipmentId ?? ''}
                            slotProps={{ input: { readOnly: true } }}
                            disabled
                            {...filledTextField}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextInput
                            name={FieldConstants.EQUIPMENT_NAME}
                            label="Name"
                            formProps={filledTextField}
                            previousValue={shuntCompensatorToModify?.name}
                            clearable
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <GridSection title="Connectivity" />
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <ConnectivityForm
                            isEquipmentModification
                            previousValues={shuntCompensatorToModify ?? undefined}
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
                        <CharacteristicsForm previousValues={shuntCompensatorToModify ?? undefined} isModification />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <GridSection title="MeasurementsSection" />
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <PowerMeasurementsForm
                            reactivePowerMeasurement={shuntCompensatorToModify?.measurementQ}
                            reactivePowerOnly
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <PropertiesForm networkElementType="shuntCompensator" isModification />
            </Grid>
        </Stack>
    );
}
