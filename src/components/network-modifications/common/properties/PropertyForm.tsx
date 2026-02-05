/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';

import { useWatch } from 'react-hook-form';
import { FieldConstants, PredefinedProperties } from '../../../../utils';
import GridItem from '../../../grid/grid-item';
import { AutocompleteInput, TextInput } from '../../../inputs';
import { italicFontTextField } from '../form.utils';

type PropertyFormProps = {
    name: string;
    index: string;
    predefinedProperties: PredefinedProperties;
};

export const PropertyForm = ({ name, index, predefinedProperties }: PropertyFormProps) => {
    const watchPropertyName = useWatch({ name: `${name}.${index}.${FieldConstants.NAME}` });
    const watchPropertyPreviousValue = useWatch({
        name: `${name}.${index}.${FieldConstants.PREVIOUS_VALUE}`,
    });
    const watchPropertyDeletionMark = useWatch({
        name: `${name}.${index}.${FieldConstants.DELETION_MARK}`,
    });
    const watchPropertyAdded = useWatch({
        name: `${name}.${index}.${FieldConstants.ADDED}`,
    });

    const predefinedNames = useMemo(() => {
        const keys = Object.keys(predefinedProperties ?? {});
        return keys.sort((a, b) => a.localeCompare(b));
    }, [predefinedProperties]);

    const predefinedValues = useMemo(() => {
        const values = predefinedProperties?.[watchPropertyName] ?? [];
        return values.sort((a, b) => a.localeCompare(b));
    }, [watchPropertyName, predefinedProperties]);

    const nameField = (
        <AutocompleteInput
            name={`${name}.${index}.${FieldConstants.NAME}`}
            options={predefinedNames}
            label="PropertyName"
            size="small"
            allowNewValue
        />
    );

    const nameReadOnlyField = (
        <TextInput
            name={`${name}.${index}.${FieldConstants.NAME}`}
            label="PropertyName"
            formProps={{ disabled: true, ...italicFontTextField }}
        />
    );

    const valueField = (
        <AutocompleteInput
            name={`${name}.${index}.${FieldConstants.VALUE}`}
            options={predefinedValues}
            label="PropertyValue"
            size="small"
            allowNewValue
            previousValue={watchPropertyPreviousValue}
        />
    );

    const valueReadOnlyField = (
        <TextInput
            name={`${name}.${index}.${FieldConstants.VALUE}`}
            label="PropertyValue"
            previousValue={watchPropertyPreviousValue}
            formProps={{ disabled: true, ...italicFontTextField }}
        />
    );

    function renderPropertyLine() {
        return (
            <>
                {watchPropertyDeletionMark || (watchPropertyAdded === false && watchPropertyPreviousValue) ? (
                    <GridItem size={5}>{nameReadOnlyField}</GridItem>
                ) : (
                    <GridItem size={5}>{nameField}</GridItem>
                )}
                {watchPropertyDeletionMark ? (
                    <GridItem size={5}>{valueReadOnlyField}</GridItem>
                ) : (
                    <GridItem size={5}>{valueField}</GridItem>
                )}
            </>
        );
    }

    return renderPropertyLine();
};
