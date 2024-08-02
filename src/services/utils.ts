/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore';

const parseError = (text: string) => {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
};

const prepareRequest = (init: any, token?: string) => {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(
            `First argument of prepareRequest is not an object : ${typeof init}`
        );
    }
    const initCopy = { ...init };
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ?? getUserToken();
    initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
    return initCopy;
};

const handleError = (response: any) => {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        const errorJson = parseError(text);
        let customError: Error & { status?: string };
        if (
            errorJson &&
            errorJson.status &&
            errorJson.error &&
            errorJson.message
        ) {
            customError = new Error(
                `${errorName + errorJson.status} ${
                    errorJson.error
                }, message : ${errorJson.message}`
            );
            customError.status = errorJson.status;
        } else {
            customError = new Error(
                `${errorName + response.status} ${
                    response.statusText
                }, message : ${text}`
            );
            customError.status = response.status;
        }
        throw customError;
    });
};

const safeFetch = (url: string, initCopy: any) => {
    return fetch(url, initCopy).then((response) =>
        response.ok ? response : handleError(response)
    );
};

export const backendFetch = (url: string, init: any, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
};

export const backendFetchJson = (url: string, init: any, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) =>
        safeResponse.status === 204 ? null : safeResponse.json()
    );
};

export const getRequestParamFromList = (
    paramName: string,
    params: string[] = []
) => {
    return new URLSearchParams(params.map((param) => [paramName, param]));
};
