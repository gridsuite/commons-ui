/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFieldArray } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { Grid, IconButton } from '@mui/material';
import { Delete as DeleteIcon, ControlPoint as AddIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { INSERT, REMOVE } from './reactiveCapability.utils';
import { ReactiveCapabilityCurvePoints } from '../reactiveLimits.type';
import { ReactiveCapabilityCurveRowForm } from './ReactiveCapabilityCurveRowForm';
import { FieldConstants } from '../../../../../utils';
import { ErrorInput, MidFormError } from '../../../../inputs';

const MIN_LENGTH = 2;
interface ReactiveCapabilityCurveTableFormProps {
    id: string;
    tableHeadersIds: string[];
    previousValues?: ReactiveCapabilityCurvePoints[] | null;
    updatePreviousReactiveCapabilityCurveTable?: (action: string, index: number) => void;
    disabled?: boolean;
}

export function ReactiveCapabilityCurveTableForm({
    id,
    tableHeadersIds,
    previousValues,
    updatePreviousReactiveCapabilityCurveTable,
    disabled = false,
}: Readonly<ReactiveCapabilityCurveTableFormProps>) {
    const { fields: rows, insert, remove } = useFieldArray({ name: `${id}` });

    const insertRow = useCallback(
        (index: number) => {
            if (previousValues && updatePreviousReactiveCapabilityCurveTable) {
                updatePreviousReactiveCapabilityCurveTable(INSERT, index);
            }
            insert(index, {
                [FieldConstants.P]: null,
                [FieldConstants.MIN_Q]: null,
                [FieldConstants.MAX_Q]: null,
            });
        },
        [insert, updatePreviousReactiveCapabilityCurveTable, previousValues]
    );

    const handleInsertRow = () => {
        insertRow(rows.length - 1);
    };

    const handleRemoveRow = (index: number) => {
        if (previousValues && updatePreviousReactiveCapabilityCurveTable) {
            updatePreviousReactiveCapabilityCurveTable(REMOVE, index);
        }
        remove(index);
    };

    useEffect(() => {
        if (rows?.length < MIN_LENGTH) {
            for (let i = 0; i < MIN_LENGTH - rows.length; i++) {
                insertRow(rows.length);
            }
        }
    }, [insertRow, rows]);

    return (
        <Grid item container spacing={2}>
            <Grid container>
                <ErrorInput name={id} InputField={MidFormError} />
            </Grid>

            {tableHeadersIds.map((header) => (
                <Grid key={header} item xs={3}>
                    <FormattedMessage id={header} />
                </Grid>
            ))}

            {rows.map((value, index, displayedValues) => {
                let labelSuffix;
                if (index === 0) {
                    labelSuffix = 'min';
                } else if (index === displayedValues.length - 1) {
                    labelSuffix = 'max';
                } else {
                    labelSuffix = index - 1;
                }
                return (
                    <Grid key={value.id} container spacing={3} item>
                        <ReactiveCapabilityCurveRowForm id={id} index={index} labelSuffix={labelSuffix} />
                        <Grid item xs={1}>
                            <IconButton
                                key={value.id}
                                onClick={() => handleRemoveRow(index)}
                                disabled={disabled || index === 0 || index === displayedValues.length - 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                        {index === displayedValues.length - 1 && (
                            <Grid item xs={1}>
                                <IconButton
                                    key={value.id}
                                    onClick={() => handleInsertRow()}
                                    disabled={disabled}
                                    style={{ top: '-1em' }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                );
            })}
        </Grid>
    );
}
