/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderInputParams,
} from '@mui/material';
import { HTMLAttributes, ReactNode, useMemo } from 'react';
import { useIntl } from 'react-intl';

export type RenderElementProps<T> = HTMLAttributes<HTMLLIElement> & {
    element: T;
    inputValue: string;
};

export interface ElementSearchInputProps<T>
    extends Pick<
        AutocompleteProps<T, false, false, true>,
        'sx' | 'size' | 'loadingText' | 'loading'
    > {
    searchTerm: string;
    onSearchTermChange: (searchTerm: string) => void;
    onSelectionChange: (selection: T) => void;
    getOptionLabel: (option: T) => string;
    isOptionEqualToValue: (option1: T, option2: T) => boolean;
    elementsFound: T[];
    renderElement: (props: RenderElementProps<T>) => ReactNode;
    renderInput: (
        searchTerm: string,
        props: AutocompleteRenderInputParams
    ) => ReactNode;
    searchTermDisabled?: boolean;
    searchTermDisableReason?: string;
    showResults?: boolean;
}

export const ElementSearchInput = <T,>(props: ElementSearchInputProps<T>) => {
    const {
        elementsFound,
        loading,
        onSearchTermChange,
        onSelectionChange,
        renderElement,
        renderInput,
        getOptionLabel,
        isOptionEqualToValue,
        showResults,
        searchTerm,
        loadingText,
        searchTermDisableReason,
        searchTermDisabled,
        size,
        sx,
    } = props;

    const intl = useIntl();

    const displayedValue = useMemo(() => {
        if (searchTermDisabled || searchTermDisableReason) {
            return (
                searchTermDisableReason ??
                intl.formatMessage({
                    id: 'element_search/searchDisabled',
                })
            );
        } else {
            return searchTerm ?? '';
        }
    }, [searchTerm, searchTermDisabled, searchTermDisableReason, intl]);

    return (
        <Autocomplete
            sx={sx}
            open={showResults}
            freeSolo
            size={size}
            id="element-search"
            forcePopupIcon={false}
            fullWidth
            onInputChange={(_event, value, reason) => {
                // if rease is 'reset', we don't wan't to update "searchTerm" to prevent fetching
                if (!searchTermDisabled && reason !== 'reset') {
                    onSearchTermChange(value);
                }
            }}
            onChange={(_event, newValue, reason) => {
                // when calling this method with reason == "selectOption", newValue can't be null or of type "string", since an option has been clicked on
                if (
                    newValue != null &&
                    typeof newValue !== 'string' &&
                    reason === 'selectOption'
                ) {
                    onSelectionChange(newValue);
                }
            }}
            options={loading ? [] : elementsFound}
            loading={loading}
            loadingText={loadingText}
            autoHighlight={true}
            noOptionsText={intl.formatMessage({
                id: 'element_search/noResult',
            })}
            renderOption={(optionProps, element, { inputValue }) =>
                renderElement({
                    ...optionProps,
                    element,
                    inputValue,
                })
            }
            renderInput={(params: AutocompleteRenderInputParams) =>
                renderInput(displayedValue, params)
            }
            getOptionLabel={(option) => {
                if (typeof option === 'string') {
                    return option;
                }
                return getOptionLabel(option);
            }}
            isOptionEqualToValue={(option: T | string, value: T | string) => {
                /** freeSolo is not used for inputs, but only because the way "Autocomplete" works
                 ** suits our needs better when freeSolo is set to true
                 ** this method is only relevant when both params are of type T, the else block should not be useful */
                if (typeof option !== 'string' && typeof value !== 'string') {
                    return isOptionEqualToValue(option, value);
                } else {
                    return option === value;
                }
            }}
            disabled={searchTermDisabled}
        />
    );
};
