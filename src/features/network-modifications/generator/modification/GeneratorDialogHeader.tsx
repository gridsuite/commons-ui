/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { GeneratorFormInfos } from '../generatorDialog.type';
import { ENERGY_SOURCES, FieldConstants, getEnergySourceLabel } from '../../../../utils';
import { filledTextField } from '../../common';
import { SelectInput, TextInput } from '../../../../components';

export interface GeneratorDialogHeaderProps {
    generatorToModify?: GeneratorFormInfos | null;
    equipmentId?: string;
}

export function GeneratorDialogHeader({ generatorToModify, equipmentId }: Readonly<GeneratorDialogHeaderProps>) {
    const intl = useIntl();

    const energySourceLabelId = getEnergySourceLabel(generatorToModify?.energySource);
    const previousEnergySourceLabel = energySourceLabelId
        ? intl.formatMessage({
              id: energySourceLabelId,
          })
        : undefined;

    const generatorIdField = (
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
    );

    const generatorNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={generatorToModify?.name}
            clearable
        />
    );

    const energySourceField = (
        <SelectInput
            name={FieldConstants.ENERGY_SOURCE}
            label="energySource"
            options={[...ENERGY_SOURCES]}
            fullWidth
            size="small"
            formProps={{ ...filledTextField }}
            previousValue={previousEnergySourceLabel}
        />
    );

    return (
        <Grid container spacing={2}>
            <Grid size="grow">{generatorIdField}</Grid>
            <Grid size="grow">{generatorNameField}</Grid>
            <Grid size="grow">{energySourceField}</Grid>
        </Grid>
    );
}
