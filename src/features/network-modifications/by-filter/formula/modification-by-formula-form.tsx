/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useFormContext } from 'react-hook-form';
import { Box, Grid2 as Grid } from '@mui/material';
import FormulaForm from './formula/formula-form';
import { getFormulaInitialValue } from './formula/formula-utils';
import { EquipmentType, FieldConstants, mergeSx } from '../../../../utils';
import {
    ExpandableInput,
    GridItem,
    SelectWithConfirmationInput,
    unscrollableDialogStyles,
} from '../../../../components';
import { FORMULAS } from './formula/formula-constants';

const EQUIPMENT_TYPE_OPTIONS = [
    EquipmentType.GENERATOR,
    EquipmentType.BATTERY,
    EquipmentType.SHUNT_COMPENSATOR,
    EquipmentType.VOLTAGE_LEVEL,
    EquipmentType.LOAD,
    EquipmentType.TWO_WINDINGS_TRANSFORMER,
    EquipmentType.LINE,
];

export function ModificationByFormulaForm() {
    const { setValue, getValues } = useFormContext();

    const equipmentTypeField = (
        <SelectWithConfirmationInput
            name={FieldConstants.EQUIPMENT_TYPE}
            label="EquipmentType"
            options={EQUIPMENT_TYPE_OPTIONS}
            onValidate={() => {
                setValue(
                    FORMULAS,
                    getValues(FORMULAS).map(() => ({
                        ...getFormulaInitialValue(),
                    }))
                );
            }}
        />
    );

    const formulasField = (
        <ExpandableInput
            name={FORMULAS}
            Field={FormulaForm}
            addButtonLabel="addNewFormula"
            initialValue={getFormulaInitialValue()}
        />
    );

    return (
        <Box sx={mergeSx(unscrollableDialogStyles.unscrollableContainer, { height: '100%' })}>
            <Grid container sx={unscrollableDialogStyles.unscrollableHeader}>
                <GridItem size={2.15}>{equipmentTypeField}</GridItem>
            </Grid>
            <Grid container sx={unscrollableDialogStyles.scrollableContent}>
                <GridItem size={12}>{formulasField}</GridItem>
            </Grid>
        </Box>
    );
}
