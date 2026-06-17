/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { PowerWithValidityForm } from './PowerWithValidityForm';
import { MeasurementInfo } from './measurement.type';
import { FieldConstants, FieldType } from '../../../../utils';

interface PowerMeasurementsFormProps {
    side?: 1 | 2;
    activePowerMeasurement?: MeasurementInfo;
    reactivePowerMeasurement?: MeasurementInfo;
    idPrefix?: string;
    reactivePowerOnly?: boolean;
}

export function PowerMeasurementsForm({
    side,
    activePowerMeasurement,
    reactivePowerMeasurement,
    idPrefix = '',
    reactivePowerOnly = false,
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

    let activePowerId = `${FieldConstants.STATE_ESTIMATION}.${getActiveMeasurementType(side)}`;
    let reactivePowerId = `${FieldConstants.STATE_ESTIMATION}.${getReactiveMeasurementType(side)}`;

    if (idPrefix) {
        activePowerId = `${idPrefix}.${activePowerId}`;
        reactivePowerId = `${idPrefix}.${reactivePowerId}`;
    }

    return (
        <Grid container direction="column" spacing={2}>
            {!reactivePowerOnly && (
                <Grid item>
                    <PowerWithValidityForm
                        id={activePowerId}
                        field={FieldType.ACTIVE_POWER}
                        measurement={activePowerMeasurement}
                    />
                </Grid>
            )}
            <Grid item>
                <PowerWithValidityForm
                    id={reactivePowerId}
                    field={FieldType.REACTIVE_POWER}
                    measurement={reactivePowerMeasurement}
                />
            </Grid>
        </Grid>
    );
}
