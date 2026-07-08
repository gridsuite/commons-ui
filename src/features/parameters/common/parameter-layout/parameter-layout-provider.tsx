/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode, createContext, useContext, useMemo } from 'react';

// Context for XS Screen
interface ParameterLayoutContextValue {
    isXsScreen: boolean;
}

const ParameterLayoutContext = createContext<ParameterLayoutContextValue>({ isXsScreen: false });

export const useParameterLayoutContext = () => useContext(ParameterLayoutContext);

export function ParameterLayoutProvider({
    isXsScreen,
    children,
}: Readonly<{
    isXsScreen: boolean;
    children: ReactNode;
}>) {
    const isXsScreenMemo = useMemo(() => ({ isXsScreen }), [isXsScreen]);
    return <ParameterLayoutContext.Provider value={isXsScreenMemo}>{children}</ParameterLayoutContext.Provider>;
}
