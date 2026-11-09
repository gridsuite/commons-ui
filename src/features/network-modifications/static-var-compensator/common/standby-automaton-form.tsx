/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { WarningAmber } from '@mui/icons-material';
import { Box, Grid, TextField, Tooltip } from '@mui/material';
import { FieldConstants, VoltageAdornment } from '../../../../utils';
import { CheckboxInput, CheckboxNullableInput, FloatInput, SwitchInput } from '../../../../components';
import { SusceptanceArea } from './susceptance-area';
import { VOLTAGE_REGULATION_MODES } from './constants';
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';
import { getPreviousRegulationMode } from './set-points-limits-form';

type FieldKeys = 'standby' | 'lVoltageSetLimit' | 'hVoltageSetLimit' | 'lVoltageThreshold' | 'hVoltageThreshold';

export interface StandbyAutomatonFormProps {
    isEquipmentModification?: boolean;
    previousValues?: StaticVarCompensatorFormInfo | null;
}

export function StandbyAutomatonForm({
    isEquipmentModification = false,
    previousValues,
}: Readonly<StandbyAutomatonFormProps>) {
    const intl = useIntl();
    const id = FieldConstants.AUTOMATON;
    const { setValue, getValues } = useFormContext();

    const previousAutomaton = previousValues?.standbyAutomatonInfos;
    const hasPreviousAutomaton = previousAutomaton != null;

    const [hover, setHover] = useState(false);
    const watchAddStandbyAutomatonProps = useWatch({
        name: `${id}.${FieldConstants.ADD_STAND_BY_AUTOMATON}`,
    });
    const watchVoltageMode = useWatch({
        name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.VOLTAGE_REGULATION_MODE}`,
    });

    const voltageMode = useMemo(() => {
        if (watchVoltageMode || !isEquipmentModification) {
            return watchVoltageMode;
        }
        return getPreviousRegulationMode(previousValues)?.id;
    }, [watchVoltageMode, isEquipmentModification, previousValues]);

    const voltageModeLabel = useMemo(() => {
        return Object.values(VOLTAGE_REGULATION_MODES).find((mode) => mode.id === voltageMode)?.label;
    }, [voltageMode]);

    const standbyDisabled = voltageMode !== VOLTAGE_REGULATION_MODES.VOLTAGE.id;

    const showAutomatonFields = isEquipmentModification
        ? watchAddStandbyAutomatonProps === true || (watchAddStandbyAutomatonProps == null && hasPreviousAutomaton)
        : !!watchAddStandbyAutomatonProps;

    useEffect(() => {
        if (!standbyDisabled) {
            return;
        }
        const standbyFieldName = `${id}.${FieldConstants.STAND_BY_AUTOMATON}`;
        if (!isEquipmentModification) {
            setValue(standbyFieldName, false);
            return;
        }
        const standbyValue = getValues(standbyFieldName);
        if (standbyValue === true || (standbyValue == null && previousAutomaton?.standby)) {
            setValue(standbyFieldName, false);
        }
    }, [standbyDisabled, setValue, getValues, id, isEquipmentModification, previousAutomaton?.standby]);

    const formatOnOff = (value: boolean | undefined) => {
        if (!previousValues) {
            return undefined;
        }
        return intl.formatMessage({ id: value ? 'On' : 'Off' });
    };

    const createField = (
        name: string,
        label: string,
        adornment?: {
            position: string;
            text: string;
        },
        previousValue?: number | null
    ) => (
        <FloatInput
            name={name}
            label={label}
            adornment={adornment}
            previousValue={previousValue ?? undefined}
            clearable={isEquipmentModification}
        />
    );

    const standbyField = isEquipmentModification ? (
        <CheckboxNullableInput
            name={`${id}.${FieldConstants.STAND_BY_AUTOMATON}`}
            label="StandbyAutomaton"
            formProps={{ disabled: standbyDisabled }}
            previousValue={hasPreviousAutomaton ? formatOnOff(previousAutomaton?.standby) : undefined}
        />
    ) : (
        <SwitchInput
            name={`${id}.${FieldConstants.STAND_BY_AUTOMATON}`}
            formProps={{
                disabled: standbyDisabled,
            }}
            label="StandbyAutomaton"
            labelProps={{
                labelPlacement: 'start',
            }}
        />
    );

    const fields = {
        modeAutomaton: (
            <TextField
                value={voltageModeLabel ? intl.formatMessage({ id: voltageModeLabel }) : ''}
                label={intl.formatMessage({ id: 'ModeAutomaton' })}
                disabled
                size="small"
            />
        ),
        standby: (
            <Grid container onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <Grid container sx={{ width: '100%' }}>
                    {standbyField}
                    {hover && standbyDisabled && (
                        <Box
                            sx={{
                                marginLeft: 2,
                                marginTop: '5px',
                            }}
                        >
                            <Tooltip title={<FormattedMessage id="StandbyNotAvailable" />}>
                                <WarningAmber color="warning" />
                            </Tooltip>
                        </Box>
                    )}
                </Grid>
            </Grid>
        ),
        lVoltageSetLimit: createField(
            `${id}.${FieldConstants.LOW_VOLTAGE_SET_POINT}`,
            'LowVoltageSetpoint',
            VoltageAdornment,
            previousAutomaton?.lowVoltageSetpoint
        ),
        hVoltageSetLimit: createField(
            `${id}.${FieldConstants.HIGH_VOLTAGE_SET_POINT}`,
            'HighVoltageSetpoint',
            VoltageAdornment,
            previousAutomaton?.highVoltageSetpoint
        ),
        lVoltageThreshold: createField(
            `${id}.${FieldConstants.LOW_VOLTAGE_THRESHOLD}`,
            'LowVoltageThreshold',
            VoltageAdornment,
            previousAutomaton?.lowVoltageThreshold
        ),
        hVoltageThreshold: createField(
            `${id}.${FieldConstants.HIGH_VOLTAGE_THRESHOLD}`,
            'HighVoltageThreshold',
            VoltageAdornment,
            previousAutomaton?.highVoltageThreshold
        ),
    };

    return (
        <Grid container spacing={2}>
            <Grid size={4}>
                <Box>
                    {isEquipmentModification ? (
                        <CheckboxNullableInput
                            name={`${id}.${FieldConstants.ADD_STAND_BY_AUTOMATON}`}
                            label="StaticVarCompensatorAutomatonTab"
                            previousValue={formatOnOff(hasPreviousAutomaton)}
                        />
                    ) : (
                        <CheckboxInput name={`${id}.${FieldConstants.ADD_STAND_BY_AUTOMATON}`} label="AddAutomaton" />
                    )}
                </Box>
            </Grid>
            {showAutomatonFields && (
                <>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            padding: 2,
                        }}
                    >
                        {Object.keys(fields).map((key: string) => {
                            const typedKey = key as FieldKeys;
                            return (
                                <Grid size={6} key={key}>
                                    {fields[typedKey]}
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            padding: 2,
                        }}
                    >
                        <SusceptanceArea
                            isEquipmentModification={isEquipmentModification}
                            previousValues={previousValues}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
}
