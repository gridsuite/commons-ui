/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Autocomplete,
    AutocompleteRenderInputParams,
    createFilterOptions,
    debounce,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { HighlightedText } from './HighlightedText';

export type TreeViewSearchPaginated<T> = {
    content: T[];
    totalElements: number;
    [key: string]: unknown;
};

/**
 * Minimum shape that the search bar needs to display results.
 * The caller can extend this with extra fields.
 */
export interface SearchBarItem {
    id: string;
    name: string;
    pathName?: string[];
}

const SEARCH_FETCH_TIMEOUT_MILLIS = 1000;

function useTreeViewSearch<T extends SearchBarItem>(
    fetchElements: TreeViewSearchBarProps<T>['fetchElements']
): {
    searchTerm: string;
    updateSearchTerm: (value: string) => void;
    elementsFound: T[];
    isLoading: boolean;
    totalElements: number;
} {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [elementsFound, setElementsFound] = useState<T[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const lastSearchTermRef = useRef('');

    const doFetch = useCallback(
        (term: string) => {
            if (term.length === 0) {
                return;
            }
            lastSearchTermRef.current = term;
            fetchElements(term)
                .then((result) => {
                    if (term !== lastSearchTermRef.current) {
                        return; // outdated response — ignore
                    }
                    if (Array.isArray(result)) {
                        setElementsFound(result);
                        setTotalElements(result.length);
                    } else {
                        setElementsFound(result.content);
                        setTotalElements(result.totalElements);
                    }
                    setIsLoading(false);
                })
                .catch(() => {
                    if (term === lastSearchTermRef.current) {
                        setElementsFound([]);
                        setTotalElements(0);
                        setIsLoading(false);
                    }
                });
        },
        [fetchElements]
    );

    const debouncedFetch = useMemo(() => debounce(doFetch, SEARCH_FETCH_TIMEOUT_MILLIS), [doFetch]);

    useEffect(() => {
        return () => {
            debouncedFetch.clear();
        };
    }, [debouncedFetch]);

    const updateSearchTerm = useCallback(
        (value: string) => {
            setSearchTerm(value);
            if (value.length === 0) {
                setElementsFound([]);
                setTotalElements(0);
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }
            debouncedFetch(value);
        },
        [debouncedFetch]
    );

    return { searchTerm, updateSearchTerm, elementsFound, isLoading, totalElements };
}

type WarningPaperProps = HTMLAttributes<HTMLElement> & {
    elementFoundLength: number;
    elementFoundTotal: number;
    isLoading: boolean;
};

function WarningPaper({
    elementFoundLength,
    elementFoundTotal,
    isLoading,
    children,
    ...other
}: Readonly<WarningPaperProps>) {
    const intl = useIntl();
    const shouldDisplayWarning = !isLoading && elementFoundLength < elementFoundTotal;
    return (
        <Paper {...other}>
            {shouldDisplayWarning && (
                <Typography
                    variant="body2"
                    sx={(theme) => ({
                        color: theme.palette.info.main,
                        mt: 1,
                        mb: 1,
                        ml: 2,
                    })}
                >
                    {intl
                        .formatMessage(
                            { id: 'showingSearchResults' },
                            { nbElementsShown: elementFoundLength, nbElementsTotal: elementFoundTotal }
                        )
                        .toString()}
                </Typography>
            )}
            {children}
        </Paper>
    );
}

export interface TreeViewSearchBarProps<T extends SearchBarItem> {
    fetchElements: (searchTerm: string) => Promise<TreeViewSearchPaginated<T> | T[]>;
    onSelectionChange: (item: T) => void;
    placeholder?: string;
    disabled?: boolean;
}

/**
 * A standalone search-bar that:
 *  - fetches results via `fetchElements`,
 *  - highlights matching text in the tree,
 */
export function TreeViewSearchBar<T extends SearchBarItem>({
    fetchElements,
    onSelectionChange,
    placeholder,
    disabled = false,
}: Readonly<TreeViewSearchBarProps<T>>) {
    const intl = useIntl();

    const { elementsFound, isLoading, searchTerm, updateSearchTerm, totalElements } =
        useTreeViewSearch<T>(fetchElements);

    const filterOptions = useMemo(
        () =>
            createFilterOptions<T>({
                matchFrom: 'any',
                trim: true,
                ignoreCase: true,
            }),
        []
    );

    const renderInput = useCallback(
        (params: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                placeholder={placeholder ?? intl.formatMessage({ id: 'directoryItemSelector/search/placeholder' })}
                variant="outlined"
                slotProps={{
                    input: {
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <Search fontSize="small" sx={{ mr: 0.5, color: 'action.active' }} />
                                {params.InputProps.startAdornment}
                            </>
                        ),
                    },
                }}
            />
        ),
        [intl, placeholder]
    );

    const paperComponent = useCallback(
        (props: HTMLAttributes<HTMLElement>) => (
            <WarningPaper
                elementFoundLength={elementsFound.length}
                elementFoundTotal={totalElements}
                isLoading={isLoading}
                {...props}
            />
        ),
        [elementsFound.length, isLoading, totalElements]
    );

    return (
        <Autocomplete<T, false, boolean, true>
            size="small"
            freeSolo
            forcePopupIcon={false}
            fullWidth
            disabled={disabled}
            id="treeview-finder-search"
            options={isLoading ? [] : elementsFound}
            loading={isLoading}
            autoHighlight
            inputValue={searchTerm}
            onInputChange={(_event, value, reason) => {
                if (!disabled && reason !== 'reset') {
                    updateSearchTerm(value);
                }
            }}
            onChange={(_event, newValue, reason) => {
                if (newValue != null && typeof newValue !== 'string' && reason === 'selectOption') {
                    onSelectionChange(newValue);
                }
            }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            isOptionEqualToValue={(option, value) =>
                typeof option !== 'string' && typeof value !== 'string' && option.id === value.id
            }
            filterOptions={filterOptions}
            noOptionsText={intl.formatMessage({ id: 'element_search/noResult' })}
            renderOption={(optionProps, element, { inputValue }) => (
                <li {...optionProps} key={element.id}>
                    <span style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <HighlightedText text={element.name} highlight={inputValue} />
                        {element.pathName && element.pathName.length > 0 && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {element.pathName.join(' / ')}
                            </Typography>
                        )}
                    </span>
                </li>
            )}
            renderInput={renderInput}
            slots={{ paper: paperComponent }}
        />
    );
}
