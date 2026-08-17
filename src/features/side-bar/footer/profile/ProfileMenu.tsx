import { CustomNestedMenuItem, UserInformationDialog, UserSettingsDialog } from '@gridsuite/commons-ui';
import { Badge, ManageAccounts } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';
import { useState } from 'react';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { ProfileInfos } from './ProfileInfos';
import { UserAvatarIcon } from './UserIcon';
import { SidebarMenuItem } from '../common/SideBarMenuItem';
import { submenuFooterStyle } from '../common/submenuFooterStyle';

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
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isProfileSettingsDialogOpen, setIsProfileSettingsDialogOpen] = useState(false);

    const openProfileDialog = () => setIsProfileDialogOpen(true);
    const openProfileSettingsDialog = () => setIsProfileSettingsDialogOpen(true);

    const profileLabel = 'Profil';

    return (
        <>
            <CustomNestedMenuItem
                label={!isMinimized ? profileLabel : ''}
                leftIcon={<UserAvatarIcon label={userProfile?.name ?? ''} />}
                sx={submenuFooterStyle.subMenu}
            >
                {isMinimized && <MinimizedSubMenuHeader label={profileLabel} />}

                <ProfileInfos userProfile={userProfile} />

                <SidebarMenuItem label="Informations utilisateur" icon={<Badge />} onClick={openProfileDialog} />

                <SidebarMenuItem
                    label="Paramètres utilisateurs"
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
