/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import React, { useEffect } from 'react';
import { HeaderFilterForm, FilterFormProps } from './HeaderFilterForm';
import { FieldConstants } from '../../utils/constants/fieldConstants';
import { ExplicitNamingFilterForm } from './explicitNaming/ExplicitNamingFilterForm';
import { ExpertFilterForm } from './expert/ExpertFilterForm';
import { FilterType } from './constants/FilterConstants';
import { unscrollableDialogStyles } from '../dialogs';
import yup from '../../utils/yupConfig';
import { MAX_CHAR_DESCRIPTION } from '../../utils/constants/UIconstants';

export const FilterSchema = {
    [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
    [FieldConstants.FILTER_TYPE]: yup.string().required(),
    [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
    [FieldConstants.DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
};

export function FilterForm({
    sourceFilterForExplicitNamingConversion,
    creation,
    description,
    activeDirectory,
    elementExists,
}: Readonly<FilterFormProps>) {
    const { setValue } = useFormContext();

    const filterType = useWatch({ name: FieldConstants.FILTER_TYPE });

    // We do this because setValue don't set the field dirty
    const handleFilterTypeChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setValue(FieldConstants.FILTER_TYPE, value);
    };

    useEffect(() => {
        if (sourceFilterForExplicitNamingConversion) {
            setValue(FieldConstants.FILTER_TYPE, FilterType.EXPLICIT_NAMING.id);
        }
    }, [sourceFilterForExplicitNamingConversion, setValue]);

    return (
        <>
            <Box sx={unscrollableDialogStyles.unscrollableHeader}>
                <HeaderFilterForm
                    creation={creation}
                    description={description}
                    activeDirectory={activeDirectory}
                    elementExists={elementExists}
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                    handleFilterTypeChange={handleFilterTypeChange}
                />
            </Box>
            {filterType === FilterType.EXPLICIT_NAMING.id && (
                <ExplicitNamingFilterForm
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                />
            )}
            {filterType === FilterType.EXPERT.id && <ExpertFilterForm />}
        </>
    );
}
