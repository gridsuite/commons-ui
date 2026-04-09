/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ExpandableInput, SelectWithConfirmationInput } from '../../../inputs';
import { FieldConstants, mergeSx } from '../../../../utils';
import { unscrollableDialogStyles } from '../../../dialogs';
import { useGetLabelEquipmentTypes } from '../../../../hooks';
import GridItem from '../../../grid/grid-item';
import AssignmentForm from './assignment/assignment-form';
import { getAssignmentInitialValue } from './assignment/assignment-utils';
import { EQUIPMENTS_FIELDS, EquipmentTypeOptionType } from './assignment/assignment-constants';

const EQUIPMENT_TYPE_OPTIONS: EquipmentTypeOptionType[] = Object.keys(EQUIPMENTS_FIELDS) as EquipmentTypeOptionType[];

export function ModificationByAssignmentForm() {
    const { setValue, getValues } = useFormContext();

    const getOptionLabel = useGetLabelEquipmentTypes();
    const getEquipmentTypeOptionLabel = (option: any) => {
        if (!option || typeof option !== 'string') {
            return '';
        }
        return getOptionLabel(option as EquipmentTypeOptionType);
    };

    const equipmentTypeField = (
        <SelectWithConfirmationInput
            name={FieldConstants.EQUIPMENT_TYPE}
            label="EquipmentType"
            options={EQUIPMENT_TYPE_OPTIONS}
            onValidate={() => {
                setValue(
                    FieldConstants.ASSIGNMENTS,
                    getValues(FieldConstants.ASSIGNMENTS).map(() => ({
                        ...getAssignmentInitialValue(),
                    }))
                );
            }}
            getOptionLabel={getEquipmentTypeOptionLabel}
        />
    );

    const assignmentsField = (
        <ExpandableInput
            name={FieldConstants.ASSIGNMENTS}
            Field={AssignmentForm}
            addButtonLabel="addNewAssignment"
            initialValue={getAssignmentInitialValue()}
        />
    );

    return (
        <Box sx={mergeSx(unscrollableDialogStyles.unscrollableContainer, { height: '100%' })}>
            <Grid container sx={unscrollableDialogStyles.unscrollableHeader}>
                <GridItem size={3.15}>{equipmentTypeField}</GridItem>
            </Grid>
            <Grid container sx={unscrollableDialogStyles.scrollableContent}>
                <GridItem size={12}>{assignmentsField}</GridItem>
            </Grid>
        </Box>
    );
}
