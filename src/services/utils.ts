/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore';
import {
    isBackendErrorLike,
    normalizeBackendErrorPayload,
    type HttpErrorWithBackendDetails,
} from '../utils/backendErrors';

const parseError = (text: string) => {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
};

const prepareRequest = (init: RequestInit | undefined, token?: string) => {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(`First argument of prepareRequest is not an object : ${typeof init}`);
    }
    const initCopy = { ...init };
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ?? getUserToken();
    initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
    return initCopy;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const handleError = (response: Response) => {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        const errorJson = parseError(text) as unknown;
        let customError: HttpErrorWithBackendDetails;

        if (isBackendErrorLike(errorJson)) {
            const backendError = normalizeBackendErrorPayload(errorJson);
            const status = backendError.status ?? response.status;
            const jsonRecord = errorJson as Record<string, unknown>;
            const errorLabel =
                typeof jsonRecord.error === 'string'
                    ? (jsonRecord.error as string)
                    : (backendError.errorCode ?? response.statusText);
            const message =
                backendError.message ??
                (typeof jsonRecord.message === 'string' ? (jsonRecord.message as string) : text);
            customError = new Error(
                `${errorName + status} ${errorLabel}, message : ${message}`
            ) as HttpErrorWithBackendDetails;
            customError.status = status;
            customError.backendError = backendError;
        } else if (
            isRecord(errorJson) &&
            typeof errorJson.status === 'number' &&
            (typeof errorJson.error === 'string' || typeof errorJson.message === 'string')
        ) {
            const errorLabel = typeof errorJson.error === 'string' ? errorJson.error : response.statusText;
            const message = typeof errorJson.message === 'string' ? errorJson.message : text;
            customError = new Error(
                `${errorName + errorJson.status} ${errorLabel}, message : ${message}`
            ) as HttpErrorWithBackendDetails;
            customError.status = errorJson.status;
        } else {
            customError = new Error(
                `${errorName + response.status} ${response.statusText}, message : ${text}`
            ) as HttpErrorWithBackendDetails;
            customError.status = response.status;
        }
        throw customError;
    });
};

const safeFetch = (url: string, initCopy: RequestInit) => {
    return fetch(url, initCopy).then((response) => (response.ok ? response : handleError(response)));
};

export const backendFetch = (url: string, init: RequestInit, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
};

export const backendFetchJson = (url: string, init?: RequestInit, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => (safeResponse.status === 204 ? null : safeResponse.json()));
};

export function backendFetchText(url: string, init?: RequestInit, token?: string) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.text());
}

export const getRequestParamFromList = (paramName: string, params: string[] = []) => {
    return new URLSearchParams(params.map((param) => [paramName, param]));
};

export const catchErrorHandler = (error: unknown, callback: (message: string) => void) => {
    if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
        callback(error.message);
    } else {
        callback('unknown error');
    }
};
