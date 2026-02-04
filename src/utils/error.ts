/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IntlShape } from 'react-intl';
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

export function snackWithFallback(
    snackError: UseSnackMessageReturn['snackError'],
    error: unknown,
    headerInputs?: HeaderSnackInputs
) {
    if (error instanceof NetworkTimeoutError) {
        snackError({
            messageId: error.message,
            ...headerInputs,
        });
        return;
    }
    if (error instanceof ProblemDetailError) {
        if (error.businessErrorCode) {
            snackError({
                messageId: error.businessErrorCode,
                messageValues: error.businessErrorValues,
                ...headerInputs,
            });
        } else {
            snackError({
                messageId: 'errors.technicalError',
                messageValues: {
                    message: error.message,
                    serverName: error.serverName,
                    timestamp: error.timestamp,
                    traceId: error.traceId,
                },
                ...headerInputs,
            });
        }
    } else {
        catchErrorHandler(error, (message) => {
            snackError({
                messageTxt: message,
                ...headerInputs,
            });
        });
    }
}

export function extractErrorMessage(error: unknown, errorMessageIdFallback: string, intl: IntlShape): string {
    if (error instanceof NetworkTimeoutError) {
        return intl.formatMessage({ id: error.message });
    }
    if (error instanceof ProblemDetailError) {
        if (error.businessErrorCode) {
            return intl.formatMessage(
                {
                    id: error.businessErrorCode,
                },
                error.businessErrorValues
            );
        }
        return intl.formatMessage(
            {
                id: 'errors.technicalError',
            },
            {
                message: error.message,
                serverName: error.serverName,
                timestamp: error.timestamp,
                traceId: error.traceId,
            }
        );
    }
    return intl.formatMessage({
        id: errorMessageIdFallback,
    });
}
