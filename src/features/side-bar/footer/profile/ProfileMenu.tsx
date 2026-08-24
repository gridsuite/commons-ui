/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Badge, ManageAccounts } from '@mui/icons-material';
import { ThemeProvider } from '@mui/material';
import { UserProfile } from 'oidc-client-ts';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { ProfileInfos } from './ProfileInfos';
import { UserAvatarIcon } from './UserIcon';
import { SideBarMenuItem } from '../common/SideBarMenuItem';
import { submenuFooterStyle } from '../common/submenu-footer.style';
import { CustomNestedMenuItem } from '../../../../components';
import { UserInformationDialog, UserSettingsDialog } from '../../../topBar';
import { useAppSideBarTheme } from '../../AppSideBarThemeProvider';

interface ProfileMenuProps {
    isMinimized: boolean;
    userProfile?: UserProfile;
    isDeveloperMode: boolean;
    handleChangeDeveloperMode: (newValue: boolean) => void;
}

export function ProfileMenu({
    isMinimized,
    userProfile,
    isDeveloperMode,
    handleChangeDeveloperMode,
}: Readonly<ProfileMenuProps>) {
    const intl = useIntl();
    const { theme } = useAppSideBarTheme();
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isProfileSettingsDialogOpen, setIsProfileSettingsDialogOpen] = useState(false);

    const openProfileDialog = () => setIsProfileDialogOpen(true);
    const openProfileSettingsDialog = () => setIsProfileSettingsDialogOpen(true);

    const profileLabel = intl.formatMessage({ id: 'user-information-dialog/profile' });

    return (
        <>
            <CustomNestedMenuItem
                label={!isMinimized ? profileLabel : ''}
                leftIcon={<UserAvatarIcon label={userProfile?.name ?? ''} />}
                sx={submenuFooterStyle.subMenu}
            >
                {isMinimized && <MinimizedSubMenuHeader label={profileLabel} />}

                <ProfileInfos userProfile={userProfile} />

                <SideBarMenuItem label="top-bar/userInformation" icon={<Badge />} onClick={openProfileDialog} />

                <SideBarMenuItem
                    label="top-bar/userSettings"
                    icon={<ManageAccounts />}
                    onClick={openProfileSettingsDialog}
                />
            </CustomNestedMenuItem>
            <ThemeProvider theme={theme}>
                <UserInformationDialog
                    openDialog={isProfileDialogOpen}
                    onClose={() => setIsProfileDialogOpen(false)}
                    userProfile={userProfile ?? undefined}
                />
                <UserSettingsDialog
                    openDialog={isProfileSettingsDialogOpen}
                    onClose={() => setIsProfileSettingsDialogOpen(false)}
                    developerMode={isDeveloperMode}
                    onDeveloperModeClick={handleChangeDeveloperMode}
                />
            </ThemeProvider>
        </>
    );
}
