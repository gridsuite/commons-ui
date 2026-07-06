/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { filledTextField } from '../../common';
import { TextInput } from '../../../../components/ui';
import { FieldConstants } from '../../../../utils';
import { BranchInfos } from './line.types';
import { LineDialogOptions } from './line.utils';
import { GridItem } from '../../../../components';

export interface LineDialogHeaderProps extends LineDialogOptions {
    lineToModify?: BranchInfos | null;
}

export function LineDialogHeader({ lineToModify, isModification = false }: Readonly<LineDialogHeaderProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const lineIdField = isModification ? (
        <TextField
            size="small"
            fullWidth
            label="ID"
            value={equipmentId ?? ''}
            slotProps={{
                input: {
                    readOnly: true,
                },
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
        <Grid container spacing={2} size={12}>
            <GridItem size={4}>{lineIdField}</GridItem>
            <GridItem size={4}>{lineNameField}</GridItem>
        </Grid>
    );
}
