/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore';
import { ProblemDetailError } from '../utils/types/ProblemDetailError';
import { NetworkTimeoutError } from '../utils/types/NetworkTimeoutError';
import { CustomError } from '../utils/types/CustomError';

const DEFAULT_TIMEOUT_MS = 50_000;

/** Optional convenience: allow per-call timeout override without crafting a signal manually. */
type FetchInitWithTimeout = RequestInit & {
    /** If provided and no signal is set, use this as the timeout override (ms). */
    timeoutMs?: number;
};

/**
 * Ensure we always have an AbortSignal: use caller-provided signal if any,
 * otherwise apply a default timeout (30s by default, overridable via timeoutMs).
 */
const ensureSignal = (init?: FetchInitWithTimeout): RequestInit => {
    if (init?.signal) return init;

    const timeoutMs = typeof init?.timeoutMs === 'number' ? init.timeoutMs : DEFAULT_TIMEOUT_MS;

    return {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
    };
};

const prepareRequest = (init: FetchInitWithTimeout | undefined, token?: string) => {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(`First argument of prepareRequest is not an object : ${typeof init}`);
    }

    // Apply default/global timeout signal logic
    const initWithSignal = ensureSignal(init);

    // Add Authorization header
    initWithSignal.headers = new Headers(initWithSignal.headers || {});
    const tokenCopy = token ?? getUserToken();
    initWithSignal.headers.append('Authorization', `Bearer ${tokenCopy}`);

    return initWithSignal;
};

type ProblemDetailDto = {
    status: number;
    server: string;
    timestamp: string;
    traceId: string;
    detail: string;
    businessErrorCode?: string;
    businessErrorValues?: Record<string, unknown>;
};

const isProblemDetail = (error: unknown): error is ProblemDetailDto => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    const e = error as Record<string, unknown>;

    return (
        typeof e.status === 'number' &&
        typeof e.server === 'string' &&
        typeof e.timestamp === 'string' &&
        typeof e.traceId === 'string' &&
        typeof e.detail === 'string'
    );
};

export const parseError = (errorTxt: string) => {
    let error: unknown;
    try {
        error = JSON.parse(errorTxt);
    } catch {
        return new Error(errorTxt);
    }

    if (isProblemDetail(error)) {
        return new ProblemDetailError(
            error.status,
            error.detail,
            error.server,
            error.timestamp,
            error.traceId,
            error.businessErrorCode,
            error.businessErrorValues
        );
    }

    return new Error(errorTxt);
};

export const handleNotOkResponse = async (response: Response): Promise<never> => {
    let bodyText: string;

    try {
        bodyText = await response.text();
    } catch (error) {
        throw new CustomError(response.status, 'Error in error: unable to read response body', {
            cause: error,
        });
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json') && !contentType.includes('application/problem+json')) {
        throw new CustomError(response.status, bodyText);
    }

    let body: unknown;
    try {
        body = JSON.parse(bodyText);
    } catch (error) {
        throw new CustomError(response.status, `Error in error: unable to parse json response from text\n${bodyText}`, {
            cause: error,
        });
    }

    if (isProblemDetail(body)) {
        throw new ProblemDetailError(
            body.status,
            body.detail,
            body.server,
            body.timestamp,
            body.traceId,
            body.businessErrorCode,
            body.businessErrorValues
        );
    }

    throw new CustomError(response.status, bodyText);
};

const handleTimeoutError = (error: unknown) => {
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
        throw new NetworkTimeoutError();
    }
    throw error;
};

const safeFetch = (url: string, initCopy: RequestInit) => {
    return fetch(url, initCopy)
        .then((response) => (response.ok ? response : handleNotOkResponse(response)))
        .catch(handleTimeoutError);
};

export const backendFetch = (url: string, init?: FetchInitWithTimeout, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
};

export const backendFetchJson = (url: string, init?: FetchInitWithTimeout, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => (safeResponse.status === 204 ? null : safeResponse.json()));
};

export function backendFetchText(url: string, init?: FetchInitWithTimeout, token?: string) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.text());
}

export const backendFetchFile = (url: string, init: RequestInit, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.blob());
};

export const getRequestParamFromList = (paramName: string, params: string[] = []) => {
    return new URLSearchParams(params.map((param) => [paramName, param]));
};
