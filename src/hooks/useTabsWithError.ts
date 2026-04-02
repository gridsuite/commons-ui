/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { FieldConstants } from '../utils';

type TabFieldsMap<T extends number> = Readonly<Partial<Record<T, FieldConstants[]>>>;

/**
 * Manages tab navigation with automatic error highlighting for react-hook-form-based tabbed forms.
 *
 * @param tabFields - Maps each tab index to the field names it owns. Must be a module-level
 *                    constant to remain stable across renders.
 * @param initialTab - The tab to show on first render.
 */
export function useTabsWithError<T extends number>(tabFields: TabFieldsMap<T>, initialTab: T) {
    const { errors, submitCount } = useFormState();
    const [tabIndex, setTabIndex] = useState<T>(initialTab);
    const tabIndexRef = useRef(tabIndex);

    // Computed during render (not stored in state) so tab error styles update immediately when
    // an error is cleared. RHF mutates the errors object rather than replacing it, so a useEffect
    // dependency on `errors` would never fire on error removal.
    const tabIndexesWithError = (Object.keys(tabFields).map(Number) as T[]).filter((tab) =>
        tabFields[tab]!.some((field) => errors[field] !== undefined)
    );

    // Auto-navigate to the first errored tab on submit. Using submitCount as the trigger is the
    // only reliable signal that the user explicitly requested validation — reacting to errors
    // directly would cause mid-input tab jumps during on-change revalidation.
    const tabIndexesWithErrorRef = useRef(tabIndexesWithError);
    tabIndexesWithErrorRef.current = tabIndexesWithError;
    useEffect(() => {
        const tabs = tabIndexesWithErrorRef.current;
        if (tabs.length > 0 && !tabs.includes(tabIndexRef.current)) {
            const tab = tabs[0];
            tabIndexRef.current = tab;
            setTabIndex(tab);
        }
        // submitCount is the intentional trigger; refs never change identity.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitCount]);

    const handleSetTabIndex = useCallback((tab: T) => {
        tabIndexRef.current = tab;
        setTabIndex(tab);
    }, []);

    return { tabIndex, setTabIndex: handleSetTabIndex, tabIndexesWithError };
}
