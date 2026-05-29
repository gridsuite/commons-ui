/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { filledTextField } from '../../common';
import { TextInput } from '../../../../components/ui';
import { FieldConstants } from '../../../../utils';
import { BatteryFormInfos } from '../batteryDialog.type';

export interface BatteryDialogHeaderProps {
    batteryToModify?: BatteryFormInfos | null;
    equipmentId: string;
}

export function BatteryDialogHeader({ batteryToModify, equipmentId }: Readonly<BatteryDialogHeaderProps>) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TextField
                    size="small"
                    fullWidth
                    label="ID"
                    value={equipmentId}
                    InputProps={{
                        readOnly: true,
                    }}
                    disabled
                    {...filledTextField}
                />
            </Grid>
            <Grid item xs={4}>
                <TextInput
                    name={FieldConstants.EQUIPMENT_NAME}
                    label="Name"
                    formProps={filledTextField}
                    previousValue={batteryToModify?.name ?? undefined}
                    clearable
                />
            </Grid>
        </Grid>
    );
}
