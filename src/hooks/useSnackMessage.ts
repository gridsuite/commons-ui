/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MutableRefObject, useCallback } from 'react';
import {
    BaseVariant,
    OptionsObject,
    closeSnackbar as closeSnackbarFromNotistack,
    useSnackbar,
} from 'notistack';
import { IntlShape } from 'react-intl';
import useIntlRef from './useIntlRef';

interface SnackInputs extends Omit<OptionsObject, 'variant' | 'style'> {
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
    closeSnackbar: typeof closeSnackbarFromNotistack;
}

function checkInputs(txt?: string, id?: string, values?: any) {
    if (txt && (id || values)) {
        console.warn('Snack inputs should be [*Txt] OR [*Id, *Values]');
    }
}

function checkAndTranslateIfNecessary(
    intlRef: MutableRefObject<IntlShape>,
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
                      id,
                  },
                  values
              )
            : null)
    );
}

function makeMessage(
    intlRef: MutableRefObject<IntlShape>,
    snackInputs: SnackInputs
): string | null {
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
    return fullMessage;
}

export function useSnackMessage(): UseSnackMessageReturn {
    const intlRef = useIntlRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const enqueue = useCallback(
        (snackInputs: SnackInputs, variant: BaseVariant) => {
            const message = makeMessage(intlRef, snackInputs);
            if (message === null) {
                return;
            }
            enqueueSnackbar(message, {
                ...snackInputs,
                variant,
                style: { whiteSpace: 'pre-line' },
            });
        },
        [enqueueSnackbar, intlRef]
    );

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
              key?, // optional key to close the snackbar
              persist
            }
   */
    const snackError = useCallback(
        (snackInputs: SnackInputs) => enqueue(snackInputs, 'error'),
        [enqueue]
    );

    /* see snackError */
    const snackWarning = useCallback(
        (snackInputs: SnackInputs) => enqueue(snackInputs, 'warning'),
        [enqueue]
    );

    /* see snackError */
    const snackInfo = useCallback(
        (snackInputs: SnackInputs) => enqueue(snackInputs, 'info'),
        [enqueue]
    );

    return { snackError, snackInfo, snackWarning, closeSnackbar };
}
