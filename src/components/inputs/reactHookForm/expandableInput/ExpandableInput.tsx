/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFieldArray } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
import { ControlPoint as AddIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { DeletableRow } from './DeletableRow';
import { ErrorInput, MidFormError } from '../errorManagement';
import { mergeSx, type MuiStyles } from '../../../../utils';

const styles = {
    button: (theme) => ({
        justifyContent: 'flex-start',
        fontSize: 'small',
        marginTop: theme.spacing(1),
    }),
    paddingButton: (theme) => ({
        paddingLeft: theme.spacing(2),
    }),
} as const satisfies MuiStyles;

export interface ExpandableInputProps {
    name: string;
    Field: React.ComponentType<any>;
    fieldProps?: any;
    addButtonLabel?: string;
    initialValue?: any;
    getDeletionMark?: (idx: number) => boolean;
    deleteCallback?: (idx: number) => boolean;
    alignItems?: string;
    watchProps?: boolean;
    disabled?: boolean;
    disabledDeletion?: (idx: number) => boolean;
}

// This component is used to display Array of objects.
// We can manage 2 states for deletion:
// - only 1 state and 1 delete icon that removes the current line
// - a second state "mark for deletion" with a second icon: the line is not removed
// and we can cancel this mark to go back to normal state.
export function ExpandableInput({
    name,
    Field, // Used to display each object of an array
    fieldProps, // Props to pass to Field
    addButtonLabel,
    initialValue, // Initial value to display when we add a new entry to array
    getDeletionMark,
    deleteCallback,
    alignItems = 'stretch', // default value for a flex container
    watchProps = true,
    disabled = false,
    disabledDeletion,
}: Readonly<ExpandableInputProps>) {
    const {
        fields: values,
        append,
        remove,
    } = useFieldArray({
        name,
    });

    return (
        <Grid item container spacing={2}>
            <Grid item xs={12}>
                <ErrorInput name={name} InputField={MidFormError} />
            </Grid>
            {watchProps &&
                values.map((value, idx) => (
                    <DeletableRow
                        key={value.id}
                        alignItems={alignItems}
                        onClick={() => {
                            const shouldRemove = deleteCallback ? deleteCallback(idx) : true;
                            if (shouldRemove) {
                                remove(idx);
                            }
                        }}
                        deletionMark={getDeletionMark?.(idx)}
                        disabledDeletion={disabledDeletion?.(idx)}
                    >
                        <Field name={name} index={idx} {...fieldProps} />
                    </DeletableRow>
                ))}
            <span>
                <Button
                    disabled={disabled}
                    fullWidth
                    sx={mergeSx(styles.button, styles.paddingButton)}
                    startIcon={<AddIcon />}
                    onClick={() => append(initialValue)}
                >
                    {addButtonLabel && <FormattedMessage id={addButtonLabel} />}
                </Button>
            </span>
        </Grid>
    );
}
