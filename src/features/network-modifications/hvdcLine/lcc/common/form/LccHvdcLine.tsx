/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { Grid } from '@mui/material';
import { LccHvdcLineFormInfos } from '../lccHvdcLine.types';
import { FloatInput, GridItem, GridSection, SelectInput } from '../../../../../../components';
import { ActivePowerAdornment, FieldConstants, OhmAdornment, VoltageAdornment } from '../../../../../../utils';
import { VSC_CONVERTER_MODE, VscConverterMode } from '../../../vsc';
import { PropertiesForm } from '../../../../common';

interface LccHvdcLineProps {
    id: string;
    lccHvdcLineToModify?: LccHvdcLineFormInfos | null;
    isModification?: boolean;
}

export function LccHvdcLine({ id, lccHvdcLineToModify, isModification = false }: Readonly<LccHvdcLineProps>) {
    const intl = useIntl();
    const dcNominalVoltageField = (
        <FloatInput
            name={`${id}.${FieldConstants.NOMINAL_V}`}
            adornment={VoltageAdornment}
            label="dcNominalVoltageLabel"
            previousValue={lccHvdcLineToModify?.nominalV}
            clearable={isModification}
        />
    );

    const dcResistanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.R}`}
            adornment={OhmAdornment}
            label="dcResistanceLabel"
            previousValue={lccHvdcLineToModify?.r}
            clearable={isModification}
        />
    );

    const maximumActivePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAX_P}`}
            adornment={ActivePowerAdornment}
            label="MaximumActivePowerText"
            previousValue={lccHvdcLineToModify?.maxP}
            clearable={isModification}
        />
    );

    const converterModeField = (
        <SelectInput
            name={`${id}.${FieldConstants.CONVERTERS_MODE}`}
            label="converterModeLabel"
            options={Object.values(VSC_CONVERTER_MODE)}
            size="small"
            disableClearable
            previousValue={
                lccHvdcLineToModify
                    ? intl.formatMessage({
                          id: VSC_CONVERTER_MODE[lccHvdcLineToModify.convertersMode as VscConverterMode].label,
                      })
                    : undefined
            }
        />
    );

    const activePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.ACTIVE_POWER_SET_POINT}`}
            label="ActivePowerText"
            adornment={ActivePowerAdornment}
            previousValue={lccHvdcLineToModify?.activePowerSetpoint}
            clearable={isModification}
        />
    );

    return (
        <>
            <GridSection title="Characteristics" />
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <GridItem>{dcNominalVoltageField}</GridItem>
                <GridItem>{dcResistanceField}</GridItem>
                <GridItem>{maximumActivePowerField}</GridItem>
            </Grid>
            <GridSection title="Setpoints" />
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <GridItem>{converterModeField}</GridItem>
                <GridItem>{activePowerField}</GridItem>
            </Grid>
            <PropertiesForm id={id} isModification={isModification} />
        </>
    );
}
