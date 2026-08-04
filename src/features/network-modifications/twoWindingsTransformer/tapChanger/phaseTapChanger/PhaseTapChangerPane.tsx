/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { PhaseTapChangerPaneSteps } from './PhaseTapChangerPaneSteps';
import {
    getComputedPhaseTapChangerRegulationMode,
    getComputedPreviousPhaseRegulationType,
} from './phaseTapChanger.utils';
import { TapChangerMapInfos, TapChangerPaneProps } from '../../common/twoWindingsTransformer.types';
import { ActivePowerAdornment, AmpereAdornment, FieldConstants, PHASE_REGULATION_MODES } from '../../../../../utils';
import { FloatInput, GridItem, GridSection, SelectInput } from '../../../../../components';
import { RegulatedTerminalSection } from '../RegulatedTerminalSection';

export function PhaseTapChangerPane({
    id = FieldConstants.PHASE_TAP_CHANGER,
    voltageLevelOptions = [],
    previousValues,
    editData,
    fetchVoltageLevelEquipments,
    isModification = false,
}: Readonly<TapChangerPaneProps>) {
    const intl = useIntl();

    const phaseTapChangerEnabledWatch = useWatch({
        name: `${id}.${FieldConstants.ENABLED}`,
    });

    const regulationModeWatch = useWatch({
        name: `${id}.${FieldConstants.REGULATION_MODE}`,
    });

    const regulationTypeWatch = useWatch({
        name: `${id}.${FieldConstants.REGULATION_TYPE}`,
    });

    const getPhaseTapChangerRegulationModeLabel = (phaseTapChangerFormValues?: TapChangerMapInfos | null) => {
        const computedRegulationMode = getComputedPhaseTapChangerRegulationMode(phaseTapChangerFormValues ?? undefined);
        if (computedRegulationMode) {
            return intl.formatMessage({
                id: computedRegulationMode?.label,
            });
        }
    };

    const getRegulatingPreviousValue = (field: string, tap?: TapChangerMapInfos) => {
        if (
            (tap?.[FieldConstants.REGULATION_MODE] === PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id &&
                field === FieldConstants.FLOW_SET_POINT_REGULATING_VALUE) ||
            (tap?.[FieldConstants.REGULATION_MODE] === PHASE_REGULATION_MODES.CURRENT_LIMITER.id &&
                field === FieldConstants.CURRENT_LIMITER_REGULATING_VALUE)
        ) {
            return tap?.regulationValue;
        }
        return undefined;
    };

    const regulationType = useMemo(() => {
        return regulationTypeWatch || getComputedPreviousPhaseRegulationType(previousValues);
    }, [regulationTypeWatch, previousValues]);

    const regulationMode = useMemo(() => {
        return regulationModeWatch || getComputedPhaseTapChangerRegulationMode(previousValues?.phaseTapChanger)?.id;
    }, [regulationModeWatch, previousValues]);

    const regulationModeField = (
        <SelectInput
            name={`${id}.${FieldConstants.REGULATION_MODE}`}
            label="RegulationMode"
            options={Object.values(PHASE_REGULATION_MODES)}
            disabled={!phaseTapChangerEnabledWatch}
            size="small"
            previousValue={getPhaseTapChangerRegulationModeLabel(previousValues?.phaseTapChanger)}
        />
    );

    const currentLimiterRegulatingValueField = (
        <FloatInput
            name={`${id}.${FieldConstants.CURRENT_LIMITER_REGULATING_VALUE}`}
            label="RegulatingValueCurrentLimiter"
            formProps={{
                disabled: !phaseTapChangerEnabledWatch,
            }}
            adornment={AmpereAdornment}
            previousValue={getRegulatingPreviousValue(
                FieldConstants.CURRENT_LIMITER_REGULATING_VALUE,
                previousValues?.phaseTapChanger
            )}
        />
    );

    const flowSetPointRegulatingValueField = (
        <FloatInput
            name={`${id}.${FieldConstants.FLOW_SET_POINT_REGULATING_VALUE}`}
            label="RegulatingValueActivePowerControl"
            adornment={ActivePowerAdornment}
            formProps={{
                disabled: !phaseTapChangerEnabledWatch,
            }}
            previousValue={getRegulatingPreviousValue(
                FieldConstants.FLOW_SET_POINT_REGULATING_VALUE,
                previousValues?.phaseTapChanger
            )}
        />
    );

    const targetDeadbandField = (
        <FloatInput
            name={`${id}.${FieldConstants.TARGET_DEADBAND}`}
            label="Deadband"
            adornment={
                regulationMode === PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id
                    ? ActivePowerAdornment
                    : AmpereAdornment
            }
            formProps={{
                disabled: !phaseTapChangerEnabledWatch,
            }}
            previousValue={previousValues?.phaseTapChanger?.targetDeadband}
        />
    );

    return (
        <>
            <GridSection title="RegulationSection" heading={4} />
            <Grid container spacing={1}>
                <GridItem size={4}>{regulationModeField}</GridItem>
                {regulationMode === PHASE_REGULATION_MODES.CURRENT_LIMITER.id && (
                    <>
                        <GridItem size={4}>{currentLimiterRegulatingValueField}</GridItem>
                        <GridItem size={4}>{targetDeadbandField}</GridItem>
                    </>
                )}
                {regulationMode === PHASE_REGULATION_MODES.ACTIVE_POWER_CONTROL.id && (
                    <>
                        <GridItem size={4}>{flowSetPointRegulatingValueField}</GridItem>
                        <GridItem size={4}>{targetDeadbandField}</GridItem>
                    </>
                )}
            </Grid>

            {phaseTapChangerEnabledWatch && regulationMode && (
                <RegulatedTerminalSection
                    id={id}
                    voltageLevelOptions={voltageLevelOptions}
                    previousValues={previousValues}
                    tapChangerDisabled={!phaseTapChangerEnabledWatch}
                    regulationType={regulationType}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            )}
            <GridSection title="TapsSection" heading={4} />
            <PhaseTapChangerPaneSteps
                disabled={!phaseTapChangerEnabledWatch}
                previousValues={previousValues?.phaseTapChanger}
                editData={editData}
                isModification={isModification}
            />
        </>
    );
}
