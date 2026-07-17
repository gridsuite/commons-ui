/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SyntheticEvent, useCallback, useState } from 'react';
import { FieldErrors, get } from 'react-hook-form';
import { isObjectEmpty } from '../../../../utils/functions';

export type UseTabsReturn<TTabValue extends string> = {
    selectedTab: TTabValue;
    setSelectedTab: (selectedTab: TTabValue) => void;
    tabsWithError: TTabValue[];
    onTabChange: (event: SyntheticEvent, newValue: TTabValue) => void;
    onError: (errors: FieldErrors) => void;
};

export type UseTabsProps<TTabValue extends string> = {
    defaultTab: TTabValue;
    tabEnum: Record<string, TTabValue>;
    errors: FieldErrors;
    tabFields: Record<TTabValue, string[]>;
};

export function useTabs<TTabValue extends string>({
    defaultTab,
    tabEnum,
    errors,
    tabFields,
}: Readonly<UseTabsProps<TTabValue>>): UseTabsReturn<TTabValue> {
    const [selectedTab, setSelectedTab] = useState<TTabValue>(defaultTab);
    const [tabsWithError, setTabsWithError] = useState<TTabValue[]>([]);

    const getTabsWithError = useCallback(
        (_errors: FieldErrors) => {
            const tabsHasError: TTabValue[] = [];
            Object.values(tabEnum).forEach((tabValue) => {
                if (tabFields[tabValue]?.some((field) => get(_errors, field))) {
                    tabsHasError.push(tabValue);
                }
            });
            return tabsHasError;
        },
        [tabEnum, tabFields]
    );

    const onTabChange = useCallback(
        (event: SyntheticEvent<Element, Event>, newSelectedTab: TTabValue) => {
            setSelectedTab(newSelectedTab);

            if (!errors || isObjectEmpty(errors)) {
                return;
            }
            const tabsHasError: TTabValue[] = getTabsWithError(errors);
            if (tabsHasError.includes(newSelectedTab)) {
                // error in current tab => remove current tab in error list
                setTabsWithError(tabsHasError.filter((errorTab) => errorTab !== newSelectedTab));
            } else {
                setTabsWithError(tabsHasError);
            }
        },
        [errors, getTabsWithError]
    );

    const onError = useCallback(
        (_errors: FieldErrors) => {
            if (!_errors || isObjectEmpty(_errors)) {
                return;
            }

            const tabsHasError: TTabValue[] = getTabsWithError(_errors);
            if (tabsHasError.includes(selectedTab)) {
                // error in current tab => do not change tab systematically but remove current tab in error list
                setTabsWithError(tabsHasError.filter((errorTab) => errorTab !== selectedTab));
            } else if (tabsHasError.length > 0) {
                // switch to the first tab in the list then remove the tab in the error list
                setSelectedTab(tabsHasError[0]);
                setTabsWithError(tabsHasError.filter((errorTab, index, arr) => errorTab !== arr[0]));
            }
        },
        [getTabsWithError, selectedTab]
    );

    return {
        selectedTab,
        setSelectedTab,
        tabsWithError,
        onTabChange,
        onError,
    };
}
