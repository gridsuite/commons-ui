/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { IntlShape } from 'react-intl';
import { getUserToken } from '../redux/commonStore';
import {
    getErrorCatalogDefaultMessage,
    isKnownErrorCatalogCode,
    resolveErrorCatalogMessage,
} from '../utils/errorCatalog';

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

type BackendProblemDetail = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    businessErrorCode?: string;
    server?: string;
    timestamp?: string;
    path?: string;
};

type ErrorWithStatus = Error & {
    status?: number;
    businessErrorCode?: string;
    problemDetail?: BackendProblemDetail;
};

const firstNonEmpty = (...values: Array<string | undefined | null>): string | undefined =>
    values.find((value): value is string => typeof value === 'string' && value.trim().length > 0);

const isProblemDetail = (value: unknown): value is BackendProblemDetail => {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value as BackendProblemDetail;
    return (
        typeof candidate.detail === 'string' ||
        typeof candidate.title === 'string' ||
        typeof candidate.businessErrorCode === 'string' ||
        typeof candidate.status === 'number'
    );
};

const isSpringErrorPayload = (value: unknown): value is { status?: number; error?: string; message?: string } => {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value as { status?: number; error?: string; message?: string };
    return typeof candidate.error === 'string' && typeof candidate.message === 'string';
};

const getNavigatorLocale = (): string | undefined => {
    if (typeof navigator === 'undefined') {
        return undefined;
    }
    return navigator.language;
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

        if (isProblemDetail(errorJson)) {
            const message =
                firstNonEmpty(errorJson.detail, errorJson.title, response.statusText) ?? `${fallbackStatus}`;
            const problemDetailError: ErrorWithStatus = new Error(message);
            problemDetailError.status = errorJson.status ?? fallbackStatus;
            if (typeof errorJson.businessErrorCode === 'string') {
                problemDetailError.businessErrorCode = errorJson.businessErrorCode;
            }
            problemDetailError.problemDetail = errorJson;
            throw problemDetailError;
        }

        if (isSpringErrorPayload(errorJson)) {
            const status = errorJson.status ?? fallbackStatus;
            const springErrorMessage = firstNonEmpty(errorJson.message, response.statusText) ?? `${status}`;
            const springError: ErrorWithStatus = new Error(springErrorMessage);
            springError.status = status;
            throw springError;
        }

        const rawMessage = text.trim();
        const fallbackMessage =
            rawMessage.length > 0
                ? rawMessage
                : (firstNonEmpty(response.statusText, `${fallbackStatus}`) ?? `${fallbackStatus}`);
        const fallbackError: ErrorWithStatus = new Error(fallbackMessage);
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

export const getRequestParamFromList = (paramName: string, params: string[] = []) => {
    return new URLSearchParams(params.map((param) => [paramName, param]));
};

type CatchErrorHandlerOptions = {
    intl?: IntlShape;
};

const resolveBusinessErrorMessage = (
    error: unknown,
    options?: CatchErrorHandlerOptions
): { message: string | undefined; code: string | undefined } => {
    if (!error || typeof error !== 'object') {
        return { message: undefined, code: undefined };
    }
    const candidate = error as Partial<ErrorWithStatus>;
    const businessErrorCode = candidate.businessErrorCode ?? candidate.problemDetail?.businessErrorCode;
    if (!businessErrorCode || !isKnownErrorCatalogCode(businessErrorCode)) {
        return { message: undefined, code: businessErrorCode };
    }
    const locale = options?.intl?.locale ?? getNavigatorLocale();
    const message = locale
        ? resolveErrorCatalogMessage(locale, businessErrorCode)
        : getErrorCatalogDefaultMessage(businessErrorCode);
    return { message, code: businessErrorCode };
};

export const catchErrorHandler = (
    error: unknown,
    callback: (message: string) => void,
    options?: CatchErrorHandlerOptions
) => {
    const { message: businessMessage } = resolveBusinessErrorMessage(error, options);
    const fallbackMessage =
        error instanceof Object && 'message' in error && typeof (error as { message: unknown }).message === 'string'
            ? (error as { message: string }).message
            : undefined;
    const resolvedMessage = businessMessage ?? fallbackMessage ?? 'unknown error';

    if (error instanceof Error && resolvedMessage !== error.message) {
        Object.defineProperty(error, 'message', { value: resolvedMessage, configurable: true, writable: true });
    }

    callback(resolvedMessage);
};
