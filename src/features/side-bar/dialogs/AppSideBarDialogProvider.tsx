/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';

type AppSideBarDialogContextValue = {
    isAboutDialogOpen: boolean;
    setIsAboutDialogOpen: Dispatch<SetStateAction<boolean>>;
    isProfileDialogOpen: boolean;
    setIsProfileDialogOpen: Dispatch<SetStateAction<boolean>>;
    isProfileSettingsDialogOpen: boolean;
    setIsProfileSettingsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const AppSideBarDialogContext = createContext<AppSideBarDialogContextValue | undefined>(undefined);

export function AppSideBarDialogProvider({ children }: Readonly<PropsWithChildren>) {
    const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isProfileSettingsDialogOpen, setIsProfileSettingsDialogOpen] = useState(false);

    const contextValue = useMemo(
        () => ({
            isAboutDialogOpen,
            setIsAboutDialogOpen,
            isProfileDialogOpen,
            setIsProfileDialogOpen,
            isProfileSettingsDialogOpen,
            setIsProfileSettingsDialogOpen,
        }),
        [isAboutDialogOpen, isProfileDialogOpen, isProfileSettingsDialogOpen]
    );

    return <AppSideBarDialogContext.Provider value={contextValue}>{children}</AppSideBarDialogContext.Provider>;
}

export function useAppSideBarDialogs(): AppSideBarDialogContextValue {
    const dialogs = useContext(AppSideBarDialogContext);

    if (!dialogs) {
        throw new Error('useAppSideBarDialogs must be used within an AppSideBarDialogProvider');
    }

    return dialogs;
}
