import { Divider, MenuList, Stack } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Logout } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';
import { ApplicationMenu } from './applications/ApplicationMenu';
import { SidebarMenuItem } from './common/SideBarMenuItem';
import { ProfileMenu } from './profile/ProfileMenu';
import { SettingsMenu } from './settings/SettingsMenu';
import { GsLang, GsTheme, Metadata } from '../../../utils';

export interface AppSidebarFooterProps {
    isMinimized: boolean;
    isSmallScreen: boolean;
    toggleSideBarMinimized: () => void;
    isDeveloperMode: boolean;
    handleChangeDeveloperMode: (newValue: boolean) => void;
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => Promise<void>;
    selectedLanguage: GsLang;
    setSelectedLanguage: (newSelectedLanguage: GsLang) => Promise<void>;
    userProfile?: UserProfile;
    appsAndUrls: Metadata[];
    onLogoutClick?: () => void;
}

export function AppSidebarFooter({
    isMinimized,
    isSmallScreen,
    toggleSideBarMinimized,
    isDeveloperMode,
    handleChangeDeveloperMode,
    currentTheme,
    setTheme,
    selectedLanguage,
    setSelectedLanguage,
    userProfile,
    appsAndUrls,
    onLogoutClick,
}: Readonly<AppSidebarFooterProps>) {
    const isUserLoggedIn = !!userProfile;
    return (
        <Stack sx={{ p: 1 }}>
            <MenuList
                disablePadding
                sx={{
                    '& .MuiDivider-root': {
                        my: 0,
                    },
                }}
            >
                {isUserLoggedIn && (
                    <>
                        <ApplicationMenu isMinimized={isMinimized} appsAndUrls={appsAndUrls} />
                        <ProfileMenu
                            isMinimized={isMinimized}
                            isDeveloperMode={isDeveloperMode}
                            handleChangeDeveloperMode={handleChangeDeveloperMode}
                            userProfile={userProfile}
                        />
                        <SettingsMenu
                            isMinimized={isMinimized}
                            currentTheme={currentTheme}
                            setTheme={setTheme}
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                        />
                        <SidebarMenuItem
                            label="top-bar/logout"
                            icon={<Logout />}
                            onClick={onLogoutClick}
                            showLabel={!isMinimized}
                        />
                    </>
                )}
                <Divider />

                <SidebarMenuItem
                    label="top-bar/minimize"
                    icon={isMinimized ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
                    onClick={toggleSideBarMinimized}
                    showLabel={!isMinimized}
                    disabled={isSmallScreen}
                />
            </MenuList>
        </Stack>
    );
}
