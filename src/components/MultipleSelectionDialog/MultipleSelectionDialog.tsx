/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { CheckboxList } from '../CheckBoxList';

export interface MultipleSelectionDialogProps {
    options: string[];
    selectedOptions: string[];
    open: boolean;
    getOptionLabel: (option: string) => string;
    handleClose: () => void;
    handleValidate: (ids: string[]) => void;
    titleId: string;
}

function MultipleSelectionDialog({
    options,
    selectedOptions,
    open,
    getOptionLabel,
    handleClose,
    handleValidate,
    titleId,
    ...props
}: MultipleSelectionDialogProps) {
    const [selectedIds, setSelectedIds] = useState(selectedOptions ?? []);
    return (
        <Dialog open={open} fullWidth>
            <DialogTitle>{titleId}</DialogTitle>
            <DialogContent>
                <CheckboxList
                    values={options}
                    selectedItems={selectedIds}
                    onSelectionChange={(values: any[]) =>
                        setSelectedIds(values)
                    }
                    getValueId={(v) => v}
                    getValueLabel={getOptionLabel}
                    addSelectAllCheckbox
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

export default MultipleSelectionDialog;
