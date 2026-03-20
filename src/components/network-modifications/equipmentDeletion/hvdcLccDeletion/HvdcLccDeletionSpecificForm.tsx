/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { FieldConstants } from '../../../../utils';
import GridSection from '../../../grid/grid-section';
import GridItem from '../../../grid/grid-item';
import { ShuntCompensatorSelectionForm } from './ShuntCompensatorSelectionForm';

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
