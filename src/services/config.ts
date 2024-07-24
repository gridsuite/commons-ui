/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsTheme } from '@gridsuite/commons-ui';
import { LiteralUnion } from 'type-fest';
import { UrlString } from '../utils/api';
import { ApiService, UserGetter } from './base-service';

export const COMMON_APP_NAME = 'common';

export const PARAM_THEME = 'theme';
export const PARAM_LANGUAGE = 'language';

const COMMON_CONFIG_PARAMS_NAMES = new Set([PARAM_THEME, PARAM_LANGUAGE]);

// https://github.com/gridsuite/config-server/blob/main/src/main/java/org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter =
    | {
          readonly name: typeof PARAM_LANGUAGE;
          value: GsLang;
      }
    | {
          readonly name: typeof PARAM_THEME;
          value: GsTheme;
      };
export type ConfigParameters = ConfigParameter[];

type AppConfigParameter = LiteralUnion<
    typeof PARAM_THEME | typeof PARAM_LANGUAGE,
    string
>;

// TODO: how to test it's a fixed value and not any string?
type AppConfigType<TAppName extends string | undefined = undefined> =
    TAppName extends string
        ? typeof COMMON_APP_NAME | TAppName
        : LiteralUnion<typeof COMMON_APP_NAME, string>;

/**
 * Permit knowing if a parameter is common/shared between webapps or is specific to this application.
 * @param appName the current application name/identifier
 * @param paramName the parameter name/key
 */
function getAppName<TAppName extends string>(
    appName: TAppName,
    paramName: AppConfigParameter
) {
    return (
        COMMON_CONFIG_PARAMS_NAMES.has(paramName) ? COMMON_APP_NAME : appName
    ) as AppConfigType<TAppName>;
}

export default class ConfigComSvc<TAppName extends string> extends ApiService {
    private readonly appName: TAppName;

    public constructor(
        appName: TAppName,
        userGetter: UserGetter,
        restGatewayPath?: UrlString
    ) {
        super(userGetter, 'config', restGatewayPath);
        this.appName = appName;
    }

    public async fetchConfigParameters(appName: AppConfigType<TAppName>) {
        console.debug(`Fetching UI configuration params for app : ${appName}`);
        const fetchParams = `${this.getPrefix(
            1
        )}/applications/${appName}/parameters`;
        return this.backendFetchJson<ConfigParameters>(fetchParams);
    }

    public async fetchConfigParameter(paramName: AppConfigParameter) {
        const appName = getAppName(this.appName, paramName);
        console.debug(
            `Fetching UI config parameter '${paramName}' for app '${appName}'`
        );
        const fetchParams = `${this.getPrefix(
            1
        )}/applications/${appName}/parameters/${paramName}`;
        return this.backendFetchJson<ConfigParameter>(fetchParams);
    }

    public async updateConfigParameter(
        paramName: AppConfigParameter,
        value: Parameters<typeof encodeURIComponent>[0]
    ) {
        const appName = getAppName(this.appName, paramName);
        console.debug(
            `Updating config parameter '${paramName}=${value}' for app '${appName}'`
        );
        const updateParams = `${this.getPrefix(
            1
        )}/applications/${appName}/parameters/${paramName}?value=${encodeURIComponent(
            value
        )}`;
        return (
            await this.backendFetch(updateParams, {
                method: 'PUT',
            })
        ).ok;
    }
}
