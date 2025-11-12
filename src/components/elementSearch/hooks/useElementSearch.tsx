/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useRef, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { snackWithFallback } from '../../../utils/error';

const SEARCH_FETCH_TIMEOUT_MILLIS = 1000;

export type Paginated<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
};

interface UseElementSearch<T> {
    fetchElements: (newSearchTerm: string) => Promise<Paginated<T> | T[]>;
}

export const useElementSearch = <T,>(
    props: UseElementSearch<T>
): {
    searchTerm: string;
    updateSearchTerm: (newSearchTerm: string) => void;
    elementsFound: T[];
    isLoading: boolean;
    totalElements: number;
} => {
    const { fetchElements } = props;

    const { snackError } = useSnackMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [elementsFound, setElementsFound] = useState<T[]>([] as T[]);
    const [totalElements, setTotalElements] = useState(0);
    const lastSearchTermRef = useRef('');

    const searchMatchingElements = useCallback(
        (newSearchTerm: string) => {
            if (newSearchTerm.length === 0) {
                return;
            }

            lastSearchTermRef.current = newSearchTerm;

            fetchElements(newSearchTerm)
                .then((infos) => {
                    if (newSearchTerm === lastSearchTermRef.current) {
                        if (Array.isArray(infos)) {
                            setElementsFound(infos);
                            setTotalElements(infos.length);
                        } else {
                            setElementsFound(infos.content);
                            setTotalElements(infos.totalElements);
                        }
                        setIsLoading(false);
                    } // else ignore results of outdated fetch
                })
                .catch((error) => {
                    // else ignore errors of outdated fetch if changing "isLoading state"
                    if (newSearchTerm === lastSearchTermRef.current) {
                        setElementsFound([]);
                        setTotalElements(0);
                        setIsLoading(false);
                        snackWithFallback(snackError, error, { headerId: 'equipmentsSearchingError' });
                    }
                });
        },
        [fetchElements, snackError]
    );

    const debouncedSearchMatchingElements = useDebounce(searchMatchingElements, SEARCH_FETCH_TIMEOUT_MILLIS);

    const updateSearchTerm = useCallback(
        (newSearchTerm: string) => {
            setSearchTerm(newSearchTerm);

            // if user input is empty, return empty array and set isLoading to false
            // still debouncing to cancel previous call, otherwise last call will still trigger
            if (newSearchTerm.length === 0) {
                setElementsFound([]);
                setTotalElements(0);
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }

            debouncedSearchMatchingElements(newSearchTerm);
        },
        [debouncedSearchMatchingElements]
    );

    return {
        searchTerm,
        updateSearchTerm,
        elementsFound,
        isLoading,
        totalElements,
    };
};
