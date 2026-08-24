/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type Theme } from '@mui/material';
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

type AppSideBarThemeContextValue = {
    theme: Theme;
    invertedTheme: Theme;
};

const AppSidebarThemeContext = createContext<AppSideBarThemeContextValue | undefined>(undefined);

export function AppSideBarThemeProvider({
    theme,
    invertedTheme,
    children,
}: Readonly<PropsWithChildren<AppSideBarThemeContextValue>>) {
    const contextValue = useMemo(() => ({ theme, invertedTheme }), [theme, invertedTheme]);

    return <AppSidebarThemeContext.Provider value={contextValue}>{children}</AppSidebarThemeContext.Provider>;
}

export function useAppSideBarTheme(): AppSideBarThemeContextValue {
    const sidebarTheme = useContext(AppSidebarThemeContext);

    if (!sidebarTheme) {
        throw new Error('useSidebarTheme must be used within a SidebarThemeProvider');
    }

    return sidebarTheme;
}
