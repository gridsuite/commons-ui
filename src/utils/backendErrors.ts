/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface BackendErrorPayload {
    service?: string;
    errorCode?: string;
    message?: string;
    status?: number;
    timestamp?: string;
    path?: string;
    correlationId?: string;
}

export interface HttpErrorWithBackendDetails extends Error {
    status?: number;
    backendError?: BackendErrorPayload;
}

type BackendErrorRaw = Record<string, unknown>;

const backendErrorKeys = ['service', 'errorCode', 'message', 'status', 'timestamp', 'path', 'correlationId'];

const isRecord = (value: unknown): value is BackendErrorRaw => typeof value === 'object' && value !== null;

export const isBackendErrorLike = (value: unknown): value is BackendErrorRaw => {
    if (!isRecord(value)) {
        return false;
    }
    return backendErrorKeys.some((key) => key in value);
};

const parseString = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim().length > 0 ? value : undefined;

const parseNumber = (value: unknown): number | undefined => (typeof value === 'number' ? value : undefined);

export const normalizeBackendErrorPayload = (value: BackendErrorRaw): BackendErrorPayload => ({
    service: parseString(value.service),
    errorCode: parseString(value.errorCode),
    message: parseString(value.message),
    status: parseNumber(value.status),
    timestamp: parseString(value.timestamp),
    path: parseString(value.path),
    correlationId: parseString(value.correlationId),
});

export type BackendErrorDetails = Record<'service' | 'message' | 'path', string>;

const sanitizeDetail = (value?: string): string => (typeof value === 'string' ? value : '');

export const createBackendErrorDetails = (backendError: BackendErrorPayload): BackendErrorDetails => ({
    service: sanitizeDetail(backendError.service),
    message: sanitizeDetail(backendError.message),
    path: sanitizeDetail(backendError.path),
});

export const extractBackendErrorPayload = (error: unknown): BackendErrorPayload | undefined => {
    if (!error) {
        return undefined;
    }
    if (isRecord(error) && isBackendErrorLike(error.backendError)) {
        return normalizeBackendErrorPayload(error.backendError as BackendErrorRaw);
    }
    if (isBackendErrorLike(error)) {
        return normalizeBackendErrorPayload(error);
    }
    return undefined;
};
