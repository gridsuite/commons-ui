/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useReducer } from 'react';
import { FieldErrors, useFormState } from 'react-hook-form';
import { FieldConstants } from '../utils';

type TabFieldsMap<T extends number> = Readonly<Partial<Record<T, FieldConstants[]>>>;

type State<T extends number> = {
    tabIndex: T;
    tabIndexesWithError: T[];
};

type Action<T extends number> =
    | { type: 'SET_ACTIVE_TAB'; tab: T }
    | { type: 'UPDATE_ERRORS'; errors: FieldErrors; tabFields: TabFieldsMap<T> };

function tabsReducer<T extends number>(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
        case 'SET_ACTIVE_TAB':
            return { ...state, tabIndex: action.tab };
        case 'UPDATE_ERRORS': {
            const tabsInError = (Object.keys(action.tabFields) as unknown as T[]).filter((tab) =>
                action.tabFields[tab]!.some((field) => action.errors[field] !== undefined)
            );
            if (tabsInError.length === 0) {
                return { ...state, tabIndexesWithError: [] };
            }
            // Stay on current tab if it already has errors, otherwise jump to the first errored tab
            const tabIndex = tabsInError.includes(state.tabIndex) ? state.tabIndex : tabsInError[0];
            return { tabIndex, tabIndexesWithError: tabsInError };
        }
        default:
            return state;
    }
}

/**
 * Manages tab navigation with automatic error highlighting for react-hook-form-based tabbed forms.
 *
 * @param tabFields - Maps each tab index to the field names it owns. Must be a module-level
 *                    constant to remain stable across renders.
 * @param initialTab - The tab to show on first render.
 */
export function useTabsWithError<T extends number>(tabFields: TabFieldsMap<T>, initialTab: T) {
    const { errors } = useFormState();

    const [state, dispatch] = useReducer(tabsReducer<T>, {
        tabIndex: initialTab,
        tabIndexesWithError: [] as T[],
    });

    useEffect(() => {
        dispatch({ type: 'UPDATE_ERRORS', errors, tabFields });
    }, [errors, tabFields]);

    const setTabIndex = useCallback((tab: T) => {
        dispatch({ type: 'SET_ACTIVE_TAB', tab });
    }, []);

    return { tabIndex: state.tabIndex, setTabIndex, tabIndexesWithError: state.tabIndexesWithError };
}
