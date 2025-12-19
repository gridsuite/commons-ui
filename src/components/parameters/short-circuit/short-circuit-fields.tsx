/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo, useState } from 'react';
import { Grid } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { Lens } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import {
    InitialVoltage,
    intlInitialVoltageProfileMode,
    intlPredefinedParametersOptions,
    onlyStartedGeneratorsOptions,
    PredefinedParameters,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS,
    SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS,
    SHORT_CIRCUIT_MODEL_POWER_ELECTRONICS,
    SHORT_CIRCUIT_PREDEFINED_PARAMS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import { VoltageTable } from './short-circuit-voltage-table';
import GridItem from '../../grid/grid-item';
import GridSection from '../../grid/grid-section';
import { CheckboxInput, FieldLabel, MuiSelectInput, RadioInput, SwitchInput } from '../../inputs';
import type { SxStyle } from '../../../utils/styles';
import { COMMON_PARAMETERS, SPECIFIC_PARAMETERS } from '../common';
import { ShortCircuitIccMaterialTable } from './short-circuit-icc-material-table';
import { COLUMNS_DEFINITIONS_ICC_MATERIALS } from './short-circuit-icc-material-table-columns-definition';

export interface ShortCircuitFieldsProps {
    resetAll: (predefinedParams: PredefinedParameters) => void;
    isDeveloperMode: boolean;
}

export enum Status {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

const columnsDef = COLUMNS_DEFINITIONS_ICC_MATERIALS.map((col) => ({
    ...col,
    label: <FormattedMessage id={col.label as string} />,
    tooltip: <FormattedMessage id={col.tooltip as string} />,
}));

export function ShortCircuitFields({ resetAll, isDeveloperMode = true }: Readonly<ShortCircuitFieldsProps>) {
    const [status, setStatus] = useState(Status.SUCCESS);
    const watchInitialVoltageProfileMode = useWatch({
        name: `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE}`,
    });
    const watchPredefinedParams = useWatch({
        name: SHORT_CIRCUIT_PREDEFINED_PARAMS,
    });
    const watchLoads = useWatch({
        name: `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_LOADS}`,
    });
    const watchShuntCompensators = useWatch({
        name: `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS}`,
    });
    const watchVSC = useWatch({
        name: `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS}`,
    });
    const watchNeutralPosition = useWatch({
        name: `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_NEUTRAL_POSITION}`,
    });
    const watchSpecificParameters = useWatch({
        name: `${SPECIFIC_PARAMETERS}`,
    });

    const isThereSpecificParameters = useMemo(
        () => Object.keys(watchSpecificParameters).length > 0 && watchSpecificParameters.constructor === Object,
        [watchSpecificParameters]
    );
    // Courcirc specific parameters
    const watchOnlyStartedGenerators = useWatch({
        name: `${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS}`,
    });

    const isIccMinFeaturesDefaultConfiguration = useMemo(() => {
        return (
            !watchLoads && !watchShuntCompensators && !watchVSC && !watchNeutralPosition && watchOnlyStartedGenerators
        );
    }, [watchLoads, watchShuntCompensators, watchVSC, watchNeutralPosition, watchOnlyStartedGenerators]);

    const isIccMaxFeaturesDefaultConfiguration = useMemo(() => {
        return (
            !watchLoads && !watchShuntCompensators && watchVSC && !watchNeutralPosition && !watchOnlyStartedGenerators
        );
    }, [watchLoads, watchShuntCompensators, watchVSC, watchNeutralPosition, watchOnlyStartedGenerators]);

    // the translation of values
    const predefinedParamsOptions = useMemo(() => {
        const options = intlPredefinedParametersOptions();
        if (!isDeveloperMode) {
            return options.filter((opt) => opt.id !== PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP);
        }

        return options;
    }, [isDeveloperMode]);

    const initialVoltageProfileMode = useMemo(() => {
        return intlInitialVoltageProfileMode();
    }, []);

    const statusColor = useMemo(
        () => ({ color: status === Status.SUCCESS ? green[500] : red[500] }) as const satisfies SxStyle,
        [status]
    );
    const statusToShow = <Lens fontSize="medium" sx={statusColor} />;

    const onPredefinedParametersManualChange = (event: any) => {
        const newPredefinedParameters = event.target.value;
        console.debug('onPredefinedParametersManualChange new:', newPredefinedParameters);
        resetAll(newPredefinedParameters);
    };

    const { setValue } = useFormContext();

    // Adjust default predefined parameter depending on isDeveloperMode
    useEffect(() => {
        if (!isDeveloperMode) {
            if (watchPredefinedParams === PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP) {
                setValue(SHORT_CIRCUIT_PREDEFINED_PARAMS, PredefinedParameters.ICC_MAX_WITH_NOMINAL_VOLTAGE_MAP, {
                    shouldDirty: false,
                    shouldValidate: true,
                });
            }
        }
    }, [isDeveloperMode, watchPredefinedParams, setValue]);

    // fields definition
    const feederResult = (
        <Grid container alignItems="center" spacing={2} direction="row">
            <Grid item xs={10}>
                <FieldLabel label="descWithFeederResult" />
            </Grid>
            <Grid item xs={2}>
                <SwitchInput name={`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_FEEDER_RESULT}`} />
            </Grid>
        </Grid>
    );
    const predefinedParameters = (
        <MuiSelectInput
            name={SHORT_CIRCUIT_PREDEFINED_PARAMS}
            options={predefinedParamsOptions}
            onChange={onPredefinedParametersManualChange}
            fullWidth
        />
    );

    const initialVoltageProfileModeField = (
        <RadioInput
            name={`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE}`}
            options={Object.values(initialVoltageProfileMode)}
        />
    );
    const loads = <CheckboxInput name={`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_LOADS}`} label="shortCircuitLoads" />;
    const vsc = (
        <CheckboxInput
            name={`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS}`}
            label="shortCircuitHvdc"
        />
    );
    const shuntCompensators = (
        <CheckboxInput
            name={`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS}`}
            label="shortCircuitShuntCompensators"
        />
    );
    const neutralPosition = (
        <CheckboxInput
            name={`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_NEUTRAL_POSITION}`}
            label="shortCircuitNeutralPosition"
        />
    );

    // Forced to specificly manage this onlyStartedGenerators parameter because it's a boolean type, but we want to use a radio button here.
    const onlyStartedGenerators = (
        <RadioInput
            name={`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS}`}
            options={Object.values(onlyStartedGeneratorsOptions)}
            formProps={{
                onChange: (_event, value) => {
                    setValue(`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS}`, value === 'true', {
                        shouldDirty: true,
                    });
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

    useEffect(() => {
        // To show the right status, we need to check the predefinedParams and initial voltage profile mode values.
        // Show success only if ICC_MAX_WITH_NOMINAL_VOLTAGE_MAP is associated with NOMINAL, or ICC_MAX_WITH_CEI909 with CEI909, or ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP with NOMINAL
        const isIccMaxWithNominalVoltageMap =
            watchPredefinedParams === PredefinedParameters.ICC_MAX_WITH_NOMINAL_VOLTAGE_MAP;

        const isIccMinWithNominal = watchPredefinedParams === PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP;

        const isInitialVoltageNominal = watchInitialVoltageProfileMode === InitialVoltage.NOMINAL;

        const isIccMaxNominalDefaultConfiguration = isIccMaxWithNominalVoltageMap && isInitialVoltageNominal;
        const isIccMinNominalDefaultConfiguration = isIccMinWithNominal && isInitialVoltageNominal;

        const isCEI909DefaultConfiguration =
            watchPredefinedParams === PredefinedParameters.ICC_MAX_WITH_CEI909 &&
            watchInitialVoltageProfileMode === InitialVoltage.CEI909;

        const isIccMaxDefaultConfiguration =
            (isIccMaxNominalDefaultConfiguration || isCEI909DefaultConfiguration) &&
            isIccMaxFeaturesDefaultConfiguration;

        const isIccMinDefaultConfiguration =
            isIccMinNominalDefaultConfiguration && isIccMinFeaturesDefaultConfiguration;
        setStatus(isIccMaxDefaultConfiguration || isIccMinDefaultConfiguration ? Status.SUCCESS : Status.ERROR);
    }, [
        watchInitialVoltageProfileMode,
        watchPredefinedParams,
        isIccMaxFeaturesDefaultConfiguration,
        isIccMinFeaturesDefaultConfiguration,
    ]);

    return (
        <Grid container spacing={2} paddingLeft={2}>
            <Grid container paddingTop={2} xl={6}>
                <GridItem size={10}>{feederResult}</GridItem>
            </Grid>
            <GridSection title="ShortCircuitPredefinedParameters" heading={4} />
            <Grid xl={6} container spacing={1} alignItems="center">
                <GridItem size={9}>{predefinedParameters}</GridItem>
                <GridItem size={2}>{statusToShow}</GridItem>
            </Grid>
            <GridSection title="ShortCircuitCharacteristics" heading={4} />
            <Grid container spacing={5}>
                <Grid item>
                    <GridItem>{loads}</GridItem>
                    <GridItem>{shuntCompensators}</GridItem>
                </Grid>
                <Grid item xs={8}>
                    <GridItem>{vsc}</GridItem>
                    <GridItem>{neutralPosition}</GridItem>
                </Grid>
            </Grid>
            <GridSection title="ShortCircuitVoltageProfileMode" heading={4} />
            <Grid container>
                <GridItem size={12}>{initialVoltageProfileModeField}</GridItem>
            </Grid>
            <VoltageTable voltageProfileMode={watchInitialVoltageProfileMode} />
            {isThereSpecificParameters && (
                <>
                    <GridSection title="ShortCircuitStartedGeneratorsMode" heading={4} />
                    <Grid container>
                        <GridItem size={12}>{onlyStartedGenerators}</GridItem>
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
                        </>
                    )}
                </>
            )}
        </Grid>
    );
}
