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
import { CheckboxList } from '../CheckBoxList/check-box-list';

export interface MultipleSelectionDialogProps<T> {
    options: T[];
    selectedOptions: T[];
    open: boolean;
    getOptionLabel: (option: T) => string;
    getOptionId: (option: T) => string;
    handleClose: () => void;
    handleValidate: (options: T[]) => void;
    titleId: string;
}

function MultipleSelectionDialog<T>({
    options,
    selectedOptions,
    open,
    getOptionId,
    getOptionLabel,
    handleClose,
    handleValidate,
    titleId,
    ...props
}: MultipleSelectionDialogProps<T>) {
    const [selectedIds, setSelectedIds] = useState(selectedOptions ?? []);
    return (
        <Dialog open={open} fullWidth>
            <DialogTitle>{titleId}</DialogTitle>
            <DialogContent>
<<<<<<< HEAD
                <CheckboxList<T>
                    items={options}
                    selectedItems={selectedIds}
                    onSelectionChange={(values: any[]) =>
                        setSelectedIds(values)
                    }
                    getItemId={getOptionId}
                    getItemLabel={getOptionLabel}
                    addSelectAllCheckbox
                    {...props}
                />
=======
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
>>>>>>> main
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
