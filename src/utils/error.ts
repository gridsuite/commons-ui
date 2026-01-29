/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SnackInputs, UseSnackMessageReturn } from '../hooks/useSnackMessage';
import { NetworkTimeoutError, ProblemDetailError } from './types';

export type HeaderSnackInputs = Pick<SnackInputs, 'headerId' | 'headerTxt' | 'headerValues'>;

export function catchErrorHandler(error: unknown, callback: (message: string) => void) {
    if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
        callback(error.message);
    } else {
        callback('unknown error');
    }
}

export function extractSnackInputs(
    error: unknown,
    headerInputs?: HeaderSnackInputs,
    errorMessageIdFallback?: string
): SnackInputs {
    if (error instanceof NetworkTimeoutError) {
        return {
            messageId: error.message,
            ...headerInputs,
        };
    }
    if (error instanceof ProblemDetailError) {
        if (error.businessErrorCode) {
            return {
                messageId: error.businessErrorCode,
                messageValues: error.businessErrorValues,
                ...headerInputs,
            };
        }
        return {
            messageId: 'errors.technicalError',
            messageValues: {
                message: error.message,
                serverName: error.serverName,
                timestamp: error.timestamp,
                traceId: error.traceId,
            },
            ...headerInputs,
        };
    }
    if (errorMessageIdFallback) {
        return {
            messageId: errorMessageIdFallback,
            ...headerInputs,
        };
    }

    let snackInputs: SnackInputs = {};
    catchErrorHandler(error, (message) => {
        snackInputs = {
            messageTxt: message,
            ...headerInputs,
        };
    });
    return snackInputs;
}

export function snackWithFallback(
    snackError: UseSnackMessageReturn['snackError'],
    error: unknown,
    headerInputs?: HeaderSnackInputs
) {
    snackError(extractSnackInputs(error, headerInputs));
}
