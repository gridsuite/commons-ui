/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { User } from 'oidc-client';
import { useGlobalAnnouncement } from './useGlobalAnnouncement';
import { AnnouncementBanner } from './AnnouncementBanner';

export type AnnouncementNotificationProps = {
    user: User | null;
};

export function AnnouncementNotification({ user }: Readonly<AnnouncementNotificationProps>) {
    const { id, severity, message, duration } = useGlobalAnnouncement(user) ?? {};
    return (
        <AnnouncementBanner user={user ?? undefined} id={id ?? '0-0-0-0-0'} severity={severity} duration={duration}>
            {message}
        </AnnouncementBanner>
    );
}
