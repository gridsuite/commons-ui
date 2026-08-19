/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { VSC_CONVERTER_MODE, VscHvdcLineInfo } from '../vscHvdcLine.types';
import { ActivePowerAdornment, FieldConstants, OhmAdornment, VoltageAdornment } from '../../../../../../utils';
import {
    CheckboxNullableInput,
    FloatInput,
    GridItem,
    GridSection,
    SelectInput,
    SwitchInput,
} from '../../../../../../components';
import { PropertiesForm } from '../../../../common/properties';

interface VscHvdcLinePaneProps {
    id?: string;
    isModification: boolean;
    hvdcLineToModify?: VscHvdcLineInfo | null;
}

export function VscHvdcLinePane({
    id = FieldConstants.HVDC_LINE,
    isModification = false,
    hvdcLineToModify,
}: Readonly<VscHvdcLinePaneProps>) {
    const intl = useIntl();
    const { trigger } = useFormContext();

    const angleDroopWatch = useWatch({
        name: `${id}.${FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL}`,
    });

    useEffect(() => {
        if (!angleDroopWatch) {
            trigger(`${id}.${FieldConstants.P0}`);
            trigger(`${id}.${FieldConstants.DROOP}`);
        }
    }, [angleDroopWatch, trigger, id]);

    const dcNominalVoltageField = (
        <FloatInput
            name={`${id}.${FieldConstants.NOMINAL_V}`}
            adornment={VoltageAdornment}
            label="dcNominalVoltageLabel"
            previousValue={hvdcLineToModify?.nominalV}
        />
    );

    const dcResistanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.R}`}
            adornment={OhmAdornment}
            label="dcResistanceLabel"
            previousValue={hvdcLineToModify?.r}
        />
    );

    const maximumActivePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAX_P}`}
            adornment={ActivePowerAdornment}
            label="MaximumActivePowerText"
            previousValue={hvdcLineToModify?.maxP}
        />
    );

    const operatorActivePowerLimitSide1Field = (
        <FloatInput
            name={`${id}.${FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1}`}
            adornment={ActivePowerAdornment}
            label="operatorActivePowerLimitSide1Label"
            previousValue={hvdcLineToModify?.hvdcOperatorActivePowerRange?.oprFromCS1toCS2}
        />
    );

    const operatorActivePowerLimitSide2Field = (
        <FloatInput
            name={`${id}.${FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2}`}
            adornment={ActivePowerAdornment}
            label="operatorActivePowerLimitSide2Label"
            previousValue={hvdcLineToModify?.hvdcOperatorActivePowerRange?.oprFromCS2toCS1}
        />
    );

    const previousConverterMode = () => {
        if (hvdcLineToModify?.convertersMode === VSC_CONVERTER_MODE.SIDE_1_INVERTER_SIDE_2_RECTIFIER.id) {
            return intl.formatMessage({
                id: VSC_CONVERTER_MODE.SIDE_1_INVERTER_SIDE_2_RECTIFIER.label,
            });
        }
        if (hvdcLineToModify?.convertersMode === VSC_CONVERTER_MODE.SIDE_1_RECTIFIER_SIDE_2_INVERTER.id) {
            return intl.formatMessage({
                id: VSC_CONVERTER_MODE.SIDE_1_RECTIFIER_SIDE_2_INVERTER.label,
            });
        }
    };

    const converterModeField = (
        <SelectInput
            name={`${id}.${FieldConstants.CONVERTERS_MODE}`}
            label="converterModeLabel"
            options={Object.values(VSC_CONVERTER_MODE)}
            size="small"
            disableClearable
            previousValue={previousConverterMode()}
        />
    );

    const activePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.ACTIVE_POWER_SET_POINT}`}
            label="ActivePowerText"
            adornment={ActivePowerAdornment}
            previousValue={hvdcLineToModify?.activePowerSetpoint}
        />
    );

    const previousAngleDropPowerControl = () => {
        if (hvdcLineToModify?.hvdcAngleDroopActivePowerControl?.isEnabled === true) {
            return intl.formatMessage({ id: 'On' });
        }

        return intl.formatMessage({ id: 'Off' });
    };

    function getAngleDroopActivePowerControlField() {
        if (isModification) {
            return (
                <CheckboxNullableInput
                    name={`${id}.${FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL}`}
                    label="angleDroopActivePowerControlLabel"
                    previousValue={previousAngleDropPowerControl()}
                />
            );
        }
        return (
            <SwitchInput
                name={`${id}.${FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL}`}
                label="angleDroopActivePowerControlLabel"
            />
        );
    }

    const AngleDroopActivePowerControl = getAngleDroopActivePowerControlField();

    const p0Field = (
        <FloatInput
            name={`${id}.${FieldConstants.P0}`}
            label="p0Label"
            adornment={ActivePowerAdornment}
            previousValue={hvdcLineToModify?.hvdcAngleDroopActivePowerControl?.p0}
        />
    );

    const droopField = (
        <FloatInput
            name={`${id}.${FieldConstants.DROOP}`}
            label="droopLabel"
            previousValue={hvdcLineToModify?.hvdcAngleDroopActivePowerControl?.droop}
        />
    );

    return (
        <>
            <GridSection title="Characteristics" />
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <GridItem>{dcNominalVoltageField}</GridItem>
                <GridItem>{dcResistanceField}</GridItem>
                <GridItem>{maximumActivePowerField}</GridItem>
            </Grid>
            <GridSection title="Limits" />
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <GridItem>{operatorActivePowerLimitSide1Field}</GridItem>
                <GridItem>{operatorActivePowerLimitSide2Field}</GridItem>
            </Grid>
            <GridSection title="Setpoints" />
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <GridItem>{converterModeField}</GridItem>
                <GridItem>{activePowerField}</GridItem>
                <GridItem size={12}>{AngleDroopActivePowerControl}</GridItem>
                <GridItem>{droopField}</GridItem>
                <GridItem>{p0Field}</GridItem>
            </Grid>
            <PropertiesForm isModification={isModification} />
        </>
    );
}
