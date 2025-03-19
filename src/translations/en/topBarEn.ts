/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const topBarEn = defineMessages({
    'top-bar/userSettings': { defaultMessage: 'User settings' },
    'top-bar/logout': { defaultMessage: 'Logout' },
    'top-bar/goFullScreen': { defaultMessage: 'Full screen' },
    'top-bar/exitFullScreen': { defaultMessage: 'Exit full screen mode' },
    'top-bar/userInformation': { defaultMessage: 'User information' },
    'top-bar/about': { defaultMessage: 'About' },
    'top-bar/displayMode': { defaultMessage: 'Display mode' },
    'top-bar/equipmentLabel': { defaultMessage: 'Equipment label' },
    'top-bar/id': { defaultMessage: 'Id' },
    'top-bar/name': { defaultMessage: 'Name' },
    'top-bar/language': { defaultMessage: 'Language' },
    'top-bar/developerModeWarning': {
        defaultMessage: 'Developer mode: Some features are incomplete and may not work as expected.',
    },

    'about-dialog/title': { defaultMessage: 'About' },
    'about-dialog/version': { defaultMessage: 'Version {version}' },
    'about-dialog/alert-running-old-version-msg': {
        defaultMessage: 'Running old version.\nSave your work and refresh the application to load the latest version.',
    },
    'about-dialog/license': { defaultMessage: 'License' },
    'about-dialog/modules-section': { defaultMessage: 'Modules details' },
    'about-dialog/label-version': { defaultMessage: 'Version' },
    'about-dialog/label-git-version': { defaultMessage: 'Tag' },
    'about-dialog/label-type': { defaultMessage: 'Type' },
    'about-dialog/module-tooltip-app': { defaultMessage: 'application' },
    'about-dialog/module-tooltip-server': { defaultMessage: 'server' },
    'about-dialog/module-tooltip-other': { defaultMessage: 'other' },

    'user-information-dialog/title': { defaultMessage: 'User information' },
    'user-information-dialog/role': { defaultMessage: 'Role' },
    'user-information-dialog/role-user': { defaultMessage: 'Basic user' },
    'user-information-dialog/role-admin': { defaultMessage: 'Admin' },
    'user-information-dialog/profile': { defaultMessage: 'Profile' },
    'user-information-dialog/no-profile': { defaultMessage: 'No profile' },
    'user-information-dialog/quotas': { defaultMessage: 'User quotas' },
    'user-information-dialog/number-of-cases-or-studies': { defaultMessage: 'Number of cases or studies' },
    'user-information-dialog/used': { defaultMessage: 'Used: {nb}' },
    'user-information-dialog/number-of-builds-per-study': { defaultMessage: 'Number of builds per study' },

    'user-settings-dialog/title': { defaultMessage: 'User settings' },
    'user-settings-dialog/label-developer-mode': { defaultMessage: 'Developer mode' },
    'user-settings-dialog/warning-developer-mode': {
        defaultMessage:
            'Some of the features are not complete, so they may not work as expected. To hide these features, disable developer mode.',
    },
    'user-settings-dialog/close': { defaultMessage: 'Close' },
});
