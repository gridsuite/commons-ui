/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { DirectoryItemsInput, FieldLabel, FloatInput, GridItem, GridSection } from '../../../components';
import { ElementType, EquipmentType, FieldConstants, PercentageAdornment } from '../../../utils';
import { FrequencyReservePane } from './FrequencyReservePane';
import { SubstationsGeneratorsOrderingPane } from './SubstationsGeneratorsOrderingPane';

interface GenerationDispatchFormProps {
    substationsIds?: string[];
}

export function GenerationDispatchForm({ substationsIds = [] }: Readonly<GenerationDispatchFormProps>) {
    const lossCoefficientField = (
        <FloatInput
            name={FieldConstants.LOSS_COEFFICIENT}
            label="LossCoefficient"
            adornment={PercentageAdornment}
            dataTestId="LossCoefficientInput"
        />
    );

    const generatorsWithFixedActivePowerField = (
        <Grid
            container
            spacing={2}
            direction="row"
            sx={{
                alignItems: 'center',
            }}
        >
            <Grid size={5}>
                <FieldLabel label="GeneratorsWithFixedActivePower" optional />
            </Grid>
            <Grid size={4}>
                <DirectoryItemsInput
                    name={FieldConstants.GENERATORS_WITH_FIXED_ACTIVE_POWER}
                    dataTestId="GeneratorsWithFixedActivePowerInput"
                    equipmentTypes={[EquipmentType.GENERATOR]}
                    elementType={ElementType.FILTER}
                    titleId="FiltersListsSelection"
                    label=""
                />
            </Grid>
        </Grid>
    );

    const defaultOutageRateField = (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography
                    variant="body1"
                    component="h4"
                    sx={{
                        fontWeight: 'fontWeightMedium',
                    }}
                >
                    <FormattedMessage id="GeneratorAvailability" />
                </Typography>
            </Grid>
            <Grid>
                <FloatInput
                    name={FieldConstants.DEFAULT_OUTAGE_RATE}
                    label="DefaultOutageRate"
                    adornment={PercentageAdornment}
                    dataTestId="DefaultOutageRateInput"
                />
            </Grid>
        </Grid>
    );

    const generatorsWithoutOutageField = (
        <Grid
            container
            spacing={2}
            direction="row"
            sx={{
                alignItems: 'center',
            }}
        >
            <Grid size={5}>
                <FieldLabel label="GeneratorsWithoutOutage" optional />
            </Grid>
            <Grid size={4}>
                <DirectoryItemsInput
                    name={FieldConstants.GENERATORS_WITHOUT_OUTAGE}
                    dataTestId="GeneratorsWithoutOutageInput"
                    equipmentTypes={[EquipmentType.GENERATOR]}
                    elementType={ElementType.FILTER}
                    titleId="FiltersListsSelection"
                    label=""
                />
            </Grid>
        </Grid>
    );

    return (
        <Box
            sx={{
                pt: 2,
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    mb: 2,
                }}
            >
                <GridItem size={4}>{lossCoefficientField}</GridItem>
                <GridItem size={12}>{generatorsWithFixedActivePowerField}</GridItem>
            </Grid>
            <GridSection title="ReduceMaxP" />
            <Grid
                container
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >
                <GridItem size={4}>{defaultOutageRateField}</GridItem>
                <GridItem size={12}>{generatorsWithoutOutageField}</GridItem>
            </Grid>
            <Grid container spacing={2}>
                <Grid>
                    <Typography
                        variant="body1"
                        component="h4"
                        sx={{
                            fontWeight: 'fontWeightMedium',
                        }}
                    >
                        <FormattedMessage id="frequencyReserve" />
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <FrequencyReservePane />
                </Grid>
            </Grid>
            <GridSection title="GeneratorsOrdering" />
            <Stack spacing={2} sx={{ width: '100%' }}>
                <SubstationsGeneratorsOrderingPane substations={substationsIds} />
            </Stack>
        </Box>
    );
}
