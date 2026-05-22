/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { FieldConstants } from '../../../../utils';
import { CheckboxInput, ReadOnlyInput } from '../../../inputs';
import GridSection from '../../../grid/grid-section';

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
        <>
            <GridSection title={title} heading={4} />
            {mcsRows.map((field, index) => (
                <Grid container spacing={1} alignItems="center" key={field.id}>
                    <Grid item xs={1}>
                        <CheckboxInput
                            name={`${arrayFormName}[${index}].${FieldConstants.SHUNT_COMPENSATOR_SELECTED}`}
                        />
                    </Grid>
                    <Grid item xs>
                        <ReadOnlyInput name={`${arrayFormName}[${index}].${FieldConstants.ID}`} />
                    </Grid>
                </Grid>
            ))}
        </>
    );
}
