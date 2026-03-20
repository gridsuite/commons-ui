/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage } from 'react-intl';
import { Grid } from '@mui/material';
import { FieldConstants } from '../../../../utils';
import { CheckboxInput, ReadOnlyInput } from '../../../inputs';

interface ShuntCompensatorSelectionFormProps {
    title: string;
    arrayFormName: string;
    mcsRows: Record<'id', string>[];
}

export function ShuntCompensatorSelectionForm({
    title,
    arrayFormName,
    mcsRows,
}: Readonly<ShuntCompensatorSelectionFormProps>) {
    return (
        <Grid item container spacing={1} direction="column">
            <Grid item>
                <h4>
                    <FormattedMessage id={title} />
                </h4>
            </Grid>
            {mcsRows.map((field, index) => (
                <Grid container spacing={1} alignItems="center" key={field.id}>
                    <Grid item xs={1} alignItems="start">
                        <CheckboxInput
                            key={`${field.id}SEL`}
                            name={`${arrayFormName}[${index}].${FieldConstants.SHUNT_COMPENSATOR_SELECTED}`}
                        />
                    </Grid>
                    <Grid item xs={11} alignItems="start">
                        <ReadOnlyInput key={`${field.id}ID`} name={`${arrayFormName}[${index}].${FieldConstants.ID}`} />
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
}
