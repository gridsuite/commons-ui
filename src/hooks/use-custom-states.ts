/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState, useCallback, Dispatch, SetStateAction } from 'react';

export type UseStateBooleanReturn = {
    value: boolean;
    setTrue: () => void;
    setFalse: () => void;
    invert: () => void;
    setValue: Dispatch<SetStateAction<boolean>>;
};

export const useStateBoolean = (initialState: boolean | (() => boolean)): UseStateBooleanReturn => {
    const [value, setValue] = useState<boolean>(initialState);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    const invert = useCallback(() => setValue((prevState) => !prevState), []);
    return { value, setTrue, setFalse, invert, setValue };
};

export type UseStateNumberReturn = {
    value: number;
    setValue: Dispatch<SetStateAction<number>>;
    increment: (step?: number) => void;
    decrement: (step?: number) => void;
    reset: () => void;
};

export const useStateNumber = (initialState: number | (() => number) = 0): UseStateNumberReturn => {
    const [value, setValue] = useState<number>(initialState);
    const increment = useCallback((step: number = 1) => setValue((prevState) => prevState + step), []);
    const decrement = useCallback((step: number = 1) => setValue((prevState) => prevState - step), []);
    const reset = useCallback(() => setValue(initialState), [initialState]);
    return { value, increment, decrement, reset, setValue };
};
