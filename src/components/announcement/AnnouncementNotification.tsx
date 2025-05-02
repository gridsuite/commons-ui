/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { User } from 'oidc-client';
import { useGlobalAnnouncement } from './useGlobalAnnouncement';
import { AnnouncementBanner, type AnnouncementBannerProps } from './AnnouncementBanner';

export type AnnouncementNotificationProps = {
    user: User | null;
    sx?: AnnouncementBannerProps['sx'];
};

export function AnnouncementNotification({ user, sx }: Readonly<AnnouncementNotificationProps>) {
    const { id, severity, message, duration } = useGlobalAnnouncement(user) ?? {};
    return (
        <AnnouncementBanner user={user ?? undefined} id={id} severity={severity} duration={duration} sx={sx}>
            {message}
        </AnnouncementBanner>
    );
}
