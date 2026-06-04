/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { ParseResult } from 'papaparse';
import { CancelButton } from '../reactHookForm';

export interface CsvPickerConfirmationDialogProps<TData = unknown> {
    pendingImport: { results: ParseResult<TData>; file: File } | null;
    onReplace: (results: ParseResult<TData>, file: File) => void;
    onAppend: (results: ParseResult<TData>, file: File) => void;
    onClose: () => void;
}

export function CsvPickerConfirmationDialog<TData = unknown>({
    pendingImport,
    onReplace,
    onAppend,
    onClose,
}: CsvPickerConfirmationDialogProps<TData>) {
    const intl = useIntl();

    return (
        <Dialog open={pendingImport !== null} aria-labelledby="csv-picker-confirmation">
            <DialogTitle id="csv-picker-confirmation">Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>{intl.formatMessage({ id: 'keepCSVDataMessage' })}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onClose} />
                <Button
                    variant="outlined"
                    onClick={() => {
                        onReplace(pendingImport!.results, pendingImport!.file);
                        onClose();
                    }}
                >
                    <FormattedMessage id="replace" />
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        onAppend(pendingImport!.results, pendingImport!.file);
                        onClose();
                    }}
                >
                    <FormattedMessage id="add" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
