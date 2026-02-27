/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SPECIFIC_PARAMETERS } from '../common';
import { DirectoryItemsInput, OverflowableChipWithHelperText, RadioInput } from '../../inputs';
import { ElementType, EquipmentType } from '../../../utils';
import GridSection from '../../grid/grid-section';
import GridItem from '../../grid/grid-item';
import {
    onlyStartedGeneratorsOptions,
    NODE_CLUSTER,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER,
} from './constants';

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

export function ShortCircuitStudyArea() {
    const { setValue } = useFormContext();

    // Forced to specificly manage this onlyStartedGenerators parameter because it's a boolean type, but we want to use a radio button here.
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

    const watchSpecificParameters = useWatch({
        name: `${SPECIFIC_PARAMETERS}`,
    });

    const isThereSpecificParameters = useMemo(
        () => Object.keys(watchSpecificParameters).length > 0 && watchSpecificParameters.constructor === Object,
        [watchSpecificParameters]
    );

    return (
        <>
            {isThereSpecificParameters && (
                <>
                    <GridSection title="ShortCircuitInClusterFilter" heading={4} />
                    <Grid item xs>
                        <DirectoryItemsInput
                            titleId="FiltersListsSelection"
                            label="Filters"
                            name={`${SPECIFIC_PARAMETERS}.${NODE_CLUSTER}`}
                            elementType={ElementType.FILTER}
                            equipmentTypes={equipmentTypes}
                            ChipComponent={OverflowableChipWithHelperText}
                            chipProps={{ variant: 'outlined' }}
                            fullHeight
                        />
                    </Grid>
                    <GridSection title="ShortCircuitStartedGeneratorsMode" heading={4} customStyle={styles.h4} />
                    <GridSection title="ShortCircuitInCluster" heading={5} customStyle={styles.h5} />
                    <Grid container>
                        <GridItem size={12}>{inClusterOnlyStartedGenerators}</GridItem>
                    </Grid>
                    <GridSection title="ShortCircuitOutCluster" heading={5} customStyle={styles.h5} />
                    <Grid container>
                        <GridItem size={12}>{outClusterOnlyStartedGenerators}</GridItem>
                    </Grid>
                </>
            )}
        </>
    );
}
