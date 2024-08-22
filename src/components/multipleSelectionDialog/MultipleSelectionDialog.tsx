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
    List,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';

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
}: MultipleSelectionDialogProps) {
    const [selectedIds, setSelectedIds] = useState(selectedOptions ?? []);
    const handleSelectAll = () => {
        if (selectedIds.length !== options.length) {
            setSelectedIds(options);
        } else {
            setSelectedIds([]);
        }
    };
    const handleOptionSelection = (option: string) => {
        setSelectedIds((oldValues) => {
            if (oldValues.includes(option)) {
                return oldValues.filter((o) => o !== option);
            }
            return [...oldValues, option];
        });
    };

    return (
        <Dialog open={open}>
            <DialogTitle>{titleId}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} flexDirection="column">
                    <Grid item>
                        <FormControlLabel
                            label={<FormattedMessage id="multiple_selection_dialog/selectAll" />}
                            control={
                                <Checkbox
                                    checked={selectedIds.length === options.length}
                                    indeterminate={!!selectedIds.length && selectedIds.length !== options.length}
                                    onChange={handleSelectAll}
                                />
                            }
                        />
                    </Grid>
                    <Grid item>
                        <List>
                            {options.map((option) => {
                                const optionId = option;
                                const label = getOptionLabel(option);
                                return (
                                    <Grid item key={optionId}>
                                        <FormControlLabel
                                            label={label}
                                            control={
                                                <Checkbox
                                                    checked={selectedIds.includes(optionId)}
                                                    onChange={() => handleOptionSelection(optionId)}
                                                />
                                            }
                                        />
                                    </Grid>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>
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
