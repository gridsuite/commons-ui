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
import { StaticVarCompensatorFormInfo } from './static-var-compensator.types';

export interface StaticVarCompensatorDialogHeaderProps {
    isModification?: boolean;
    staticVarCompensatorToModify?: StaticVarCompensatorFormInfo | null;
}

export function StaticVarCompensatorDialogHeader({
    isModification = false,
    staticVarCompensatorToModify,
}: Readonly<StaticVarCompensatorDialogHeaderProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const staticCompensatorIdField = isModification ? (
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
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={{ autoFocus: true, ...filledTextField }} />
    );

    const staticCompensatorNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={staticVarCompensatorToModify?.name ?? undefined}
            clearable={isModification}
        />
    );
    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <GridItem size={4}>{staticCompensatorIdField}</GridItem>
            <GridItem size={4}>{staticCompensatorNameField}</GridItem>
        </Grid>
    );
}
