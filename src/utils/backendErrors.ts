/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createElement } from 'react';
import { IntlShape } from 'react-intl';
import {
    BackendErrorSnackbarContent,
    type BackendErrorSnackbarContentProps,
} from '../components/snackbars/BackendErrorSnackbarContent';
import { type SnackInputs, type UseSnackMessageReturn } from '../hooks/useSnackMessage';

const BACKEND_DETAIL_FALLBACK = '-';

type BackendErrorDetails = BackendErrorSnackbarContentProps['details'];

type BackendErrorDetailLabels = BackendErrorSnackbarContentProps['detailLabels'];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

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
    status: number;
    backendError?: BackendErrorPayload;
}

export const isBackendErrorLike = (value: unknown): value is BackendErrorPayload => {
    if (!isRecord(value)) {
        return false;
    }
    return (
        'service' in value ||
        'errorCode' in value ||
        'message' in value ||
        'status' in value ||
        'timestamp' in value ||
        'path' in value ||
        'correlationId' in value
    );
};

export const normalizeBackendErrorPayload = (payload: BackendErrorPayload): BackendErrorPayload => {
    const record = payload as BackendErrorPayload & { server?: unknown };
    return {
        service: typeof record.service === 'string' ? record.service : undefined,
        errorCode: typeof record.errorCode === 'string' ? record.errorCode : undefined,
        message: typeof record.message === 'string' ? record.message : undefined,
        status: typeof record.status === 'number' ? record.status : undefined,
        timestamp: typeof record.timestamp === 'string' ? record.timestamp : undefined,
        path: typeof record.path === 'string' ? record.path : undefined,
        correlationId: typeof record.correlationId === 'string' ? record.correlationId : undefined,
    };
};

const toBackendErrorPayload = (value: unknown): BackendErrorPayload | undefined => {
    if (!isBackendErrorLike(value)) {
        return undefined;
    }
    return normalizeBackendErrorPayload(value);
};

const hasBackendError = (value: unknown): value is { backendError?: unknown } =>
    isRecord(value) && 'backendError' in value;

export const extractBackendErrorPayload = (error: unknown): BackendErrorPayload | undefined => {
    if (hasBackendError(error) && error.backendError) {
        return toBackendErrorPayload(error.backendError);
    }
    return toBackendErrorPayload(error);
};

export const createBackendErrorDetails = (
    payload: BackendErrorPayload
): BackendErrorSnackbarContentProps['details'] => ({
    service: typeof payload.service === 'string' ? payload.service : '',
    message: typeof payload.message === 'string' ? payload.message : '',
    path: typeof payload.path === 'string' ? payload.path : '',
});

const formatBackendDetailValue = (value: string): string => (value.trim().length > 0 ? value : BACKEND_DETAIL_FALLBACK);

const formatBackendErrorDetails = (details: BackendErrorDetails): BackendErrorDetails => ({
    service: formatBackendDetailValue(details.service),
    message: formatBackendDetailValue(details.message),
    path: formatBackendDetailValue(details.path),
});

const createBackendErrorDetailLabels = (intl: IntlShape): BackendErrorDetailLabels => ({
    service: intl.formatMessage({ id: 'serverLabel' }),
    message: intl.formatMessage({ id: 'messageLabel' }),
    path: intl.formatMessage({ id: 'pathLabel' }),
});

interface BackendErrorPresentation {
    message: string;
    detailLabels: BackendErrorDetailLabels;
    formattedDetails: BackendErrorDetails;
    showDetailsLabel: string;
    hideDetailsLabel: string;
}

const createBackendErrorPresentation = (
    intl: IntlShape,
    details: BackendErrorDetails,
    firstLine?: string
): BackendErrorPresentation => ({
    message: firstLine ?? intl.formatMessage({ id: 'genericMessage' }),
    detailLabels: createBackendErrorDetailLabels(intl),
    formattedDetails: formatBackendErrorDetails(details),
    showDetailsLabel: intl.formatMessage({ id: 'showDetails' }),
    hideDetailsLabel: intl.formatMessage({ id: 'hideDetails' }),
});

export const snackErrorWithBackendFallback = (
    error: unknown,
    snackError: UseSnackMessageReturn['snackError'],
    intl: IntlShape,
    additionalSnack?: Partial<SnackInputs>
) => {
    const backendPayload = extractBackendErrorPayload(error);
    const backendDetails = backendPayload ? createBackendErrorDetails(backendPayload) : undefined;

    if (backendDetails) {
        const { headerId, headerTxt, headerValues, persist, messageId, messageTxt, messageValues, ...rest } =
            additionalSnack ?? {};
        const otherSnackProps: Partial<SnackInputs> = rest ? { ...(rest as Partial<SnackInputs>) } : {};

        const firstLine = messageTxt ?? (messageId ? intl.formatMessage({ id: messageId }, messageValues) : undefined);

        const presentation = createBackendErrorPresentation(intl, backendDetails, firstLine);

        const snackInputs: SnackInputs = {
            ...(otherSnackProps as SnackInputs),
            messageTxt: presentation.message,
            persist: persist ?? true,
            content: (snackbarKey, snackMessage) =>
                createElement(BackendErrorSnackbarContent, {
                    snackbarKey,
                    message:
                        typeof snackMessage === 'string' && snackMessage.length > 0
                            ? snackMessage
                            : presentation.message,
                    detailLabels: presentation.detailLabels,
                    details: presentation.formattedDetails,
                    showDetailsLabel: presentation.showDetailsLabel,
                    hideDetailsLabel: presentation.hideDetailsLabel,
                }),
        };

        if (headerId !== undefined) {
            snackInputs.headerId = headerId;
        }
        if (headerTxt !== undefined) {
            snackInputs.headerTxt = headerTxt;
        }
        if (headerValues !== undefined) {
            snackInputs.headerValues = headerValues;
        }

        snackError(snackInputs);
        return;
    }

    if (additionalSnack) {
        const { messageTxt: additionalMessageTxt, messageId: additionalMessageId } = additionalSnack;
        if (additionalMessageTxt !== undefined || additionalMessageId !== undefined) {
            snackError(additionalSnack as SnackInputs);
            return;
        }
    }

    const message = error instanceof Error ? error.message : String(error);
    const restSnackInputs: Partial<SnackInputs> = additionalSnack ? { ...additionalSnack } : {};
    delete restSnackInputs.messageId;
    delete restSnackInputs.messageTxt;
    delete restSnackInputs.messageValues;
    snackError({
        ...(restSnackInputs as SnackInputs),
        messageTxt: message,
    });
};
