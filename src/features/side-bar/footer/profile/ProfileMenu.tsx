import { CustomNestedMenuItem, UserInformationDialog, UserSettingsDialog } from '@gridsuite/commons-ui';
import { Badge, ManageAccounts } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { ProfileInfos } from './ProfileInfos';
import { UserAvatarIcon } from './UserIcon';
import { SidebarMenuItem } from '../common/SideBarMenuItem';
import { submenuFooterStyle } from '../common/submenu-footer-style';

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

                <SidebarMenuItem label="top-bar/userInformation" icon={<Badge />} onClick={openProfileDialog} />

                <SidebarMenuItem
                    label="top-bar/userSettings"
                    icon={<ManageAccounts />}
                    onClick={openProfileSettingsDialog}
                />
            </CustomNestedMenuItem>
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
        </>
    );
}
