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
};

export function useTabs<TTabValue extends string>({
    defaultTab,
    tabEnum,
}: Readonly<UseTabsProps<TTabValue>>): UseTabs<TTabValue> {
    const [tabValue, setTabValue] = useState<TTabValue>(defaultTab);
    const [tabValuesWithError, setTabValuesWithError] = useState<TTabValue[]>([]);
    const handleTabChange = useCallback((event: SyntheticEvent<Element, Event>, newValue: TTabValue) => {
        setTabValue(newValue);
    }, []);

    const onError = useCallback(
        (errors: FieldErrors) => {
            if (!errors || isObjectEmpty(errors)) {
                return;
            }

            const tabsInError: TTabValue[] = [];
            // do not show error when being in the current tab
            Object.values(tabEnum).forEach((tab) => {
                if (errors?.[tab] && tab !== tabValue) {
                    tabsInError.push(tab);
                }
            });

            if (tabsInError.includes(tabValue)) {
                // error in current tab => do not change tab systematically but remove current tab in error list
                setTabValuesWithError(tabsInError.filter((errorTab) => errorTab !== tabValue));
            } else if (tabsInError.length > 0) {
                // switch to the first tab in the list then remove the tab in the error list
                setTabValue(tabsInError[0]);
                setTabValuesWithError(tabsInError.filter((errorTab, index, arr) => errorTab !== arr[0]));
            }
        },
        [tabValue, tabEnum]
    );

    return {
        selectedTab: tabValue,
        tabsWithError: tabValuesWithError,
        onTabChange: handleTabChange,
        onError,
    };
}
