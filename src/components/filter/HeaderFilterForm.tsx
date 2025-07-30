/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { UUID } from 'crypto';
import { ElementType, FieldConstants, MAX_CHAR_DESCRIPTION } from '../../utils';
import { DescriptionField, UniqueNameInput } from '../inputs';
import yup from '../../utils/yupConfig';

export const filterStyles = {
    textField: {
        minWidth: '250px',
        width: '33%',
    },
    description: {
        minWidth: '250px',
        width: '50%',
    },
};

export interface FilterFormProps {
    creation?: boolean;
    activeDirectory?: UUID;
    filterType?: { id: string; label: string };
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
}

export const HeaderFilterSchema = {
    [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
    [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
    [FieldConstants.DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
};

export function HeaderFilterForm({ creation, activeDirectory }: Readonly<FilterFormProps>) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <UniqueNameInput
                    name={FieldConstants.NAME}
                    label="nameProperty"
                    elementType={ElementType.FILTER}
                    autoFocus={creation}
                    activeDirectory={activeDirectory}
                    sx={filterStyles.textField}
                    fullWidth={false}
                />
            </Grid>
            <Grid item xs={12}>
                <DescriptionField expandingTextSx={filterStyles.description} />
            </Grid>
        </Grid>
    );
}
