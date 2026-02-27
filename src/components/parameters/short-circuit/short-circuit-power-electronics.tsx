/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';

import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { ShortCircuitIccMaterialTable } from './short-circuit-icc-material-table';
import { SPECIFIC_PARAMETERS } from '../common';
import { CheckboxInput, FieldLabel, SwitchInput } from '../../inputs';
import GridSection from '../../grid/grid-section';
import GridItem from '../../grid/grid-item';
import {
    SHORT_CIRCUIT_MODEL_POWER_ELECTRONICS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS,
} from './constants';
import { ShortCircuitIccClusterTable } from './short-circuit-icc-cluster-table';
import { COLUMNS_DEFINITIONS_ICC_CLUSTERS, COLUMNS_DEFINITIONS_ICC_MATERIALS } from './columns-definition';

export interface ShortCircuitPowerElectronicsProps {
    isDeveloperMode: boolean;
}

const columnsDef = COLUMNS_DEFINITIONS_ICC_MATERIALS.map((col) => ({
    ...col,
    label: <FormattedMessage id={col.label as string} />,
    tooltip: <FormattedMessage id={col.tooltip as string} />,
}));

const iccClustersColumnsDef = COLUMNS_DEFINITIONS_ICC_CLUSTERS.map((col) => ({
    ...col,
    label: <FormattedMessage id={col.label as string} />,
    tooltip: <FormattedMessage id={col.tooltip as string} />,
}));

function createRows() {
    const rowData: { [key: string]: any } = {};
    iccClustersColumnsDef.forEach((column) => {
        rowData[column.dataKey] = column.initialValue;
    });
    return rowData;
}

export function ShortCircuitPowerElectronics({ isDeveloperMode = true }: Readonly<ShortCircuitPowerElectronicsProps>) {
    const modelPowerElectronics = (
        <Grid container alignItems="center" spacing={2} direction="row">
            <Grid item xs={10}>
                <FieldLabel label="ShortCircuitModelPowerElectronics" />
            </Grid>
            <Grid item xs={2}>
                <SwitchInput name={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_MODEL_POWER_ELECTRONICS}`} />
            </Grid>
        </Grid>
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
                    {isDeveloperMode && (
                        <>
                            <GridSection title="ShortCircuitPowerElectronicsSection" heading={4} />
                            <Grid container xl={6}>
                                <GridItem size={10}>{modelPowerElectronics}</GridItem>
                            </Grid>
                            <ShortCircuitIccMaterialTable
                                formName={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS}`}
                                tableHeight={300}
                                columnsDefinition={columnsDef}
                            />
                            <ShortCircuitIccClusterTable
                                formName={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS}`}
                                columnsDefinition={iccClustersColumnsDef}
                                createRows={createRows}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
}
