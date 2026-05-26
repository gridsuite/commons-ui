/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { TextInput } from '../../../../components/ui';
import { CountrySelectionInput } from '../../../../components/ui/reactHookForm/CountrySelectionInput';
import { FieldConstants } from '../../../../utils';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';

export function SubstationCreationForm() {
    return (
        <Grid container direction="column" spacing={2}>
            <Grid>
                <Grid container spacing={2}>
                    <Grid size="grow">
                        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={filledTextField} />
                    </Grid>
                    <Grid size="grow">
                        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
                    </Grid>
                    <Grid size="grow">
                        <CountrySelectionInput
                            name={FieldConstants.COUNTRY}
                            label="Country"
                            formProps={filledTextField}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
                <PropertiesForm networkElementType="substation" />
            </Grid>
        </Grid>
    );
}
