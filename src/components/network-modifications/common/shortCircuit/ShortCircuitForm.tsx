/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { ShortCircuitInfos } from './shortCircuitForm.type';
import { FloatInput } from '../../../inputs';
import { FieldConstants, OhmAdornment } from '../../../../utils';
import GridItem from '../../../grid/grid-item';

export interface ShortCircuitFormProps {
    previousValues?: ShortCircuitInfos;
}

export function ShortCircuitForm({ previousValues }: Readonly<ShortCircuitFormProps>) {
    const transientReactanceField = (
        <FloatInput
            name={FieldConstants.TRANSIENT_REACTANCE}
            label="TransientReactanceForm"
            adornment={OhmAdornment}
            previousValue={previousValues?.directTransX ?? undefined}
            clearable
        />
    );

    const transformerReactanceField = (
        <FloatInput
            name={FieldConstants.TRANSFORMER_REACTANCE}
            label="TransformerReactanceForm"
            adornment={OhmAdornment}
            previousValue={
                Number.isNaN(Number(previousValues?.stepUpTransformerX))
                    ? undefined
                    : (previousValues?.stepUpTransformerX ?? undefined)
            }
            clearable
        />
    );

    return (
        <Grid container spacing={2}>
            <GridItem size={4}>{transientReactanceField}</GridItem>
            <GridItem size={4}>{transformerReactanceField}</GridItem>
        </Grid>
    );
}
