/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueSelectorProps, ValueSourceSelectorProps } from 'react-querybuilder';
import { MaterialValueSelector } from '@react-querybuilder/material';
import { FieldType } from '../../../utils';
import { useSelectAppearance } from '../../../hooks';

export function OperatorSelector(props: Readonly<ValueSelectorProps>) {
    const { options, field } = props as ValueSourceSelectorProps;
    const excludedFields = [
        FieldType.FREE_PROPERTIES,
        FieldType.VOLTAGE_LEVEL_PROPERTIES,
        FieldType.VOLTAGE_LEVEL_PROPERTIES_1,
        FieldType.VOLTAGE_LEVEL_PROPERTIES_2,
        FieldType.VOLTAGE_LEVEL_PROPERTIES_3,
        FieldType.SUBSTATION_PROPERTIES,
        FieldType.SUBSTATION_PROPERTIES_1,
        FieldType.SUBSTATION_PROPERTIES_2,
    ];
    const selectAppearance = useSelectAppearance(options?.length || 0);

    if (excludedFields.includes(field as FieldType)) {
        return null;
    }
    return <MaterialValueSelector {...props} {...selectAppearance} sx={{ border: 'none' }} />;
}
