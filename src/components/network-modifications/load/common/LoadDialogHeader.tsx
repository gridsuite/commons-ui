/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { LoadFormInfos } from './load.types';
import { filledTextField } from '../../common';
import { SelectInput, TextInput } from '../../../inputs';
import { FieldConstants, getLoadTypeLabel, LOAD_TYPES } from '../../../../utils';

export interface LoadDialogHeaderProps {
    loadToModify?: LoadFormInfos | null;
    isModification?: boolean;
}

export function LoadDialogHeader({ loadToModify, isModification = false }: Readonly<LoadDialogHeaderProps>) {
    const intl = useIntl();
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const loadIdField = isModification ? (
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

    const loadNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={loadToModify?.name}
            clearable
        />
    );

    const loadTypeField = (
        <SelectInput
            name={FieldConstants.LOAD_TYPE}
            label="loadType"
            options={Object.values(LOAD_TYPES)}
            fullWidth
            size="small"
            formProps={filledTextField}
            previousValue={
                loadToModify?.type && loadToModify.type !== 'UNDEFINED'
                    ? intl.formatMessage({
                          id: getLoadTypeLabel(loadToModify.type),
                      })
                    : undefined
            }
        />
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs>
                {loadIdField}
            </Grid>
            <Grid item xs>
                {loadNameField}
            </Grid>
            <Grid item xs>
                {loadTypeField}
            </Grid>
        </Grid>
    );
}
