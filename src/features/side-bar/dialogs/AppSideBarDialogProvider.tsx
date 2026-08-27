/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

export enum SideBarDialogType {
    ABOUT = 'ABOUT',
    PROFILE = 'PROFILE',
    PROFILE_SETTINGS = 'PROFILE_SETTINGS',
}

type AppSideBarDialogContextValue = {
    openDialog: SideBarDialogType | null;
    setOpenDialog: (dialog: SideBarDialogType) => void;
    closeDialog: () => void;
};

const AppSideBarDialogContext = createContext<AppSideBarDialogContextValue | undefined>(undefined);

export function AppSideBarDialogProvider({ children }: Readonly<PropsWithChildren>) {
    const [openDialog, setOpenDialog] = useState<SideBarDialogType | null>(null);

    const closeDialog = useCallback(() => {
        setOpenDialog(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            openDialog,
            setOpenDialog,
            closeDialog,
        }),
        [closeDialog, openDialog]
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
