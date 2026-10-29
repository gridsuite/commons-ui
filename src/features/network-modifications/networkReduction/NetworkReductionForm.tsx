/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { DirectoryItemsInput, FieldLabel, GridItem } from '../../../components';
import { ElementType, EquipmentType, FieldConstants } from '../../../utils';

export function NetworkReductionForm() {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                alignItems: 'center',
                pt: 2,
            }}
        >
            <Grid size={4}>
                <FieldLabel label="NetworkReductionVoltageLevelFilters" />
            </Grid>
            <Grid size={8}>
                <DirectoryItemsInput
                    name={FieldConstants.FILTERS}
                    equipmentTypes={[EquipmentType.VOLTAGE_LEVEL]}
                    elementType={ElementType.FILTER}
                    label="filter"
                    titleId="FiltersListsSelection"
                />
            </Grid>
        </Grid>
    );
}
