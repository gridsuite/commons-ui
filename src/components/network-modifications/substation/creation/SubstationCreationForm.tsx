/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import GridItem from '../../../grid/grid-item';
import { TextInput } from '../../../inputs';
import { CountrySelectionInput } from '../../../inputs/reactHookForm/CountrySelectionInput';
import { FieldConstants } from '../../../../utils';
import { filledTextField } from '../../../dialogs';
import { PropertiesForm } from '../../common/properties/PropertiesForm';

export function SubstationCreationForm() {
    const substationIdField = <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={filledTextField} />;

    const substationNameField = (
        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
    );

    const substationCountryField = (
        <CountrySelectionInput name={FieldConstants.COUNTRY} label="Country" formProps={filledTextField} size="small" />
    );

    return (
        <>
            <Grid container spacing={2}>
                <GridItem size={4}>{substationIdField}</GridItem>
                <GridItem size={4}>{substationNameField}</GridItem>
                <GridItem size={4}>{substationCountryField}</GridItem>
            </Grid>
            <PropertiesForm networkElementType="substation" />
        </>
    );
}
