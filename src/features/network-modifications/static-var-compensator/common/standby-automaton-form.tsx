/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Grid, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { FieldConstants, VoltageAdornment } from '../../../../utils';
import { CheckboxInput, CheckboxNullableInput, FloatInput, SelectInput, SwitchInput } from '../../../../components';
import { SusceptanceArea } from './susceptance-area';
import { STANDBY_AUTOMATON_ACTIONS, VOLTAGE_REGULATION_MODES } from './constants';
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';
import { getPreviousRegulationMode } from './set-points-limits-form-utils';

type FieldKeys =
    'modeAutomaton' | 'standby' | 'lVoltageSetLimit' | 'hVoltageSetLimit' | 'lVoltageThreshold' | 'hVoltageThreshold';

const AUTOMATON_FIELDS = [
    FieldConstants.STAND_BY_AUTOMATON,
    FieldConstants.LOW_VOLTAGE_SET_POINT,
    FieldConstants.HIGH_VOLTAGE_SET_POINT,
    FieldConstants.LOW_VOLTAGE_THRESHOLD,
    FieldConstants.HIGH_VOLTAGE_THRESHOLD,
    FieldConstants.B0,
    FieldConstants.Q0,
];

const ACTIONS_WITH_AUTOMATON = [STANDBY_AUTOMATON_ACTIONS.MODIFY, STANDBY_AUTOMATON_ACTIONS.REMOVE];
const ACTIONS_WITHOUT_AUTOMATON = [
    STANDBY_AUTOMATON_ACTIONS.NOTHING,
    STANDBY_AUTOMATON_ACTIONS.ADD_OR_MODIFY,
    STANDBY_AUTOMATON_ACTIONS.REMOVE,
];

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

    const watchAddStandbyAutomatonProps = useWatch({
        name: `${id}.${FieldConstants.ADD_STAND_BY_AUTOMATON}`,
    });
    const watchAutomatonAction = useWatch({
        name: `${id}.${FieldConstants.STAND_BY_AUTOMATON_ACTION}`,
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

    const isAutomatonAdded =
        isEquipmentModification &&
        !hasPreviousAutomaton &&
        watchAutomatonAction === STANDBY_AUTOMATON_ACTIONS.ADD_OR_MODIFY.id;

    const showAutomatonFields = isEquipmentModification
        ? watchAutomatonAction === STANDBY_AUTOMATON_ACTIONS.MODIFY.id ||
          watchAutomatonAction === STANDBY_AUTOMATON_ACTIONS.ADD_OR_MODIFY.id
        : !!watchAddStandbyAutomatonProps;

    useEffect(() => {
        if (!isEquipmentModification || !previousValues) {
            return;
        }
        const actionFieldName = `${id}.${FieldConstants.STAND_BY_AUTOMATON_ACTION}`;
        const action = getValues(actionFieldName);
        if (action === STANDBY_AUTOMATON_ACTIONS.REMOVE.id) {
            return;
        }
        let newAction;
        if (hasPreviousAutomaton) {
            newAction = STANDBY_AUTOMATON_ACTIONS.MODIFY.id;
        } else if (action === STANDBY_AUTOMATON_ACTIONS.NOTHING.id) {
            newAction = action;
        } else {
            const isAnyFieldFilled = AUTOMATON_FIELDS.some((field) => getValues(`${id}.${field}`) != null);
            newAction =
                action === STANDBY_AUTOMATON_ACTIONS.ADD_OR_MODIFY.id || isAnyFieldFilled
                    ? STANDBY_AUTOMATON_ACTIONS.ADD_OR_MODIFY.id
                    : STANDBY_AUTOMATON_ACTIONS.NOTHING.id;
        }
        if (newAction !== action) {
            setValue(actionFieldName, newAction);
        }
    }, [isEquipmentModification, previousValues, hasPreviousAutomaton, watchAutomatonAction, getValues, setValue, id]);

    useEffect(() => {
        if (!standbyDisabled) {
            return;
        }
        const standbyFieldName = `${id}.${FieldConstants.STAND_BY_AUTOMATON}`;
        if (!isEquipmentModification) {
            setValue(standbyFieldName, false);
            return;
        }
        if (!watchVoltageMode) {
            return;
        }
        const standbyValue = getValues(standbyFieldName);
        if (standbyValue === true || (standbyValue == null && previousAutomaton?.standby)) {
            setValue(standbyFieldName, false);
        }
    }, [
        standbyDisabled,
        watchVoltageMode,
        setValue,
        getValues,
        id,
        isEquipmentModification,
        previousAutomaton?.standby,
    ]);

    useEffect(() => {
        // a new automaton is added on an equipment without one: standby is off by default, as in creation
        if (!isAutomatonAdded) {
            return;
        }
        const standbyFieldName = `${id}.${FieldConstants.STAND_BY_AUTOMATON}`;
        if (getValues(standbyFieldName) == null) {
            setValue(standbyFieldName, false);
        }
    }, [isAutomatonAdded, getValues, setValue, id]);

    useEffect(() => {
        if (!isEquipmentModification || watchAutomatonAction == null || showAutomatonFields) {
            return;
        }
        AUTOMATON_FIELDS.forEach((field) => {
            const fieldName = `${id}.${field}`;
            if (getValues(fieldName) != null) {
                setValue(fieldName, null);
            }
        });
    }, [isEquipmentModification, watchAutomatonAction, showAutomatonFields, getValues, setValue, id]);

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
            nullDisabled
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
        />
    );

    const standbyNotAvailableInfo = standbyDisabled && (
        <Tooltip title={<FormattedMessage id="StandbyNotAvailable" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 42 }}>
                <InfoOutlined color="info" fontSize="small" />
            </Box>
        </Tooltip>
    );

    // modification: "Status: [ ] Standby" on its own line, without the regulation mode field
    const standbyStatusField = (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 42 }}>
                <Typography>
                    <FormattedMessage id="StandbyStatus" />
                </Typography>
            </Box>
            <Box sx={{ flex: 'none' }}>{standbyField}</Box>
            {standbyNotAvailableInfo}
        </Stack>
    );

    const creationOnlyFields: Partial<Record<FieldKeys, ReactNode>> = isEquipmentModification
        ? {}
        : {
              modeAutomaton: (
                  <TextField
                      value={voltageModeLabel ? intl.formatMessage({ id: voltageModeLabel }) : ''}
                      label={intl.formatMessage({ id: 'ModeAutomaton' })}
                      disabled
                      size="small"
                  />
              ),
              standby: (
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 'none' }}>{standbyField}</Box>
                      {standbyNotAvailableInfo}
                  </Stack>
              ),
          };

    const fields: Partial<Record<FieldKeys, ReactNode>> = {
        ...creationOnlyFields,
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
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                                <SelectInput
                                    name={`${id}.${FieldConstants.STAND_BY_AUTOMATON_ACTION}`}
                                    options={hasPreviousAutomaton ? ACTIONS_WITH_AUTOMATON : ACTIONS_WITHOUT_AUTOMATON}
                                    size="small"
                                    disableClearable
                                    disabled={!previousValues}
                                />
                            </Box>
                            {watchAutomatonAction === STANDBY_AUTOMATON_ACTIONS.ADD_OR_MODIFY.id && (
                                <Tooltip title={<FormattedMessage id="StandbyAutomatonAddOrModifyInfo" />}>
                                    <InfoOutlined color="info" fontSize="small" sx={{ display: 'block' }} />
                                </Tooltip>
                            )}
                        </Stack>
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
                        {isEquipmentModification && <Grid size={12}>{standbyStatusField}</Grid>}
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
