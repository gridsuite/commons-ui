/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import AppLocalComSvc from './app-local';
import AppsMetadataComSvc from './apps-metadata';
import ConfigComSvc from './config';
import ConfigNotificationComSvc from './config-notification';
import DirectoryComSvc from './directory';
import ExploreComSvc from './explore';
import StudyComSvc from './study';
import UserAdminComSvc from './user-admin';
import { UserGetter } from './base-service';

/*
 * This "local" instances are means to be used only internally in commons-ui library, not by external apps.
 * On the other hand, it's up to the app side to give services instances, it uses a component who needs the API.
 */

// eslint-disable-next-line one-var, import/no-mutable-exports
export let appLocalSvc: AppLocalComSvc,
    appsMetadataSvc: AppsMetadataComSvc,
    configSvc: ConfigComSvc<string>,
    configNotificationSvc: ConfigNotificationComSvc,
    directorySvc: DirectoryComSvc,
    exploreSvc: ExploreComSvc,
    studySvc: StudyComSvc,
    userAdminSvc: UserAdminComSvc;

/**
 * Set services instances use by commons-ui components.
 *
 * Intended to be used if front app has override some implementations.
 */
export function setCommonServices<TAppName extends string>(
    appLocalService: AppLocalComSvc,
    appsMetadataService: AppsMetadataComSvc,
    configService: ConfigComSvc<TAppName>,
    configNotificationService: ConfigNotificationComSvc,
    directoryService: DirectoryComSvc,
    exploreService: ExploreComSvc,
    studyService: StudyComSvc,
    userAdminService: UserAdminComSvc
) {
    appLocalSvc = appLocalService;
    appsMetadataSvc = appsMetadataService;
    configSvc = configService;
    configNotificationSvc = configNotificationService;
    directorySvc = directoryService;
    exploreSvc = exploreService;
    studySvc = studyService;
    userAdminSvc = userAdminService;
}

/**
 * Set services instances use by commons-ui components using base implementation
 * @param appName the application name use in configuration
 * @param userGetter the getter for the user token
 */
export function initCommonServices<TAppName extends string>(appName: TAppName, userGetter: UserGetter) {
    const tmpAppLocal = new AppLocalComSvc();
    setCommonServices(
        tmpAppLocal,
        new AppsMetadataComSvc(tmpAppLocal),
        new ConfigComSvc(appName, userGetter),
        new ConfigNotificationComSvc(userGetter),
        new DirectoryComSvc(userGetter),
        new ExploreComSvc(userGetter),
        new StudyComSvc(userGetter),
        new UserAdminComSvc(userGetter)
    );
}
