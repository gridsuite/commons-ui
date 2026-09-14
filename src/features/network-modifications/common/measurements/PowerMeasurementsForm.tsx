/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Stack } from '@mui/material';
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
    idPrefix = FieldConstants.STATE_ESTIMATION,
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

    return (
        <Stack spacing={2}>
            {!reactivePowerOnly && (
                <Grid>
                    <PowerWithValidityForm
                        id={`${idPrefix}.${getActiveMeasurementType(side)}`}
                        field={FieldType.ACTIVE_POWER}
                        measurement={activePowerMeasurement}
                    />
                </Grid>
            )}
            <Grid>
                <PowerWithValidityForm
                    id={`${idPrefix}.${getReactiveMeasurementType(side)}`}
                    field={FieldType.REACTIVE_POWER}
                    measurement={reactivePowerMeasurement}
                />
            </Grid>
        </Stack>
    );
}
