import { Grid } from '@mui/material';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { ShortCircuitIccMaterialTable } from './short-circuit-icc-material-table';
import { SPECIFIC_PARAMETERS } from '../common';
import { CheckboxInput, DirectoryItemsInput, OverflowableChipWithHelperText, RadioInput } from '../../inputs';
import { ElementType, EquipmentType } from '../../../utils';
import GridSection from '../../grid/grid-section';
import GridItem from '../../grid/grid-item';
import {
    onlyStartedGeneratorsOptions,
    SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS,
    SHORT_CIRCUIT_MODEL_POWER_ELECTRONICS,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER,
    SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS,
} from './constants';
import { ShortCircuitIccClusterTable } from './short-circuit-icc-cluster-table';
import { COLUMNS_DEFINITIONS_ICC_CLUSTERS, COLUMNS_DEFINITIONS_ICC_MATERIALS } from './columns-definition';

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

export interface ShortCircuitSpecificFieldsProps {
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

export function ShortCircuitSpecificFields({ isDeveloperMode = true }: Readonly<ShortCircuitSpecificFieldsProps>) {
    const { setValue, getValues } = useFormContext();

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

    const modelPowerElectronics = (
        <CheckboxInput
            name={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_MODEL_POWER_ELECTRONICS}`}
            label="ShortCircuitModelPowerElectronics"
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
                            name={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS}`}
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
                    {isDeveloperMode && (
                        <>
                            <GridSection title="ShortCircuitPowerElectronicsSection" heading={4} />
                            <Grid container>
                                <GridItem size={12}>{modelPowerElectronics}</GridItem>
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
