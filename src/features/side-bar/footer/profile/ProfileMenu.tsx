/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Badge, ManageAccounts } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';
import { useIntl } from 'react-intl';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { ProfileInfos } from './ProfileInfos';
import { UserAvatarIcon } from './UserIcon';
import { SideBarMenuItem } from '../common/SideBarMenuItem';
import { submenuFooterStyle } from '../common/submenu-footer.style';
import { CustomNestedMenuItem } from '../../../../components';
import { SideBarDialogType, useAppSideBarDialogs } from '../../dialogs/AppSideBarDialogProvider';

interface ProfileMenuProps {
    isMinimized: boolean;
    userProfile?: UserProfile;
}

export function ProfileMenu({ isMinimized, userProfile }: Readonly<ProfileMenuProps>) {
    const intl = useIntl();
    const { setOpenDialog } = useAppSideBarDialogs();

    const openProfileDialog = () => setOpenDialog(SideBarDialogType.PROFILE);
    const openProfileSettingsDialog = () => setOpenDialog(SideBarDialogType.PROFILE_SETTINGS);

    const profileLabel = intl.formatMessage({ id: 'user-information-dialog/profile' });

    return (
        <CustomNestedMenuItem
            label={!isMinimized ? profileLabel : ''}
            leftIcon={<UserAvatarIcon sx={{ backgroundColor: 'text.secondary' }} label={userProfile?.name ?? ''} />}
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
    );
}
