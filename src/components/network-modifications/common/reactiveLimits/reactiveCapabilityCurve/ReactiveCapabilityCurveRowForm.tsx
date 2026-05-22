/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { ActivePowerAdornment, FieldConstants, ReactivePowerAdornment } from '../../../../../utils';
import { FloatInput } from '../../../../inputs';
import GridItem from '../../../../grid/grid-item';

export interface ReactiveCapabilityCurveRowFormProps {
    id: string;
    index: number;
    labelSuffix: string | number;
}

export function ReactiveCapabilityCurveRowForm({
    id,
    index,
    labelSuffix,
}: Readonly<ReactiveCapabilityCurveRowFormProps>) {
    const {
        trigger,
        formState: { isSubmitted },
    } = useFormContext();

    const triggerTableValidation = useCallback(() => {
        if (isSubmitted) {
            trigger(`${FieldConstants.REACTIVE_LIMITS}.${FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE}`);
        }
    }, [isSubmitted, trigger]);

    const triggerTableAndSiblingsValidation = useCallback(() => {
        if (isSubmitted) {
            trigger([
                `${id}[${index}].${FieldConstants.MIN_Q}`,
                `${id}[${index}].${FieldConstants.MAX_Q}`,
                `${FieldConstants.REACTIVE_LIMITS}.${FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE}`,
            ]);
        }
    }, [isSubmitted, id, index, trigger]);

    const pField = (
        <FloatInput
            name={`${id}.${index}.${FieldConstants.P}`}
            label="P"
            labelValues={{ labelSuffix }}
            adornment={ActivePowerAdornment}
            onChange={triggerTableValidation}
        />
    );

    const qminPField = (
        <FloatInput
            name={`${id}.${index}.${FieldConstants.MIN_Q}`}
            label="QminP"
            labelValues={{ labelSuffix }}
            adornment={ReactivePowerAdornment}
            onChange={triggerTableAndSiblingsValidation}
        />
    );

    const qmaxPField = (
        <FloatInput
            name={`${id}.${index}.${FieldConstants.MAX_Q}`}
            label="QmaxP"
            labelValues={{ labelSuffix }}
            adornment={ReactivePowerAdornment}
            onChange={triggerTableAndSiblingsValidation}
        />
    );

    return (
        <>
            <GridItem size={3}>{pField}</GridItem>
            <GridItem size={3}>{qminPField}</GridItem>
            <GridItem size={3}>{qmaxPField}</GridItem>
        </>
    );
}
