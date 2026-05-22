/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AutocompleteInput, DirectoryItemsInput } from '../../../inputs';
import { useGetLabelEquipmentTypes } from '../../../../hooks';
import { ElementType, FieldConstants, richTypeEquals } from '../../../../utils';
import { EQUIPMENT_TYPE_ORDER } from './byFilterDeletion.utils';

export function ByFilterDeletionForm() {
    const equipmentType = useWatch({
        name: FieldConstants.TYPE,
    });

    const { setValue } = useFormContext();

    const getOptionLabel = useGetLabelEquipmentTypes();

    const handleEquipmentTypeChange = useCallback(() => {
        setValue(FieldConstants.FILTERS, []);
    }, [setValue]);

    return (
        <Grid container spacing={2} pt={1}>
            <Grid item xs>
                <AutocompleteInput
                    isOptionEqualToValue={richTypeEquals}
                    name={FieldConstants.TYPE}
                    label="Type"
                    options={EQUIPMENT_TYPE_ORDER}
                    onChangeCallback={handleEquipmentTypeChange}
                    getOptionLabel={getOptionLabel}
                    size="small"
                />
            </Grid>
            <Grid item xs>
                <DirectoryItemsInput
                    key={equipmentType}
                    name={FieldConstants.FILTERS}
                    elementType={ElementType.FILTER}
                    titleId="FiltersListsSelection"
                    label="filter"
                    equipmentTypes={equipmentType ? [equipmentType] : []}
                    disable={!equipmentType}
                />
            </Grid>
        </Grid>
    );
}
