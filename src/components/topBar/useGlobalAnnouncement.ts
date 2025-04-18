/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { User } from 'oidc-client';
import { catchErrorHandler, fetchCurrentAnnouncement } from '../../services';
import { NotificationsUrlKeys } from '../../utils/constants/notificationsProvider';
import { AnnouncementProps } from './MessageBanner';
import { useNotificationsListener } from '../notifications';

export function useGlobalAnnouncement(user: User | null) {
    const [announcementInfos, setAnnouncementInfos] = useState<AnnouncementProps>();

    useEffect(() => {
        if (user) {
            fetchCurrentAnnouncement()
                .then((announcementDto) => {
                    if (announcementDto) {
                        setAnnouncementInfos({
                            message: announcementDto.message,
                            duration: announcementDto.remainingDuration,
                            severity: announcementDto.severity,
                        });
                    }
                })
                .catch((error: unknown) => {
                    catchErrorHandler(error, (message: string) => {
                        console.error('Failed to retrieve global announcement: {}', message);
                    });
                });
        }
    }, [user]);

    const handleAnnouncementMessage = useCallback((event: MessageEvent) => {
        const eventData = JSON.parse(event.data);
        if (eventData.headers.messageType === 'announcement') {
            const announcement = {
                message: eventData.payload,
                severity: eventData.headers.severity,
                duration: eventData.headers.duration,
            } satisfies AnnouncementProps;
            console.log(`announcement incoming: ${JSON.stringify(announcement)}`);
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
