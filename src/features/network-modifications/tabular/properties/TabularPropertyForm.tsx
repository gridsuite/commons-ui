/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useWatch } from 'react-hook-form';
import { CheckboxInput, GridItem, TextInput } from '../../../../components';
import { FieldConstants } from '../../../../utils';
import { italicFontTextField } from '../../common';
import { TabularFieldConstants } from '../tabular.constants';

export interface TabularPropertyFormProps {
    name: string;
    index: string;
}

export function TabularPropertyForm({ name, index }: Readonly<TabularPropertyFormProps>) {
    const watchPredefined = useWatch({
        name: `${name}.${index}.${TabularFieldConstants.PREDEFINED}`,
    });

    const nameField = <TextInput name={`${name}.${index}.${FieldConstants.NAME}`} label="PropertyName" />;
    const nameReadOnlyField = (
        <TextInput
            name={`${name}.${index}.${FieldConstants.NAME}`}
            label="PropertyName"
            formProps={{ disabled: true, ...italicFontTextField }}
        />
    );
    const selectionField = <CheckboxInput name={`${name}.${index}.${FieldConstants.SELECTED}`} />;

    return (
        <>
            <GridItem size={10}>{watchPredefined ? nameReadOnlyField : nameField}</GridItem>
            <GridItem size={1}>{selectionField}</GridItem>
        </>
    );
}
