/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { GridItem, TextInput } from '../../../../components';
import { FieldConstants } from '../../../../utils';
import { filledTextField } from '../../common';

export interface StaticVarCompensatorDialogHeaderProps {
    isEquipmentModification?: boolean;
    previousName?: string;
}

export function StaticVarCompensatorDialogHeader({
    isEquipmentModification = false,
    previousName,
}: Readonly<StaticVarCompensatorDialogHeaderProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const staticCompensatorIdField = isEquipmentModification ? (
        <TextField
            size="small"
            fullWidth
            label="ID"
            value={equipmentId ?? ''}
            slotProps={{ input: { readOnly: true } }}
            disabled
            {...filledTextField}
        />
    ) : (
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={{ autoFocus: true, variant: 'filled' }} />
    );

    const staticCompensatorNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={{ variant: 'filled' }}
            previousValue={previousName}
            clearable={isEquipmentModification}
        />
    );
    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <GridItem size={4}>{staticCompensatorIdField}</GridItem>
            <GridItem size={4}>{staticCompensatorNameField}</GridItem>
        </Grid>
    );
}
