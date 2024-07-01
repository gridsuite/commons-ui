/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import AutocompleteInput, {
    AutocompleteInputProps,
} from '../autocomplete-inputs/autocomplete-input';
import { Option } from '../../../../utils/types';

export interface SelectInputProps
    extends Omit<
        AutocompleteInputProps,
        'outputTransform' | 'inputTransform' | 'readOnly' | 'getOptionLabel' // already defined in SelectInput
    > {
    options: Option[];
}

function SelectInput(props: SelectInputProps) {
    const intl = useIntl();
    const { options } = props;
    const inputTransform = (value: Option | null) => {
        if (value === null) {
            return null;
        }
        if (typeof value === 'string') {
            return (
                options.find(
                    (option) =>
                        typeof option !== 'string' && option?.id === value
                ) || null
            );
        }
        return (
            options.find(
                (option) =>
                    typeof option !== 'string' && option?.id === value.id
            ) || null
        );
    };

    const outputTransform = (value: Option | null) => {
        if (typeof value === 'string') {
            return value;
        }
        return value?.id ?? null;
    };

    const getOptionLabel = (option: Option) => {
        if (typeof option === 'string') {
            return option;
        }
        if (option.label) {
            return intl.formatMessage({ id: option.label });
        }
        return option.id;
    };

    return (
        <AutocompleteInput
            getOptionLabel={getOptionLabel}
            inputTransform={inputTransform}
            outputTransform={outputTransform}
            readOnly
            {...props}
        />
    );
}

export default SelectInput;
