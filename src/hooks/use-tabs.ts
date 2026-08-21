import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldErrors, get, useFormContext } from 'react-hook-form';
import { isObjectEmpty } from '../utils/functions';

export type UseTabsReturn<TTabValue extends string | number> = {
    selectedTab: TTabValue;
    setSelectedTab: (selectedTab: TTabValue) => void;
    tabsWithError: TTabValue[];
    onTabChange: (event: SyntheticEvent, newValue: TTabValue) => void;
    onError: (errors: FieldErrors) => void;
};

export type UseTabsProps<TTabValue extends string | number> = {
    defaultTab: TTabValue;
    /**
     * All possible tab values. Use a string enum for best compatibility.
     * For numeric enums, prefer passing tabFields explicitly to avoid reverse-mapping issues.
     */
    tabValues?: TTabValue[];
    errors: FieldErrors;
    /**
     * Maps each tab value to the field paths it owns.
     * If omitted, each tab uses its own value (cast to string) as the field path.
     * Required when TTabValue is a number.
     */
    tabFields?: Partial<Record<TTabValue, string[]>>;
};

export function useTabs<TTabValue extends string | number>({
    defaultTab,
    tabValues,
    errors,
    tabFields,
}: Readonly<UseTabsProps<TTabValue>>): UseTabsReturn<TTabValue> {
    const [selectedTab, setSelectedTab] = useState<TTabValue>(defaultTab);
    const [tabsWithError, setTabsWithError] = useState<TTabValue[]>([]);

    // useFormContext returns null when there is no FormProvider ancestor.
    // This happens when useTabs is called from a plain hook (e.g. use-load-flow-parameters-form)
    // rather than from inside a component tree already wrapped by FormProvider.
    const formContext = useFormContext();
    const submitCount = formContext?.formState.submitCount ?? 0;

    const resolvedTabValues = useMemo<TTabValue[]>(
        () => tabValues ?? (Object.keys(tabFields ?? {}).map(Number) as TTabValue[]),
        [tabValues, tabFields]
    );

    const getTabsWithError = useCallback(
        (_errors: FieldErrors): TTabValue[] => {
            return resolvedTabValues.filter((tabValue) => {
                const fields = tabFields?.[tabValue] ?? [String(tabValue)];
                return fields.some((field) => get(_errors, field));
            });
        },
        [resolvedTabValues, tabFields]
    );

    // Auto-navigate to the first errored tab on submit, without reacting to mid-input
    // revalidation. No-ops when submitCount stays 0 (no FormProvider context).
    const selectedTabRef = useRef(selectedTab);
    selectedTabRef.current = selectedTab;
    const errorsRef = useRef(errors);
    errorsRef.current = errors;
    const getTabsWithErrorRef = useRef(getTabsWithError);
    getTabsWithErrorRef.current = getTabsWithError;

    useEffect(() => {
        const currentErrors = errorsRef.current;
        if (!currentErrors || isObjectEmpty(currentErrors)) {
            return;
        }
        const tabsHasError = getTabsWithErrorRef.current(currentErrors);
        if (tabsHasError.length > 0 && !tabsHasError.includes(selectedTabRef.current)) {
            setSelectedTab(tabsHasError[0]);
            setTabsWithError(tabsHasError.slice(1));
        } else if (tabsHasError.includes(selectedTabRef.current)) {
            setTabsWithError(tabsHasError.filter((t) => t !== selectedTabRef.current));
        }
        // submitCount is the intentional trigger; refs never change identity.
    }, [submitCount]);

    const onTabChange = useCallback(
        (_event: SyntheticEvent<Element, Event>, newSelectedTab: TTabValue) => {
            setSelectedTab(newSelectedTab);

            if (!errors || isObjectEmpty(errors)) {
                return;
            }
            const tabsHasError = getTabsWithError(errors);
            if (tabsHasError.includes(newSelectedTab)) {
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
            const tabsHasError = getTabsWithError(_errors);
            if (tabsHasError.includes(selectedTab)) {
                setTabsWithError(tabsHasError.filter((errorTab) => errorTab !== selectedTab));
            } else if (tabsHasError.length > 0) {
                setSelectedTab(tabsHasError[0]);
                setTabsWithError(tabsHasError.slice(1));
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
