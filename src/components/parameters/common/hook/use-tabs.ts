/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SyntheticEvent, useCallback, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { isObjectEmpty } from '../../../../utils/functions';

export type UseTabs<TTabValue extends string> = {
    selectedTab: TTabValue;
    tabsWithError: TTabValue[];
    onTabChange: (event: SyntheticEvent, newValue: TTabValue) => void;
    onError: (errors: FieldErrors) => void;
};

export type UseTabsProps<TTabValue extends string> = {
    defaultTab: TTabValue;
    tabEnum: Record<string, TTabValue>;
    formErrors: FieldErrors | undefined;
};

export function useTabs<TTabValue extends string>({
    defaultTab,
    tabEnum,
    formErrors: errors,
}: Readonly<UseTabsProps<TTabValue>>): UseTabs<TTabValue> {
    const [selectedTab, setSelectedTab] = useState<TTabValue>(defaultTab);
    const [tabsWithError, setTabsWithError] = useState<TTabValue[]>([]);

    const onTabChange = useCallback(
        (event: SyntheticEvent<Element, Event>, newSelectedTab: TTabValue) => {
            setSelectedTab(newSelectedTab);

            if (!errors || isObjectEmpty(errors)) {
                return;
            }
            const tabsHasError: TTabValue[] = [];
            Object.values(tabEnum).forEach((tabValue) => {
                if (errors?.[tabValue]) {
                    tabsHasError.push(tabValue);
                }
            });
            if (tabsHasError.includes(newSelectedTab)) {
                // error in current tab => remove current tab in error list
                setTabsWithError(tabsHasError.filter((errorTab) => errorTab !== newSelectedTab));
            } else {
                setTabsWithError(tabsHasError);
            }
        },
        [errors, tabEnum]
    );

    const onError = useCallback(
        (_errors: FieldErrors) => {
            if (!_errors || isObjectEmpty(_errors)) {
                return;
            }

            const tabsHasError: TTabValue[] = [];
            Object.values(tabEnum).forEach((tabValue) => {
                if (_errors?.[tabValue]) {
                    tabsHasError.push(tabValue);
                }
            });
            if (tabsHasError.includes(selectedTab)) {
                // error in current tab => do not change tab systematically but remove current tab in error list
                setTabsWithError(tabsHasError.filter((errorTab) => errorTab !== selectedTab));
            } else if (tabsHasError.length > 0) {
                // switch to the first tab in the list then remove the tab in the error list
                setSelectedTab(tabsHasError[0]);
                setTabsWithError(tabsHasError.filter((errorTab, index, arr) => errorTab !== arr[0]));
            }
        },
        [selectedTab, tabEnum]
    );

    return {
        selectedTab,
        tabsWithError,
        onTabChange,
        onError,
    };
}
