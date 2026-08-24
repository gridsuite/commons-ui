/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Breakpoint, ScopedCssBaseline, Stack, Theme, ThemeProvider, useMediaQuery } from '@mui/material';
import { UserProfile } from 'oidc-client-ts';
import { ReactNode, useEffect, useState } from 'react';
import { AppSideBarHeader } from './AppSideBarHeader';
import { AppSideBarFooter } from './footer/AppSideBarFooter';
import { GridSuiteModule } from '../topBar';
import { GsLang, GsTheme, Metadata } from '../../utils';
import { useAppSideBarTheme } from './AppSideBarThemeProvider';

type SideBarProps = {
    isDeveloperMode: boolean;
    smallScreenBreakpoint: number | Breakpoint;
    handleChangeDeveloperMode: (newValue: boolean) => void;
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => void;
    selectedLanguage: GsLang;
    setSelectedLanguage: (newSelectedLanguage: GsLang) => void;
    userProfile?: UserProfile;
    appsAndUrls: Metadata[];
    onLogoutClick?: () => void;
    appName: string;
    appNameColor: string;
    appLogo: ReactNode;
    appLicense?: string;
    appVersion?: string;
    globalVersionPromise: () => Promise<string>;
    additionalModulesPromise: () => Promise<GridSuiteModule[]>;
};

export function AppSideBar({
    isDeveloperMode,
    smallScreenBreakpoint,
    handleChangeDeveloperMode,
    currentTheme,
    setTheme,
    selectedLanguage,
    setSelectedLanguage,
    userProfile,
    appsAndUrls,
    appName,
    appNameColor,
    appLogo,
    appLicense,
    appVersion,
    globalVersionPromise,
    additionalModulesPromise,
    onLogoutClick,
}: Readonly<SideBarProps>) {
    const { invertedTheme } = useAppSideBarTheme();

    const [isMinimized, setIsMinimized] = useState(true);
    const toggleSideBarMinimized = () => {
        setIsMinimized((previousIsSideBarMinimized) => !previousIsSideBarMinimized);
    };

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down(smallScreenBreakpoint));

    useEffect(() => {
        if (isSmallScreen) {
            setIsMinimized(true);
        }
    }, [isSmallScreen]);

    return (
        <ThemeProvider theme={invertedTheme}>
            <ScopedCssBaseline>
                <Stack
                    component="aside"
                    sx={{
                        width: isMinimized ? 64 : 224,
                        height: '100%',
                    }}
                >
                    <AppSideBarHeader
                        isMinimized={isMinimized}
                        isLoggedIn={!!userProfile}
                        appName={appName}
                        appNameColor={appNameColor}
                        appLogo={appLogo}
                        additionalModulesPromise={additionalModulesPromise}
                        globalVersionPromise={globalVersionPromise}
                        appLicense={appLicense}
                        appVersion={appVersion}
                    />

                    <Box
                        sx={{
                            flex: 1,
                        }}
                    />

                    <AppSideBarFooter
                        isMinimized={isMinimized}
                        isSmallScreen={isSmallScreen}
                        toggleSideBarMinimized={toggleSideBarMinimized}
                        currentTheme={currentTheme}
                        setTheme={setTheme}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        isDeveloperMode={isDeveloperMode}
                        handleChangeDeveloperMode={handleChangeDeveloperMode}
                        userProfile={userProfile}
                        appsAndUrls={appsAndUrls}
                        onLogoutClick={onLogoutClick}
                    />
                </Stack>
            </ScopedCssBaseline>
        </ThemeProvider>
    );
}
