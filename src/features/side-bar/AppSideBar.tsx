import { Box, Stack } from '@mui/material';
import { UserProfile } from 'oidc-client-ts';
import { useState } from 'react';
import { AppSidebarHeader } from './AppSidebarHeader';
import { AppSidebarFooter } from './footer/AppSidebarFooter';
import { GridSuiteModule } from '../topBar';
import { GsLang, GsTheme, Metadata } from '../../utils';

type SidebarProps = {
    isDeveloperMode: boolean;
    handleChangeDeveloperMode: (newValue: boolean) => void;
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => Promise<void>;
    selectedLanguage: GsLang;
    setSelectedLanguage: (newSelectedLanguage: GsLang) => Promise<void>;
    userProfile?: UserProfile;
    appsAndUrls: Metadata[];
    onLogoutClick?: () => void;
    appName: string;
    appLicense?: string;
    appVersion?: string;
    globalVersionPromise: () => Promise<string>;
    additionalModulesPromise: () => Promise<GridSuiteModule[]>;
};

export function AppSideBar({
    isDeveloperMode,
    handleChangeDeveloperMode,
    currentTheme,
    setTheme,
    selectedLanguage,
    setSelectedLanguage,
    userProfile,
    appsAndUrls,
    appName,
    appLicense,
    appVersion,
    globalVersionPromise,
    additionalModulesPromise,
    onLogoutClick,
}: Readonly<SidebarProps>) {
    const [isMinimized, setIsMinimized] = useState(true);
    const toggleSideBarMinimized = (): void => {
        setIsMinimized((previousIsSideBarMinimized) => !previousIsSideBarMinimized);
    };
    return (
        <Stack
            component="aside"
            sx={{
                width: isMinimized ? 64 : 224,
                height: '100%',
            }}
        >
            <AppSidebarHeader
                isMinimized={isMinimized}
                isLoggedIn={!!userProfile}
                appName={appName}
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

            <AppSidebarFooter
                isMinimized={isMinimized}
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
    );
}
