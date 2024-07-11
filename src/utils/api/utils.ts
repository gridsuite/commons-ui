/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUser } from '../../redux/commonStore';

export enum FileType {
    ZIP = 'ZIP',
}

export function getRequestParam(paramName: string, params: string[] = []) {
    return new URLSearchParams(params.map((param) => [paramName, param]));
}

export function getRequestParams(parameters: Record<string, string[]>) {
    const searchParams = new URLSearchParams();
    Object.entries(parameters)
        .flatMap(([paramName, params]) =>
            params.map((param) => [paramName, param])
        )
        .forEach(([paramName, param]) => searchParams.append(paramName, param));
    return searchParams;
}

export function getUserToken() {
    return getUser()?.id_token;
}

export function appendSearchParam(
    url: string,
    searchParams: URLSearchParams | string | null
) {
    return searchParams
        ? `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`
        : url;
}
