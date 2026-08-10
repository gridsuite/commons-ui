/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { useController } from 'react-hook-form';
import { FilterOptionsState } from '@mui/material';
import { useIntl } from 'react-intl';
import { areIdsEqual } from '../../../../../utils';
import { AutocompleteInput } from '../../../../../components';

interface ReferenceAutocompleteInputProps {
    name: string;
    options: { id: string; label: string }[];
}

function ReferenceAutocompleteInput({ name, options }: ReferenceAutocompleteInputProps) {
    const intl = useIntl();
    const [displayOptions, setDisplayOptions] = useState(false);
    const {
        fieldState: { error },
        field: { onChange },
    } = useController({
        name,
    });

    const handleFilterOptions = useCallback(
        (
            filteredOptions: ({ id: string; label: string } | string)[],
            state: FilterOptionsState<string | { id: string; label: string }>
        ) => {
            if (state.inputValue?.startsWith('#')) {
                const keyword = state.inputValue?.substring(1);
                if (!keyword) {
                    return filteredOptions;
                }
                return filteredOptions.filter((option) =>
                    intl
                        .formatMessage({ id: state.getOptionLabel(option) })
                        .toLowerCase()
                        .startsWith(keyword.toLowerCase())
                );
            }

            return filteredOptions;
        },
        [intl]
    );

    const inputTransform = (value: { id: string; label: string } | string | null) =>
        options.find((option) => option?.id === value) || value;

    const outputTransform = (value: any) => {
        return value?.id ?? value;
    };

    return (
        <AutocompleteInput
            name={name}
            options={options}
            isOptionEqualToValue={areIdsEqual}
            getOptionLabel={(option: any) => {
                return option?.label ? intl.formatMessage({ id: option.label }) : option;
            }}
            inputTransform={inputTransform}
            outputTransform={outputTransform}
            label="ReferenceFieldOrValue"
            size="small"
            open={displayOptions}
            onBlur={() => setDisplayOptions(false)}
            allowNewValue
            onInputChange={(event: any, value: any) => {
                const displayOption = !!value?.trim()?.startsWith('#');
                setDisplayOptions(displayOption);
                if (value && !Number.isNaN(Number.parseFloat(value))) {
                    onChange(value);
                }
            }}
            filterOptions={(
                filteredOptions: ({ id: string; label: string } | string)[],
                state: FilterOptionsState<string | { id: string; label: string }>
            ) => handleFilterOptions(filteredOptions, state)}
            formProps={{
                helperText: intl.formatMessage({
                    id: error?.message ? error.message : 'UseDashToSelectField',
                }),
            }}
        />
    );
}

export default ReferenceAutocompleteInput;
