/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';
import GridSection from '../../../../../grid/grid-section';
import { IntegerInput } from '../../../../../inputs';
import { FieldConstants } from '../../../../../../utils';
import { SwitchesBetweenSections } from './switchesBetweenSections';
import { CouplingOmnibusForm } from './couplingOmnibus';

export function StructureTab() {
    const watchBusBarCount = useWatch({ name: FieldConstants.BUS_BAR_COUNT });
    const watchSectionCount = useWatch({ name: FieldConstants.SECTION_COUNT });

    const displayOmnibus = watchBusBarCount > 1 || watchSectionCount > 1;
    return (
        <>
            <GridSection title="BusBarSections" />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <IntegerInput name={FieldConstants.BUS_BAR_COUNT} label="BusBarCount" />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput name={FieldConstants.SECTION_COUNT} label="numberOfSections" />
                </Grid>
            </Grid>
            <SwitchesBetweenSections />
            {displayOmnibus && (
                <>
                    <GridSection title="Coupling_Omnibus" />
                    <Grid container>
                        <GridItem size={12}>
                            <CouplingOmnibusForm />
                        </GridItem>
                    </Grid>
                </>
            )}
        </>
    );
}
