/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useCallback, useMemo } from 'react';
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

    const typesOptions = useMemo(() => {
        return Object.values(EQUIPMENT_TYPE_ORDER);
    }, []);

    return (
        <Grid container spacing={2} padding={0.5} alignItems="center">
            <Grid item xs={6}>
                <AutocompleteInput
                    isOptionEqualToValue={richTypeEquals}
                    name={FieldConstants.TYPE}
                    label="Type"
                    options={typesOptions}
                    onChangeCallback={handleEquipmentTypeChange}
                    getOptionLabel={getOptionLabel}
                    size="small"
                    formProps={{ variant: 'filled' }}
                />
            </Grid>
            <Grid item xs={6}>
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
