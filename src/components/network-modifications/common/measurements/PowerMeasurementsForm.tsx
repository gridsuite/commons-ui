/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { PowerWithValidityForm } from './PowerWithValidityForm';
import { MeasurementInfo } from './measurement.type';
import GridItem from '../../../grid/grid-item';
import { FieldConstants, FieldType } from '../../../../utils';

interface PowerMeasurementsFormProps {
    side?: 1 | 2;
    activePowerMeasurement?: MeasurementInfo;
    reactivePowerMeasurement?: MeasurementInfo;
}

export function PowerMeasurementsForm({
    side,
    activePowerMeasurement,
    reactivePowerMeasurement,
}: Readonly<PowerMeasurementsFormProps>) {
    const getActiveMeasurementType = (whichSide: number | null | undefined) => {
        if (!whichSide) {
            return FieldConstants.MEASUREMENT_P;
        }
        return whichSide === 1 ? FieldConstants.MEASUREMENT_P1 : FieldConstants.MEASUREMENT_P2;
    };

    const getReactiveMeasurementType = (whichSide: number | null | undefined) => {
        if (!whichSide) {
            return FieldConstants.MEASUREMENT_Q;
        }
        return whichSide === 1 ? FieldConstants.MEASUREMENT_Q1 : FieldConstants.MEASUREMENT_Q2;
    };

    const activePowerId = `${FieldConstants.STATE_ESTIMATION}.${getActiveMeasurementType(side)}`;
    const reactivePowerId = `${FieldConstants.STATE_ESTIMATION}.${getReactiveMeasurementType(side)}`;

    return (
        <Grid container spacing={2}>
            <GridItem size={12}>
                <PowerWithValidityForm
                    id={activePowerId}
                    field={FieldType.ACTIVE_POWER}
                    measurement={activePowerMeasurement}
                />
            </GridItem>
            <GridItem size={12}>
                <PowerWithValidityForm
                    id={reactivePowerId}
                    field={FieldType.REACTIVE_POWER}
                    measurement={reactivePowerMeasurement}
                />
            </GridItem>
        </Grid>
    );
}
