/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Box, Grid, Stack } from '@mui/material';
import { GridSection, IntegerInput } from '../../../../../../components';
import { FieldConstants } from '../../../../../../utils';
import type { DiscreteMeasurementsInfos } from '../../../common';

interface TapMeasurementsFormProps {
    measurementRatioTap?: DiscreteMeasurementsInfos;
    measurementPhaseTap?: DiscreteMeasurementsInfos;
}

export function TapPositionMeasurementsForm({
    measurementRatioTap,
    measurementPhaseTap,
}: Readonly<TapMeasurementsFormProps>) {
    const ratioTapChangerPositionMeasurementId = `${FieldConstants.TAP_POSITION_MEASUREMENT}.${FieldConstants.RATIO_TAP_CHANGER_POSITION_MEASUREMENT}`;
    const phaseTapChangerPositionMeasurementId = `${FieldConstants.TAP_POSITION_MEASUREMENT}.${FieldConstants.PHASE_TAP_CHANGER_POSITION_MEASUREMENT}`;

    return (
        <Box sx={{ width: '100%' }}>
            <GridSection title="TapMeasurementsSection" />
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <IntegerInput
                            name={ratioTapChangerPositionMeasurementId}
                            label="RatioTapPosition"
                            previousValue={measurementRatioTap?.value}
                            clearable
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <IntegerInput
                            name={phaseTapChangerPositionMeasurementId}
                            label="PhaseTapPosition"
                            previousValue={measurementPhaseTap?.value}
                            clearable
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}
