/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Grid from '@mui/material/Grid';
import { useFormContext } from 'react-hook-form';
import FilterProperties, { filterPropertiesYupSchema } from './FilterProperties';
import FieldConstants from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import CriteriaBasedForm from './CriteriaBasedForm';
import { getCriteriaBasedFormData, getCriteriaBasedSchema } from './criteriaBasedFilterUtils';
import { FILTER_EQUIPMENTS } from '../utils/filterFormUtils';
import { FreePropertiesTypes } from './FilterFreeProperties';
import InputWithPopupConfirmation from '../../inputs/reactHookForm/selectInputs/InputWithPopupConfirmation';
import SelectInput from '../../inputs/reactHookForm/selectInputs/SelectInput';

export const criteriaBasedFilterSchema = getCriteriaBasedSchema({
    [FieldConstants.ENERGY_SOURCE]: yup.string().nullable(),
    ...filterPropertiesYupSchema,
});

export const criteriaBasedFilterEmptyFormData = getCriteriaBasedFormData(null, {
    [FieldConstants.ENERGY_SOURCE]: null,
    [FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES]: [],
    [FreePropertiesTypes.FREE_FILTER_PROPERTIES]: [],
});

const styles = {
    scrollablePart: {
        height: '500px', // tmp : pas trouvé de moyen de déterminer dynamiquement la hauteur, et sans ça overflow ne fonctionne pas...
        overflowY: 'auto',
        flex: '1 1 auto',
    },
};

function CriteriaBasedFilterForm() {
    const { getValues, setValue } = useFormContext();
    const defaultValues: Record<string, any> = criteriaBasedFilterEmptyFormData[FieldConstants.CRITERIA_BASED];

    const openConfirmationPopup = () => {
        return JSON.stringify(getValues(FieldConstants.CRITERIA_BASED)) !== JSON.stringify(defaultValues);
    };

    const handleResetOnConfirmation = () => {
        Object.keys(defaultValues).forEach((field) =>
            setValue(`${FieldConstants.CRITERIA_BASED}.${field}`, defaultValues[field])
        );
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <InputWithPopupConfirmation
                    Input={SelectInput}
                    name={FieldConstants.EQUIPMENT_TYPE}
                    options={Object.values(FILTER_EQUIPMENTS)}
                    label="equipmentType"
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message="changeTypeMessage"
                    validateButtonLabel="button.changeType"
                />
            </Grid>
            <Grid container item spacing={1} sx={styles.scrollablePart}>
                <CriteriaBasedForm equipments={FILTER_EQUIPMENTS} />
                <FilterProperties />
            </Grid>
        </Grid>
    );
}

export default CriteriaBasedFilterForm;
