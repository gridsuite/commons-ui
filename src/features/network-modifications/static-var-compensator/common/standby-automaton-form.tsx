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
import { Box, FormControlLabel, Grid, TextField, Tooltip } from '@mui/material';
import { FieldConstants, VoltageAdornment } from '../../../../utils';
import { CheckboxInput, FloatInput, SwitchInput } from '../../../../components';
import { SusceptanceArea } from './susceptance-area';
import { VOLTAGE_REGULATION_MODES } from './constants';

type FieldKeys = 'standby' | 'lVoltageSetLimit' | 'hVoltageSetLimit' | 'lVoltageThreshold' | 'hVoltageThreshold';

export function StandbyAutomatonForm() {
    const intl = useIntl();
    const id = FieldConstants.AUTOMATON;
    const { setValue } = useFormContext();

    const [hover, setHover] = useState(false);
    const watchAddStandbyAutomatonProps = useWatch({
        name: `${id}.${FieldConstants.ADD_STAND_BY_AUTOMATON}`,
    });
    const watchVoltageMode = useWatch({
        name: `${FieldConstants.SETPOINTS_LIMITS}.${FieldConstants.VOLTAGE_REGULATION_MODE}`,
    });
    const watchVoltageModeLabel = useMemo(() => {
        return Object.values(VOLTAGE_REGULATION_MODES).find((voltageMode) => voltageMode.id === watchVoltageMode)
            ?.label;
    }, [watchVoltageMode]);

    const standbyDisabled = useMemo(() => {
        return watchVoltageMode !== VOLTAGE_REGULATION_MODES.VOLTAGE.id;
    }, [watchVoltageMode]);

    useEffect(() => {
        if (standbyDisabled) {
            setValue(`${id}.${FieldConstants.STAND_BY_AUTOMATON}`, false);
        }
    }, [standbyDisabled, setValue, id]);

    const createField = (
        name: string,
        label: string,
        adornment?: {
            position: string;
            text: string;
        },
        additionalProps?: { disabled: boolean }
    ) => <FloatInput name={name} label={label} adornment={adornment} formProps={additionalProps} />;

    const fields = {
        modeAutomaton: (
            <TextField
                value={watchVoltageModeLabel ? intl.formatMessage({ id: watchVoltageModeLabel }) : ''}
                label={intl.formatMessage({ id: 'ModeAutomaton' })}
                disabled
                size="small"
            />
        ),
        standby: (
            <Grid container onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <Grid container sx={{ width: '100%' }}>
                    <FormControlLabel
                        value="StandbyAutomaton"
                        control={
                            <SwitchInput
                                name={`${id}.${FieldConstants.STAND_BY_AUTOMATON}`}
                                formProps={{
                                    disabled: standbyDisabled,
                                }}
                            />
                        }
                        label={<FormattedMessage id="StandbyAutomaton" />}
                        labelPlacement="start"
                    />
                    {hover && watchVoltageMode !== VOLTAGE_REGULATION_MODES.VOLTAGE.id && (
                        <Box marginLeft={2} marginTop="5px">
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
            VoltageAdornment
        ),
        hVoltageSetLimit: createField(
            `${id}.${FieldConstants.HIGH_VOLTAGE_SET_POINT}`,
            'HighVoltageSetpoint',
            VoltageAdornment
        ),
        lVoltageThreshold: createField(
            `${id}.${FieldConstants.LOW_VOLTAGE_THRESHOLD}`,
            'LowVoltageThreshold',
            VoltageAdornment
        ),
        hVoltageThreshold: createField(
            `${id}.${FieldConstants.HIGH_VOLTAGE_THRESHOLD}`,
            'HighVoltageThreshold',
            VoltageAdornment
        ),
    };

    return (
        <Grid container spacing={2}>
            <Grid size={4}>
                <Box>
                    <CheckboxInput name={`${id}.${FieldConstants.ADD_STAND_BY_AUTOMATON}`} label="AddAutomaton" />
                </Box>
            </Grid>
            {watchAddStandbyAutomatonProps && (
                <>
                    <Grid container spacing={2} padding={2}>
                        {Object.keys(fields).map((key: string) => {
                            const typedKey = key as FieldKeys;
                            return (
                                <Grid size={6} key={key}>
                                    {fields[typedKey]}
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Grid container spacing={2} padding={2}>
                        <SusceptanceArea />
                    </Grid>
                </>
            )}
        </Grid>
    );
}
