/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UserProfile } from 'oidc-client-ts';
import { useGlobalAnnouncement } from './useGlobalAnnouncement';
import { AnnouncementBanner, type AnnouncementBannerProps } from './AnnouncementBanner';

export type AnnouncementNotificationProps = {
    userProfile: UserProfile | null;
    sx?: AnnouncementBannerProps['sx'];
};

export function AnnouncementNotification({ userProfile, sx }: Readonly<AnnouncementNotificationProps>) {
    const { id, severity, message, duration } = useGlobalAnnouncement(userProfile) ?? {};
    return (
        <AnnouncementBanner
            userProfile={userProfile ?? undefined}
            id={id}
            severity={severity}
            duration={duration}
            sx={sx}
        >
            {message}
        </AnnouncementBanner>
    );
}
