/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useWatch } from 'react-hook-form';
import { Grid } from '@mui/material';
import { ReactiveCapabilityCurveTableForm } from './reactiveCapabilityCurve/ReactiveCapabilityCurveTableForm';
import { MinMaxReactiveLimitsFormInfos, ReactiveCapabilityCurvePoints } from './reactiveLimits.type';
import { FieldConstants, ReactivePowerAdornment } from '../../../../utils';
import { FloatInput, RadioInput } from '../../../inputs';
import GridItem from '../../../grid/grid-item';
import { REACTIVE_LIMIT_TYPES } from './reactiveLimits.utils';

const headerIds = ['ActivePowerText', 'MinimumReactivePower', 'MaximumReactivePower'];
export interface ReactiveLimitsFormProps {
    id?: string;
    previousReactiveCapabilityCurvePoints?: ReactiveCapabilityCurvePoints[] | null;
    previousMinMaxReactiveLimits?: MinMaxReactiveLimitsFormInfos | null;
    updatePreviousReactiveCapabilityCurveTable?: (action: string, index: number) => void;
}
export function ReactiveLimitsForm({
    id = FieldConstants.REACTIVE_LIMITS,
    previousReactiveCapabilityCurvePoints = undefined,
    previousMinMaxReactiveLimits = undefined,
    updatePreviousReactiveCapabilityCurveTable = undefined,
}: Readonly<ReactiveLimitsFormProps>) {
    const reactiveCapabilityCurveChoice = useWatch({
        name: `${id}.${FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE}`,
    });

    const isReactiveCapabilityCurveOn = reactiveCapabilityCurveChoice !== 'MINMAX';

    const reactiveCapabilityCurveChoiceRadioField = (
        <RadioInput
            name={`${id}.${FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE}`}
            options={[...REACTIVE_LIMIT_TYPES]}
            formProps={{ style: { marginTop: '-12px' } }}
        />
    );

    const minimumReactivePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.MINIMUM_REACTIVE_POWER}`}
            label="MinimumReactivePower"
            adornment={ReactivePowerAdornment}
            previousValue={previousMinMaxReactiveLimits?.minQ ?? undefined}
            clearable
        />
    );

    const maximumReactivePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.MAXIMUM_REACTIVE_POWER}`}
            label="MaximumReactivePower"
            adornment={ReactivePowerAdornment}
            previousValue={previousMinMaxReactiveLimits?.maxQ ?? undefined}
            clearable
        />
    );

    const reactiveCapabilityCurveTableField = (
        <ReactiveCapabilityCurveTableForm
            id={`${id}.${FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE}`}
            tableHeadersIds={headerIds}
            previousValues={previousReactiveCapabilityCurvePoints ?? undefined}
            updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTable}
            disabled={!isReactiveCapabilityCurveOn}
        />
    );

    return (
        <Grid container spacing={2}>
            <GridItem size={12}>{reactiveCapabilityCurveChoiceRadioField}</GridItem>
            {!isReactiveCapabilityCurveOn && <GridItem size={4}>{minimumReactivePowerField}</GridItem>}
            {!isReactiveCapabilityCurveOn && <GridItem size={4}>{maximumReactivePowerField}</GridItem>}
            {!isReactiveCapabilityCurveOn && <GridItem size="auto" />}
            {isReactiveCapabilityCurveOn && <GridItem size={12}>{reactiveCapabilityCurveTableField}</GridItem>}
        </Grid>
    );
}
