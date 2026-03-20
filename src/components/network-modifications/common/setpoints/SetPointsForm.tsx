/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import GridSection from '../../../grid/grid-section';
import GridItem from '../../../grid/grid-item';
import { ActivePowerAdornment, FieldConstants, ReactivePowerAdornment } from '../../../../utils';
import { FloatInput } from '../../../inputs';

interface SetPointsFormProps {
    previousValues?: { activePower?: number | null; reactivePower?: number | null };
    isModification?: boolean;
}
export function SetPointsForm({ previousValues, isModification = false }: Readonly<SetPointsFormProps>) {
    const activePowerSetPointField = (
        <FloatInput
            name={FieldConstants.ACTIVE_POWER_SET_POINT}
            label="ActivePowerText"
            adornment={ActivePowerAdornment}
            previousValue={previousValues?.activePower ?? undefined}
            clearable={isModification}
        />
    );

    const reactivePowerSetPointField = (
        <FloatInput
            name={FieldConstants.REACTIVE_POWER_SET_POINT}
            label="ReactivePowerText"
            adornment={ReactivePowerAdornment}
            previousValue={previousValues?.reactivePower ?? undefined}
            clearable={isModification}
        />
    );

    return (
        <>
            <GridSection title="Setpoints" />
            <Grid container spacing={2}>
                <GridItem size={4}>{activePowerSetPointField}</GridItem>
                <GridItem size={4}>{reactivePowerSetPointField}</GridItem>
            </Grid>
        </>
    );
}
