/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { v4 } from 'uuid';
import { useCallback, useEffect, useState } from 'react';
import type { User } from 'oidc-client';
import { fetchCurrentAnnouncement } from '../../services/userAdmin';
import { NotificationsUrlKeys } from '../../utils/constants/notificationsProvider';
import { useNotificationsListener } from '../notifications/hooks/useNotificationsListener';
import type { AnnouncementSeverity } from '../../utils/types';

export type AnnouncementProps = {
    id: UUID; // keep the id to refresh the component when the message is updated
    message: string;
    duration: number;
    severity: AnnouncementSeverity;
};

export function useGlobalAnnouncement(user: User | null) {
    const [announcementInfos, setAnnouncementInfos] = useState<AnnouncementProps>();

    useEffect(() => {
        if (user) {
            fetchCurrentAnnouncement()
                .then((announcementDto) => {
                    if (announcementDto) {
                        setAnnouncementInfos({
                            id: announcementDto.id,
                            message: announcementDto.message,
                            duration: announcementDto.remainingDuration,
                            severity: announcementDto.severity,
                        });
                    } else {
                        setAnnouncementInfos(undefined); // no message currently shown
                        // TODO: is events still coming even if user disconnect by token expiration? if yes then no need for this "else" case
                    }
                })
                .catch((error: unknown) => console.error('Failed to retrieve global announcement:', error));
        } else {
            setAnnouncementInfos(undefined); // user disconnected
        }
    }, [user]);

    const handleAnnouncementMessage = useCallback((event: MessageEvent) => {
        const eventData = JSON.parse(event.data);
        if (eventData.headers.messageType === 'announcement') {
            const announcement: AnnouncementProps = {
                id: eventData.id ?? v4(),
                message: eventData.payload,
                severity: eventData.headers.severity,
                duration: eventData.headers.duration,
            };
            console.debug('announcement incoming:', announcement);
            setAnnouncementInfos(announcement);
        } else if (eventData.headers.messageType === 'cancelAnnouncement') {
            setAnnouncementInfos(undefined);
        }
    }, []);

    useNotificationsListener(NotificationsUrlKeys.GLOBAL_CONFIG, {
        listenerCallbackMessage: handleAnnouncementMessage,
    });

    return announcementInfos;
}
