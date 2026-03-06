/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Box } from '@mui/material';
import { TabPanelProps } from '@mui/lab';
import { useFormContext } from 'react-hook-form';
import { SPECIFIC_PARAMETERS, TabPanel } from '../common';
import { DirectoryItemsInput, FieldLabel, FloatInput, OverflowableChipWithHelperText, RadioInput } from '../../inputs';
import { ElementType, EquipmentType } from '../../../utils';
import GridSection from '../../grid/grid-section';
import GridItem from '../../grid/grid-item';
import {
    NODE_CLUSTER_FILTER_IDS,
    onlyStartedGeneratorsOptions,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER,
    STARTED_GENERATORS_IN_CALCULATION_CLUSTER_THRESHOLD,
    STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER_THRESHOLD,
} from './constants';
import { ShortCircuitParametersTabValues } from './short-circuit-parameters-utils';

const equipmentTypes: string[] = [EquipmentType.VOLTAGE_LEVEL];

const styles = {
    h4: {
        marginBottom: 1,
    },
    h5: {
        marginBottom: 1,
        marginTop: 1,
    },
};

export function ShortCircuitStudyAreaTabPanel({ ...tabPanelProps }: Readonly<TabPanelProps>) {
    const { setValue } = useFormContext();
    const startedGeneratorsInCalculationClusterThreshold = (
        <FloatInput
            name={`${SPECIFIC_PARAMETERS}.${STARTED_GENERATORS_IN_CALCULATION_CLUSTER_THRESHOLD}`}
            label="startedGeneratorsInCalculationClusterThreshold"
        />
    );

    // Forced to specifically manage this onlyStartedGenerators parameter because it's a boolean type, but we want to use a radio button here.
    const inClusterOnlyStartedGenerators = (
        <RadioInput
            name={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER}`}
            options={Object.values(onlyStartedGeneratorsOptions)}
            formProps={{
                onChange: (_event, value) => {
                    setValue(
                        `${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER}`,
                        value === 'true',
                        {
                            shouldDirty: true,
                        }
                    );
                },
            }}
        />
    );

    const startedGeneratorsOutsideCalculationClusterThreshold = (
        <FloatInput
            name={`${SPECIFIC_PARAMETERS}.${STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER_THRESHOLD}`}
            label="startedGeneratorsOutsideCalculationClusterThreshold"
        />
    );

    const outClusterOnlyStartedGenerators = (
        <RadioInput
            name={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER}`}
            options={Object.values(onlyStartedGeneratorsOptions)}
            formProps={{
                onChange: (_event, value) => {
                    setValue(
                        `${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER}`,
                        value === 'true',
                        {
                            shouldDirty: true,
                        }
                    );
                },
            }}
        />
    );

    return (
        <TabPanel value={tabPanelProps.value} index={ShortCircuitParametersTabValues.STUDY_AREA}>
            <GridSection title="ShortCircuitInClusterFilter" heading={4} />
            <Grid item xs sx={{ paddingBottom: 4 }}>
                <DirectoryItemsInput
                    titleId="FiltersListsSelection"
                    label="Filters"
                    name={`${SPECIFIC_PARAMETERS}.${NODE_CLUSTER_FILTER_IDS}`}
                    elementType={ElementType.FILTER}
                    equipmentTypes={equipmentTypes}
                    ChipComponent={OverflowableChipWithHelperText}
                    chipProps={{ variant: 'outlined' }}
                    fullHeight
                />
            </Grid>
            <GridSection title="ShortCircuitStartedGeneratorsMode" heading={4} customStyle={styles.h4} />
            <Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'center' }}>
                <GridItem size={2}>
                    <FieldLabel label="ShortCircuitInCluster" />
                </GridItem>
                <GridItem size={3}>{inClusterOnlyStartedGenerators}</GridItem>
                <GridItem size={3}>{startedGeneratorsInCalculationClusterThreshold}</GridItem>
            </Box>
            <Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'center' }}>
                <GridItem size={2}>
                    <FieldLabel label="ShortCircuitOutCluster" />
                </GridItem>
                <GridItem size={3}>{outClusterOnlyStartedGenerators}</GridItem>
                <GridItem size={3}>{startedGeneratorsOutsideCalculationClusterThreshold}</GridItem>
            </Box>
        </TabPanel>
    );
}
