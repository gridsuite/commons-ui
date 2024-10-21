/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FilterProperties, filterPropertiesYupSchema } from './FilterProperties';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import { CriteriaBasedForm } from './CriteriaBasedForm';
import { getCriteriaBasedFormData, getCriteriaBasedSchema } from './criteriaBasedFilterUtils';
import { FILTER_EQUIPMENTS } from '../utils/filterFormUtils';
import { FreePropertiesTypes } from './FilterFreeProperties';

export const criteriaBasedFilterSchema = getCriteriaBasedSchema({
    [FieldConstants.ENERGY_SOURCE]: yup.string().nullable(),
    ...filterPropertiesYupSchema,
});

export const criteriaBasedFilterEmptyFormData = getCriteriaBasedFormData(null, {
    [FieldConstants.ENERGY_SOURCE]: null,
    [FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES]: [],
    [FreePropertiesTypes.FREE_FILTER_PROPERTIES]: [],
});

export function CriteriaBasedFilterForm() {
    return (
        <CriteriaBasedForm
            equipments={FILTER_EQUIPMENTS}
            defaultValues={criteriaBasedFilterEmptyFormData[FieldConstants.CRITERIA_BASED]}
        >
            <FilterProperties />
        </CriteriaBasedForm>
    );
}
