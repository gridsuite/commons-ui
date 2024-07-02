/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import AutocompleteInput from './autocomplete-input';

function MultipleAutocompleteInput({ name, ...props }: any) {
    const [unsavedInput, setUnsavedInput] = useState('');
    const watchAutocompleteValues = useWatch({
        name,
    });

    const { append } = useFieldArray({
        name,
    });

    const handleOnBlur = () => {
        if (unsavedInput && !watchAutocompleteValues.includes(unsavedInput)) {
            append(unsavedInput);
        }
        setUnsavedInput('');
    };

    const outputTransform = (values: any[]) => {
        const newValues = values.map((val) => val.trim());

        return newValues.filter(
            (val, index) => newValues.indexOf(val) === index
        );
    };

    return (
        <AutocompleteInput
            name={name}
            fullWidth
            options={[]}
            allowNewValue
            clearOnBlur
            disableClearable
            outputTransform={outputTransform}
            onInputChange={(_: unknown, val: string) =>
                setUnsavedInput(val.trim() ?? '')
            }
            onBlur={handleOnBlur}
            blurOnSelect={false}
            multiple
            ChipProps={{ size: 'small' }}
            {...props}
        />
    );
}

export default MultipleAutocompleteInput;
