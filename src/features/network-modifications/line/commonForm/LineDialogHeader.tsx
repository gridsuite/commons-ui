/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { filledTextField } from '../../common';
import { TextInput } from '../../../../components/ui';
import { FieldConstants } from '../../../../utils';
import { BranchInfos } from './line.types';

export interface LineDialogHeaderProps {
    lineToModify?: BranchInfos | null;
    isModification?: boolean;
}

export function LineDialogHeader({ lineToModify, isModification = false }: Readonly<LineDialogHeaderProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const lineIdField = isModification ? (
        <TextField
            size="small"
            fullWidth
            label="ID"
            value={equipmentId ?? ''}
            InputProps={{
                readOnly: true,
            }}
            disabled
            {...filledTextField}
        />
    ) : (
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={{ autoFocus: true, ...filledTextField }} />
    );

    const lineNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={lineToModify?.name ?? undefined}
            clearable
        />
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                {lineIdField}
            </Grid>
            <Grid item xs={4}>
                {lineNameField}
            </Grid>
        </Grid>
    );
}
