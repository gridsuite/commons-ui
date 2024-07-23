/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable import/prefer-default-export */

import { GsLang, GsTheme } from '@gridsuite/commons-ui';
import { LiteralUnion } from 'type-fest';
import { backendFetch, backendFetchJson, getRestBase } from '../utils/api';

/**
 * Return the base API prefix to the config server
 * <br/>Note: cannot be a const because part of the prefix can be overridden at runtime
 * @param vApi the version of api to use
 */
function getPrefix(vApi: number) {
    return `${getRestBase()}/config/v${vApi}`;
}

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

type AppName = LiteralUnion<typeof COMMON_APP_NAME, string>;
export async function fetchConfigParameters(appName: AppName) {
    console.debug(`Fetching UI configuration params for app : ${appName}`);
    const fetchParams = `${getPrefix(1)}/applications/${appName}/parameters`;
    return backendFetchJson<ConfigParameters>(fetchParams);
}

export async function fetchConfigParameter(
    currentAppName: string,
    paramName: AppConfigParameter
) {
    const appName = getAppName(currentAppName, paramName);
    console.debug(
        `Fetching UI config parameter '${paramName}' for app '${appName}'`
    );
    const fetchParams = `${getPrefix(
        1
    )}/applications/${appName}/parameters/${paramName}`;
    return backendFetchJson<ConfigParameter>(fetchParams);
}

export async function updateConfigParameter(
    currentAppName: string,
    paramName: AppConfigParameter,
    value: Parameters<typeof encodeURIComponent>[0]
) {
    const appName = getAppName(currentAppName, paramName);
    console.debug(
        `Updating config parameter '${paramName}=${value}' for app '${appName}'`
    );
    const updateParams = `${getPrefix(
        1
    )}/applications/${appName}/parameters/${paramName}?value=${encodeURIComponent(
        value
    )}`;
    return (
        await backendFetch(updateParams, {
            method: 'PUT',
        })
    ).ok;
}
