/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useWatch } from 'react-hook-form';
import { Grid } from '@mui/material';
import GridSection from '../../../../../grid/grid-section';
import { FieldConstants, KiloAmpereAdornment, VoltageAdornment } from '../../../../../../utils';
import { FloatInput } from '../../../../../inputs';

export function CharacteristicsTab() {
    const watchHideNominalVoltage = useWatch({ name: FieldConstants.HIDE_NOMINAL_VOLTAGE });

    return (
        <>
            <GridSection title="VoltageText" />
            <Grid container spacing={2}>
                {!watchHideNominalVoltage && (
                    <Grid item xs={4}>
                        <FloatInput
                            name={FieldConstants.NOMINAL_V}
                            label="NominalVoltage"
                            adornment={VoltageAdornment}
                        />
                    </Grid>
                )}
                <Grid item xs={4}>
                    <FloatInput
                        name={FieldConstants.LOW_VOLTAGE_LIMIT}
                        label="LowVoltageLimit"
                        adornment={VoltageAdornment}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FloatInput
                        name={FieldConstants.HIGH_VOLTAGE_LIMIT}
                        label="HighVoltageLimit"
                        adornment={VoltageAdornment}
                    />
                </Grid>
            </Grid>

            <GridSection title="ShortCircuit" />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FloatInput
                        name={FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT}
                        label="LowShortCircuitCurrentLimit"
                        adornment={KiloAmpereAdornment}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FloatInput
                        name={FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT}
                        label="HighShortCircuitCurrentLimit"
                        adornment={KiloAmpereAdornment}
                    />
                </Grid>
            </Grid>
        </>
    );
}
