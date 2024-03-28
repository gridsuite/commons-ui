/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../constants/field-constants';
import { useFormContext, useWatch } from 'react-hook-form';
import { Grid } from '@mui/material';
import SelectInput from '../../react-hook-form/select-input';
import InputWithPopupConfirmation from '../../../utils/rhf-inputs/select-inputs/input-with-popup-confirmation';
import { FILTER_EQUIPMENTS } from '../constants/criteria-based-utils';

interface OwnProps {
    defaultValues: Record<string, any>;
}

const CriteriaBasedForm = ({ defaultValues }: OwnProps) => {
    const { getValues, setValue } = useFormContext();

    const watchEquipmentType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });

    const openConfirmationPopup = () => {
        return (
            JSON.stringify(getValues(FieldConstants.CRITERIA_BASED)) !==
            JSON.stringify(defaultValues)
        );
    };

    const handleResetOnConfirmation = () => {
        Object.keys(defaultValues).forEach((field) =>
            setValue(
                `${FieldConstants.CRITERIA_BASED}.${field}`,
                defaultValues[field]
            )
        );
    };

    return (
        <Grid container item spacing={2}>
            <Grid item xs={12}>
                <InputWithPopupConfirmation
                    Input={SelectInput}
                    name={FieldConstants.EQUIPMENT_TYPE}
                    options={Object.values(FILTER_EQUIPMENTS)}
                    label={'equipmentType'}
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message={'changeTypeMessage'}
                    validateButtonLabel={'button.changeType'}
                />
            </Grid>
            {watchEquipmentType &&
                FILTER_EQUIPMENTS[watchEquipmentType].fields.map(
                    (equipment: any, index: number) => {
                        const EquipmentForm = equipment.renderer;
                        return (
                            <Grid item xs={12} key={index} flexGrow={1}>
                                <EquipmentForm {...equipment.props} />
                            </Grid>
                        );
                    }
                )}
        </Grid>
    );
};

export default CriteriaBasedForm;
