/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum NotificationsUrlKeys {
    CONFIG = 'CONFIG',
    GLOBAL_CONFIG = 'GLOBAL_CONFIG',
    STUDY = 'STUDY',
    DIRECTORY = 'DIRECTORY',
    DIRECTORY_DELETE_STUDY = 'DIRECTORY_DELETE_STUDY',
}
export const PREFIX_CONFIG_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/config-notification`;
export const PREFIX_STUDY_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/study-notification`;
export const PREFIX_DIRECTORY_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/directory-notification`;
