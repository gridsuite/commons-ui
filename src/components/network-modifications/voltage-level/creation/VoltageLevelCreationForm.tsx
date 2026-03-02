/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import GridItem from '../../../grid/grid-item';
import GridSection from '../../../grid/grid-section';
import { TextInput } from '../../../inputs';
import { AutocompleteInput } from '../../../inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
import { FloatInput } from '../../../inputs/reactHookForm/numbers/FloatInput';
import { FieldConstants, KiloAmpereAdornment, VoltageAdornment } from '../../../../utils';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';
import {
    VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
    VL_HIGH_VOLTAGE_LIMIT,
    VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
    VL_LOW_VOLTAGE_LIMIT,
    VL_NOMINAL_V,
    VL_SUBSTATION_ID,
} from './voltageLevelCreation.utils';

export interface VoltageLevelCreationFormProps {
    substationOptions?: string[];
    substationFieldAdditionalProps?: Record<string, unknown>;
    customSubstationSection?: ReactNode;
    hideNominalVoltage?: boolean;
    children?: ReactNode;
}

export function VoltageLevelCreationForm({
    substationOptions,
    substationFieldAdditionalProps,
    customSubstationSection,
    hideNominalVoltage = false,
    children,
}: VoltageLevelCreationFormProps = {}) {
    const voltageLevelIdField = <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={filledTextField} />;

    const voltageLevelNameField = (
        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
    );

    const substationField = substationOptions ? (
        <AutocompleteInput
            openOnFocus
            forcePopupIcon
            name={VL_SUBSTATION_ID}
            label="SUBSTATION"
            options={substationOptions}
            size="small"
            formProps={filledTextField}
            allowNewValue
            {...substationFieldAdditionalProps}
        />
    ) : (
        <TextInput name={VL_SUBSTATION_ID} label="SUBSTATION" formProps={filledTextField} />
    );

    const nominalVoltageField = <FloatInput name={VL_NOMINAL_V} label="NominalVoltage" adornment={VoltageAdornment} />;

    const lowVoltageLimitField = (
        <FloatInput name={VL_LOW_VOLTAGE_LIMIT} label="LowVoltageLimit" adornment={VoltageAdornment} />
    );

    const highVoltageLimitField = (
        <FloatInput name={VL_HIGH_VOLTAGE_LIMIT} label="HighVoltageLimit" adornment={VoltageAdornment} />
    );

    const lowShortCircuitCurrentLimitField = (
        <FloatInput
            name={VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT}
            label="LowShortCircuitCurrentLimit"
            adornment={KiloAmpereAdornment}
        />
    );

    const highShortCircuitCurrentLimitField = (
        <FloatInput
            name={VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT}
            label="HighShortCircuitCurrentLimit"
            adornment={KiloAmpereAdornment}
        />
    );

    return (
        <>
            <Grid container spacing={2}>
                <GridItem>{voltageLevelIdField}</GridItem>
                <GridItem>{voltageLevelNameField}</GridItem>
            </Grid>

            {customSubstationSection ?? (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        {substationField}
                    </Grid>
                </Grid>
            )}

            <GridSection title="VoltageText" />
            <Grid container spacing={2}>
                {!hideNominalVoltage && <GridItem size={4}>{nominalVoltageField}</GridItem>}
                <GridItem size={4}>{lowVoltageLimitField}</GridItem>
                <GridItem size={4}>{highVoltageLimitField}</GridItem>
            </Grid>

            <GridSection title="ShortCircuit" />
            <Grid container spacing={2}>
                <GridItem size={4}>{lowShortCircuitCurrentLimitField}</GridItem>
                <GridItem size={4}>{highShortCircuitCurrentLimitField}</GridItem>
                <Box sx={{ width: '100%' }} />
            </Grid>

            {children}

            <PropertiesForm networkElementType="voltageLevel" />
        </>
    );
}
