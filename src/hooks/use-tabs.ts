/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { FieldErrors, get } from 'react-hook-form';
import { isObjectEmpty } from '../utils/functions';

export type UseTabsProps<TTabValue extends string | number> = {
    defaultTab: TTabValue;
    /**
     * Live form errors (usually `formState.errors`). Used to refresh the
     * highlight when the user switches tabs. Navigation NEVER reacts to it:
     * the only navigation trigger is `onError`.
     */
    errors?: FieldErrors;
    /** All possible tab values. Required if `tabFields` is omitted. */
    tabValues?: TTabValue[];
    /**
     * Maps each tab value to the react-hook-form field path(s) whose validity
     * decides whether the tab is highlighted. Falls back to `[String(tabValue)]`.
     */
    tabFields?: Partial<Record<TTabValue, string[]>>;
};

export type UseTabsReturn<TTabValue extends string | number> = {
    selectedTab: TTabValue;
    setSelectedTab: (tab: TTabValue) => void;
    /** Errored tabs, excluding the currently selected one. */
    tabsWithError: TTabValue[];
    /** Handler for MUI `<Tabs onChange>`. Refreshes the highlight. */
    onTabChange: (event: SyntheticEvent<Element, Event>, newValue: TTabValue) => void;
    /**
     * Invalid-submit handler — pass it as the 2nd argument of
     * `handleSubmit(onSubmit, onError)`. This is the ONLY place navigation happens:
     * stays on the current tab if it has errors, otherwise jumps to the first errored tab.
     */
    onError: (errors: FieldErrors) => void;
};

export function useTabs<TTabValue extends string | number>({
    defaultTab,
    errors,
    tabValues,
    tabFields,
}: Readonly<UseTabsProps<TTabValue>>): UseTabsReturn<TTabValue> {
    const [selectedTab, setSelectedTab] = useState<TTabValue>(defaultTab);
    const [tabsWithError, setTabsWithError] = useState<TTabValue[]>([]);

    const resolvedTabValues = useMemo<TTabValue[]>(() => {
        if (tabValues?.length) {
            return tabValues;
        }
        // Derive from tabFields keys: numeric strings -> numbers, otherwise keep as-is.
        return Object.keys(tabFields ?? {}).map((key) => {
            const asNumber = Number(key);
            return (Number.isNaN(asNumber) ? key : asNumber) as TTabValue;
        });
    }, [tabValues, tabFields]);

    const getTabsWithError = useCallback(
        (_errors: FieldErrors): TTabValue[] =>
            resolvedTabValues.filter((tabValue) => {
                const fields = tabFields?.[tabValue] ?? [String(tabValue)];
                return fields.some((field) => get(_errors, field));
            }),
        [resolvedTabValues, tabFields]
    );

    const onTabChange = useCallback(
        (_event: SyntheticEvent<Element, Event>, newSelectedTab: TTabValue) => {
            setSelectedTab(newSelectedTab);

            // Refresh the highlight against live errors; never navigate here.
            const erroredTabs = errors && !isObjectEmpty(errors) ? getTabsWithError(errors) : [];
            setTabsWithError(erroredTabs.filter((errorTab) => errorTab !== newSelectedTab));
        },
        [errors, getTabsWithError]
    );

    const onError = useCallback(
        (_errors: FieldErrors) => {
            if (!_errors || isObjectEmpty(_errors)) {
                return;
            }
            const erroredTabs = getTabsWithError(_errors);
            if (erroredTabs.includes(selectedTab)) {
                // Errors in the current tab: stay here, highlight only the others.
                setTabsWithError(erroredTabs.filter((errorTab) => errorTab !== selectedTab));
            } else if (erroredTabs.length > 0) {
                // Errors only elsewhere: jump to the first errored tab, highlight the rest.
                setSelectedTab(erroredTabs[0]);
                setTabsWithError(erroredTabs.slice(1));
            }
        },
        [getTabsWithError, selectedTab]
    );

    return { selectedTab, setSelectedTab, tabsWithError, onTabChange, onError };
}
