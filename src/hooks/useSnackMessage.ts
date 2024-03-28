/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useIntlRef } from './useIntlRef';

interface SnackInputs {
    messageTxt?: string;
    messageId?: string;
    messageValues?: { [key: string]: string };
    headerTxt?: string;
    headerId?: string;
    headerValues?: Record<string, string>;
}

export interface UseSnackMessageReturn {
    snackError: (snackInputs: SnackInputs) => void;
    snackWarning: (snackInputs: SnackInputs) => void;
    snackInfo: (snackInputs: SnackInputs) => void;
}

export function useSnackMessage(): UseSnackMessageReturn {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();

    /*
        There is two kind of messages : the message itself (bottom of snackbar), and the header (top of snackbar).
        As inputs, you can give either a text message, or an ID with optional values (for translation with intl).
            snackInputs: {
                messageTxt,
                messageId,
                messageValues,
                headerTxt,
                headerId,
                headerValues,
            }
   */
    const snackError = useCallback(
        (snackInputs: SnackInputs) =>
            makeSnackbar(snackInputs, intlRef, enqueueSnackbar, 'error', true),
        [enqueueSnackbar, intlRef]
    );

    /* see snackError */
    const snackWarning = useCallback(
        (snackInputs: SnackInputs) =>
            makeSnackbar(
                snackInputs,
                intlRef,
                enqueueSnackbar,
                'warning',
                true
            ),
        [enqueueSnackbar, intlRef]
    );

    /* see snackError */
    const snackInfo = useCallback(
        (snackInputs: SnackInputs) =>
            makeSnackbar(snackInputs, intlRef, enqueueSnackbar, 'info', false),
        [enqueueSnackbar, intlRef]
    );

    return { snackError, snackInfo, snackWarning };
}

function makeSnackbar(
    snackInputs: SnackInputs,
    intlRef: any,
    enqueueSnackbar: any,
    level: any,
    persistent: any
) {
    const message = checkAndTranslateIfNecessary(
        intlRef,
        snackInputs.messageTxt,
        snackInputs.messageId,
        snackInputs.messageValues
    );
    const header = checkAndTranslateIfNecessary(
        intlRef,
        snackInputs.headerTxt,
        snackInputs.headerId,
        snackInputs.headerValues
    );
    displayMessageWithSnackbar(
        message,
        header,
        enqueueSnackbar,
        level,
        persistent
    );
}

function checkAndTranslateIfNecessary(
    intlRef: any,
    txt?: string,
    id?: string,
    values?: any
) {
    checkInputs(txt, id, values);
    return (
        txt ??
        (id
            ? intlRef.current.formatMessage(
                  {
                      id: id,
                  },
                  values
              )
            : null)
    );
}

function checkInputs(txt?: string, id?: string, values?: any) {
    if (txt && (id || values)) {
        console.warn('Snack inputs should be [*Txt] OR [*Id, *Values]');
    }
}

function displayMessageWithSnackbar(
    message: string,
    header: any,
    enqueueSnackbar: any,
    level: any,
    persistent: any
) {
    let fullMessage = '';
    if (header) {
        fullMessage += header;
    }
    if (message) {
        if (header) {
            fullMessage += '\n\n';
        }
        fullMessage += message;
    }
    enqueueSnackbar(fullMessage, {
        variant: level,
        persist: persistent,
        style: { whiteSpace: 'pre-line' },
    });
}
