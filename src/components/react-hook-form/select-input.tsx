/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import AutocompleteInput, {
    AutocompleteInputProps,
} from './autocomplete-input';
import { useIntl } from 'react-intl';

interface OwnProps {
    options: { id: string; label: string }[];
}

export type SelectInputProps = Omit<
    AutocompleteInputProps,
    'outputTransform' | 'inputTransform' | 'readOnly' | 'getOptionLabel' // already defined in SelectInput
>;

const SelectInput = (props: OwnProps & SelectInputProps) => {
    const intl = useIntl();

    const inputTransform = (value: { id: string; label: string } | string) => {
        if (typeof value === 'string') {
            return props.options.find((option) => option?.id === value) || null;
        }
        return props.options.find((option) => option?.id === value.id) || null;
    };

    const outputTransform = (value: { id: string; label: string } | string) => {
        if (typeof value === 'string') {
            return value;
        }
        return value?.id ?? null;
    };

    return (
        <AutocompleteInput
            getOptionLabel={(option: any) => {
                return option?.label
                    ? intl.formatMessage({ id: option?.label }) // If the option has a label property, display the label using internationalization
                    : option?.id; // If the option doesn't have a label property, display the ID instead
            }}
            inputTransform={inputTransform}
            outputTransform={outputTransform}
            readOnly={true}
            {...props}
        />
    );
};

export default SelectInput;
