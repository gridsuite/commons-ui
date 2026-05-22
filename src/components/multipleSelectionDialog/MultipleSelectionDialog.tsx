/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { CheckBoxList, CheckboxListProps } from '../checkBoxList';

export interface MultipleSelectionDialogProps<T> extends CheckboxListProps<T> {
    open: boolean;
    handleClose: () => void;
    handleValidate: (options: T[]) => void;
    titleId: string;
}

export function MultipleSelectionDialog<T>({
    open,
    handleClose,
    handleValidate,
    selectedItems,
    titleId,
    ...props
}: MultipleSelectionDialogProps<T>) {
    const [selectedIds, setSelectedIds] = useState(selectedItems ?? []);
    return (
        <Dialog open={open} fullWidth>
            <DialogTitle>{titleId}</DialogTitle>
            <DialogContent>
                <CheckBoxList
                    selectedItems={selectedIds}
                    onSelectionChange={(values: T[]) => setSelectedIds(values)}
                    {...props}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>
                    <FormattedMessage id="multiple_selection_dialog/cancel" />
                </Button>
                <Button onClick={() => handleValidate(selectedIds)}>
                    <FormattedMessage id="multiple_selection_dialog/validate" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
