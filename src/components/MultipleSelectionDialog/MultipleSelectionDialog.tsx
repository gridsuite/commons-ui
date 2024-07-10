/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import CheckboxList from '../CheckBoxList/check-box-list';

export interface MultipleSelectionDialogProps {
    options: string[];
    selectedOptions: string[];
    open: boolean;
    getOptionLabel: (option: string) => string;
    handleClose: () => void;
    handleValidate: (ids: string[]) => void;
    titleId: string;
}

const MultipleSelectionDialog = ({
    options,
    selectedOptions,
    open,
    getOptionLabel,
    handleClose,
    handleValidate,
    titleId,
}: MultipleSelectionDialogProps) => {
    const [selectedIds, setSelectedIds] = useState(selectedOptions ?? []);
    const handleSelectAll = () => {
        if (selectedIds.length !== options.length) {
            setSelectedIds(options);
        } else {
            setSelectedIds([]);
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>{titleId}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} flexDirection="column">
                    <Grid item>
                        <FormControlLabel
                            label={
                                <FormattedMessage
                                    id={'multiple_selection_dialog/selectAll'}
                                />
                            }
                            control={
                                <Checkbox
                                    checked={selectedIds.length !== 0}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length !== options.length}
                                    onChange={handleSelectAll}
                                />
                            }
                        />
                    </Grid>
                    <Grid item>
                        <CheckboxList
                            values={options}
                            selectedItems={selectedIds}
                            setSelectedItems={setSelectedIds}
                            getValueId={(v) => v}
                            defaultSelected={selectedOptions}
                            getValueLabel={getOptionLabel}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>
                    <FormattedMessage id={'multiple_selection_dialog/cancel'} />
                </Button>
                <Button onClick={() => handleValidate(selectedIds)}>
                    <FormattedMessage
                        id={'multiple_selection_dialog/validate'}
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MultipleSelectionDialog;
