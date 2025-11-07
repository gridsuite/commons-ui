/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SnackInputs, UseSnackMessageReturn } from '../hooks/useSnackMessage';
import { CustomError } from './types/CustomError';

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
    if (error instanceof CustomError && error.businessErrorCode) {
        snackError({
            messageId: error.businessErrorCode,
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
