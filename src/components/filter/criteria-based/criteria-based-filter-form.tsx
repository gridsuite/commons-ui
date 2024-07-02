/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Grid from '@mui/material/Grid';
import FilterProperties, {
    filterPropertiesYupSchema,
} from './filter-properties';
import FieldConstants from '../../../utils/field-constants';
import yup from '../../../utils/yup-config';
import CriteriaBasedForm from './criteria-based-form';
import {
    getCriteriaBasedFormData,
    getCriteriaBasedSchema,
} from './criteria-based-filter-utils';
import { FILTER_EQUIPMENTS } from '../utils/filter-form-utils';
import { FreePropertiesTypes } from './filter-free-properties';

export const criteriaBasedFilterSchema = getCriteriaBasedSchema({
    [FieldConstants.ENERGY_SOURCE]: yup.string().nullable(),
    ...filterPropertiesYupSchema,
});

export const criteriaBasedFilterEmptyFormData = getCriteriaBasedFormData(null, {
    [FieldConstants.ENERGY_SOURCE]: null,
    [FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES]: [],
    [FreePropertiesTypes.FREE_FILTER_PROPERTIES]: [],
});

function CriteriaBasedFilterForm() {
    return (
        <Grid container item spacing={1}>
            <CriteriaBasedForm
                equipments={FILTER_EQUIPMENTS}
                defaultValues={
                    criteriaBasedFilterEmptyFormData[
                        FieldConstants.CRITERIA_BASED
                    ]
                }
            />
            <FilterProperties />
        </Grid>
    );
}

export default CriteriaBasedFilterForm;
