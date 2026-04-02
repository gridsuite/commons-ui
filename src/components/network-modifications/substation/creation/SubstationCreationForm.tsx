/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { TextInput } from '../../../inputs';
import { CountrySelectionInput } from '../../../inputs/reactHookForm/CountrySelectionInput';
import { FieldConstants } from '../../../../utils';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';

export function SubstationCreationForm() {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs>
                    <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={filledTextField} />
                </Grid>
                <Grid item xs>
                    <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
                </Grid>
                <Grid item xs>
                    <CountrySelectionInput
                        name={FieldConstants.COUNTRY}
                        label="Country"
                        formProps={filledTextField}
                        size="small"
                    />
                </Grid>
            </Grid>
            <PropertiesForm networkElementType="substation" />
        </>
    );
}
