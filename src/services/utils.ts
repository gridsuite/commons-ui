/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore';

const DEFAULT_TIMEOUT_MS = 50_000;

/** Optional convenience: allow per-call timeout override without crafting a signal manually. */
type FetchInitWithTimeout = RequestInit & {
    /** If provided and no signal is set, use this as the timeout override (ms). */
    timeoutMs?: number;
};

/** Custom error type thrown when AbortSignal.timeout triggers. */
export class NetworkTimeoutError extends Error {
    constructor(messageKey: string = 'errors.network.timeout') {
        super(messageKey);
        this.name = 'NetworkTimeoutError';
    }
}

const parseError = (text: string) => {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

export type BackendProblemDetail = {
    status?: number;
    businessErrorCode?: string;
};

type SpringErrorPayload = {
    status?: number;
    message?: string;
};

export interface CustomError extends Error {
    status?: number;
    businessErrorCode?: string;
    problemDetail?: BackendProblemDetail;
    springErrorPayload?: SpringErrorPayload;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const toProblemDetail = (value: unknown): BackendProblemDetail | undefined => {
    if (!isRecord(value)) {
        return undefined;
    }
    const businessErrorCode = typeof value.businessErrorCode === 'string' ? value.businessErrorCode : undefined;
    const status = typeof value.status === 'number' ? value.status : undefined;
    return {
        status,
        businessErrorCode,
    };
};

const toSpringErrorPayload = (value: unknown): SpringErrorPayload | undefined => {
    if (!isRecord(value)) {
        return undefined;
    }
    const status = typeof value.status === 'number' ? value.status : undefined;
    const message = typeof value.message === 'string' ? value.message : undefined;
    return {
        status,
        message,
    };
};

export const isProblemDetail = (error: unknown): error is CustomError & { problemDetail: BackendProblemDetail } => {
    if (!isRecord(error) || !('problemDetail' in error)) {
        return false;
    }
    return Boolean(toProblemDetail((error as { problemDetail?: unknown }).problemDetail));
};

export const isJsonSpringError = (
    error: unknown
): error is CustomError & { springErrorPayload: SpringErrorPayload } => {
    if (toSpringErrorPayload(error)) {
        return true;
    }
    if (!isRecord(error) || !('springErrorPayload' in error)) {
        return false;
    }
    return Boolean(toSpringErrorPayload((error as { springErrorPayload?: unknown }).springErrorPayload));
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

const handleError = (response: Response) => {
    return response.text().then((text: string) => {
        const errorJson = parseError(text);
        const fallbackStatus = response.status;

        const problemDetail = toProblemDetail(errorJson);
        if (problemDetail) {
            const problemDetailError: CustomError = new Error(problemDetail.businessErrorCode);
            problemDetailError.status = problemDetail.status ?? fallbackStatus;
            problemDetailError.businessErrorCode = problemDetail.businessErrorCode;
            problemDetailError.problemDetail = problemDetail;
            throw problemDetailError;
        }

        const springErrorPayload = toSpringErrorPayload(errorJson);
        if (springErrorPayload) {
            const status = springErrorPayload.status ?? fallbackStatus;
            const springError: CustomError = new Error(springErrorPayload.message);
            springError.status = status;
            springError.springErrorPayload = springErrorPayload;
            throw springError;
        }

        const rawMessage = text.trim();
        const fallbackError: CustomError = new Error(rawMessage);
        fallbackError.status = fallbackStatus;
        throw fallbackError;
    });
};

const handleTimeoutError = (error: unknown) => {
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
        throw new NetworkTimeoutError();
    }
    throw error;
};

const safeFetch = (url: string, initCopy: RequestInit) => {
    return fetch(url, initCopy)
        .then((response) => (response.ok ? response : handleError(response)))
        .catch(handleTimeoutError);
};

export const backendFetch = (url: string, init: FetchInitWithTimeout, token?: string) => {
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

export const catchErrorHandler = (
    error: unknown,
    callback: (payload: { messageId?: string; messageTxt?: string }) => void
) => {
    const candidate = isRecord(error) ? (error as Partial<CustomError>) : undefined;
    const directBusinessCode =
        typeof candidate?.businessErrorCode === 'string' ? candidate.businessErrorCode.trim() : undefined;

    if (directBusinessCode) {
        callback({ messageId: directBusinessCode });
        return;
    }

    const problemDetail = toProblemDetail(candidate?.problemDetail) ?? toProblemDetail(error);
    const detailBusinessCode =
        typeof problemDetail?.businessErrorCode === 'string' ? problemDetail.businessErrorCode.trim() : undefined;

    if (detailBusinessCode) {
        callback({ messageId: detailBusinessCode });
        return;
    }
    const springMessageRaw =
        toSpringErrorPayload(candidate?.springErrorPayload)?.message ?? toSpringErrorPayload(error)?.message;
    const springMessage = springMessageRaw?.trim();
    if (springMessage) {
        callback({ messageTxt: springMessage });
        return;
    }

    callback({ messageTxt: 'unknown error' });
};
