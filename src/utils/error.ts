/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SnackInputs, UseSnackMessageReturn } from '../hooks/useSnackMessage';
import { ErrorMessageDescriptor, NetworkTimeoutError, ProblemDetailError } from './types';

export type HeaderSnackInputs = Pick<SnackInputs, 'headerId' | 'headerTxt' | 'headerValues'>;

export function catchErrorHandler(error: unknown, callback: (message: string) => void) {
    if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
        callback(error.message);
    } else {
        callback('unknown error');
    }
}

export function extractErrorMessageDescriptor(error: unknown, errorMessageIdFallback: string): ErrorMessageDescriptor {
    if (error instanceof NetworkTimeoutError) {
        return { descriptor: { id: error.message } };
    }

    if (error instanceof ProblemDetailError) {
        if (error.businessErrorCode) {
            return {
                descriptor: { id: error.businessErrorCode },
                values: error.businessErrorValues,
            };
        }
        return {
            descriptor: { id: 'errors.technicalError' },
            values: {
                message: error.message,
                serverName: error.serverName,
                timestamp: error.timestamp,
                traceId: error.traceId,
            },
        };
    }

    return { descriptor: { id: errorMessageIdFallback } };
}

export function snackWithFallback(
    snackError: UseSnackMessageReturn['snackError'],
    error: unknown,
    headerInputs?: HeaderSnackInputs
) {
    if (error instanceof NetworkTimeoutError || error instanceof ProblemDetailError) {
        const { descriptor, values } = extractErrorMessageDescriptor(error, '');
        snackError({
            messageId: descriptor.id,
            messageValues: values,
            ...headerInputs,
        });
    } else {
        catchErrorHandler(error, (message) => {
            snackError({
                messageTxt: message,
                ...headerInputs,
            });
        });
    }
}
