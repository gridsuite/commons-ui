/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { UUID } from 'crypto';
import { FieldConstants, ElementType, MAX_CHAR_DESCRIPTION } from '../../utils';
import { FilterType } from './constants/FilterConstants';
import { UniqueNameInput, DescriptionField, RadioInput } from '../inputs';
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
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
    handleFilterTypeChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}

export const HeaderFilterSchema = {
    [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
    [FieldConstants.FILTER_TYPE]: yup.string().required(),
    [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
    [FieldConstants.DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
};

export function HeaderFilterForm({
    sourceFilterForExplicitNamingConversion,
    creation,
    activeDirectory,
    handleFilterTypeChange,
}: Readonly<FilterFormProps>) {
    const filterTypes = Object.values(FilterType);

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
            <>
                <Grid item xs={12}>
                    <DescriptionField expandingTextSx={filterStyles.description} />
                </Grid>
                {creation && !sourceFilterForExplicitNamingConversion && (
                    <Grid item>
                        <RadioInput
                            name={FieldConstants.FILTER_TYPE}
                            options={filterTypes}
                            formProps={{ onChange: handleFilterTypeChange }} // need to override this in order to do not activate the validate button when changing the filter type
                        />
                    </Grid>
                )}
            </>
        </Grid>
    );
}
