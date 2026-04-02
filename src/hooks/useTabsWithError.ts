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
    const { errors } = useFormState();
    const [tabIndex, setTabIndex] = useState<T>(initialTab);
    const tabIndexRef = useRef(tabIndex);

    // Computed during render (not stored in state) so tab error styles update immediately when
    // an error is cleared. RHF mutates the errors object rather than replacing it, so a useEffect
    // dependency on `errors` would never fire on error removal.
    const tabIndexesWithError = (Object.keys(tabFields).map(Number) as T[]).filter((tab) =>
        tabFields[tab]!.some((field) => errors[field] !== undefined)
    );

    // Auto-navigate to the first errored tab when the set of errored tabs changes.
    // Use a string key as the dependency so the effect fires on value change, not reference change.
    const errorsKey = tabIndexesWithError.join(',');
    useEffect(() => {
        if (tabIndexesWithError.length > 0 && !tabIndexesWithError.includes(tabIndexRef.current)) {
            const tab = tabIndexesWithError[0];
            tabIndexRef.current = tab;
            setTabIndex(tab);
        }
        // errorsKey is a stable proxy for tabIndexesWithError value changes.
        // tabIndexRef is a ref and never changes identity.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorsKey]);

    const handleSetTabIndex = useCallback((tab: T) => {
        tabIndexRef.current = tab;
        setTabIndex(tab);
    }, []);

    return { tabIndex, setTabIndex: handleSetTabIndex, tabIndexesWithError };
}
