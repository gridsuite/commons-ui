/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';
import { ExpandableInput } from '../../../../components';
import { TabularFieldConstants } from '../tabular.constants';
import { TabularPropertyForm } from './TabularPropertyForm';
import { initializedTabularProperty } from './tabularProperty.utils';

export function TabularPropertiesForm() {
    const { getValues } = useFormContext();

    // predefined properties cannot be removed from the list
    const disabledDeletion = useCallback(
        (idx: number) => {
            const properties = getValues(TabularFieldConstants.TABULAR_PROPERTIES);
            if (properties?.[idx] !== undefined) {
                return properties[idx][TabularFieldConstants.PREDEFINED];
            }
            return false;
        },
        [getValues]
    );

    return (
        <Grid container>
            <ExpandableInput
                name={TabularFieldConstants.TABULAR_PROPERTIES}
                Field={TabularPropertyForm}
                addButtonLabel="AddProperty"
                initialValue={initializedTabularProperty()}
                disabledDeletion={disabledDeletion}
            />
        </Grid>
    );
}
