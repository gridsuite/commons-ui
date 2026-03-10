/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { FieldConstants } from '../../../../utils';
import GridSection from '../../../grid/grid-section';
import GridItem from '../../../grid/grid-item';
import { ReadOnlyInput } from '../../../inputs/reactHookForm/readOnly/ReadOnlyInput';
import { CheckboxInput } from '../../../inputs/reactHookForm/booleans/CheckboxInput';

interface ShuntCompensatorSelectionFormProps {
    title: string;
    arrayFormName: string;
    mcsRows: Record<'id', string>[];
}

function ShuntCompensatorSelectionForm({ title, arrayFormName, mcsRows }: Readonly<ShuntCompensatorSelectionFormProps>) {
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

export function HvdcLccDeletionSpecificForm() {
    const { fields: mcsRows1 } = useFieldArray({
        name: `${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.SHUNT_COMPENSATOR_SIDE_1}`,
    });
    const { fields: mcsRows2 } = useFieldArray({
        name: `${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.SHUNT_COMPENSATOR_SIDE_2}`,
    });

    return (
        <Grid container spacing={1} direction="column" paddingTop={2} paddingLeft={1}>
            <GridSection title="LCCConverterStationShuntCompensators" />
            <Grid container spacing={1}>
                <GridItem>
                    <ShuntCompensatorSelectionForm
                        title="Side1"
                        arrayFormName={`${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.SHUNT_COMPENSATOR_SIDE_1}`}
                        mcsRows={mcsRows1}
                    />
                </GridItem>
                <GridItem>
                    <ShuntCompensatorSelectionForm
                        title="Side2"
                        arrayFormName={`${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.SHUNT_COMPENSATOR_SIDE_2}`}
                        mcsRows={mcsRows2}
                    />
                </GridItem>
            </Grid>
        </Grid>
    );
}
