/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import {
    BaseVariant,
    EnqueueSnackbar,
    OptionsObject,
    SnackbarKey,
    useSnackbar,
} from 'notistack';
import { useIntlRef } from './useIntlRef';
import { IntlShape } from 'react-intl';

interface SnackInputs extends OptionsObject {
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
    closeSnackbar: (key?: SnackbarKey) => void;
}

export function useSnackMessage(): UseSnackMessageReturn {
    const intlRef = useIntlRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
        (snackInputs: SnackInputs) =>
            makeSnackbar(snackInputs, intlRef, enqueueSnackbar, 'error'),
        [enqueueSnackbar, intlRef]
    );

    /* see snackError */
    const snackWarning = useCallback(
        (snackInputs: SnackInputs) =>
            makeSnackbar(snackInputs, intlRef, enqueueSnackbar, 'warning'),
        [enqueueSnackbar, intlRef]
    );

    /* see snackError */
    const snackInfo = useCallback(
        (snackInputs: SnackInputs) =>
            makeSnackbar(snackInputs, intlRef, enqueueSnackbar, 'info'),
        [enqueueSnackbar, intlRef]
    );

    return { snackError, snackInfo, snackWarning, closeSnackbar };
}

function makeSnackbar(
    snackInputs: SnackInputs,
    intlRef: React.MutableRefObject<IntlShape>,
    enqueueSnackbar: EnqueueSnackbar,
    variant: BaseVariant
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

    if (message !== null && header !== null) {
        displayMessageWithSnackbar(message, header, enqueueSnackbar, variant, {
            key: snackInputs.key,
            persist: snackInputs.persist,
        });
    }
}

function checkAndTranslateIfNecessary(
    intlRef: React.MutableRefObject<IntlShape>,
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
    header: string,
    enqueueSnackbar: EnqueueSnackbar,
    variant: BaseVariant,
    enqueueOptions: OptionsObject
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
    return enqueueSnackbar(fullMessage, {
        ...enqueueOptions,
        variant: variant,
        style: { whiteSpace: 'pre-line' },
    });
}
