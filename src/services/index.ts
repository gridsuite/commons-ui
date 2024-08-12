/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export { ApiService, WsService } from './base-service';
export type { UserGetter } from './base-service';

export { setCommonServices, initCommonServices } from './instances';

export { default as AppLocalComSvc } from './app-local';
export type { Env } from './app-local';

export { default as AppsMetadataComSvc } from './apps-metadata';
export type { AppMetadata, AppMetadataCommon, AppMetadataStudy, VersionJson } from './apps-metadata';

export { default as ConfigComSvc, COMMON_APP_NAME, PARAM_THEME, PARAM_LANGUAGE } from './config';
export type { ConfigParameter, ConfigParameters } from './config';

export { default as ConfigNotificationComSvc } from './config-notification';

export { default as DirectoryComSvc } from './directory';

export { default as ExploreComSvc } from './explore';

export { default as FilterComSvc } from './filter';

export { default as StudyComSvc, IdentifiableType } from './study';
export type { IdentifiableAttributes } from './study';

export { default as UserAdminComSvc } from './user-admin';
