/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Divider, MenuList, Stack } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Logout } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';
import { ApplicationMenu } from './applications/ApplicationMenu';
import { SideBarMenuItem } from './common/SideBarMenuItem';
import { ProfileMenu } from './profile/ProfileMenu';
import { SettingsMenu } from './settings/SettingsMenu';
import { GsLang, GsTheme, Metadata } from '../../../utils';

export interface AppSideBarFooterProps {
    isMinimized: boolean;
    isSmallScreen: boolean;
    toggleSideBarMinimized: () => void;
    isDeveloperMode: boolean;
    handleChangeDeveloperMode: (newValue: boolean) => void;
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => void;
    selectedLanguage: GsLang;
    setSelectedLanguage: (newSelectedLanguage: GsLang) => void;
    userProfile?: UserProfile;
    appsAndUrls: Metadata[];
    onLogoutClick?: () => void;
}

export function AppSideBarFooter({
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
}: Readonly<AppSideBarFooterProps>) {
    const isUserLoggedIn = !!userProfile;
    return (
        <Stack p={1}>
            <MenuList disablePadding>
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
                        <SideBarMenuItem
                            label="top-bar/logout"
                            icon={<Logout />}
                            onClick={onLogoutClick}
                            showLabel={!isMinimized}
                        />
                    </>
                )}
                <Divider />

                <SideBarMenuItem
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
