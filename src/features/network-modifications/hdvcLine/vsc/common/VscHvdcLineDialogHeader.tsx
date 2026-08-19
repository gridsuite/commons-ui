/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { FieldConstants } from '../../../../../utils';
import { filledTextField } from '../../../common';
import { GridItem, TextInput } from '../../../../../components';
import { VscHvdcLineInfo } from './vscHvdcLine.types';

export interface VscHvdcLineDialogHeaderProps {
    hvdcLineToModify?: VscHvdcLineInfo | null;
    isModification?: boolean;
}

export function VscHvdcLineDialogHeader({
    hvdcLineToModify,
    isModification = false,
}: Readonly<VscHvdcLineDialogHeaderProps>) {
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
            previousValue={hvdcLineToModify?.name ?? undefined}
            clearable
        />
    );

    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <GridItem size={4}>{lineIdField}</GridItem>
            <GridItem size={4}>{lineNameField}</GridItem>
        </Grid>
    );
}
