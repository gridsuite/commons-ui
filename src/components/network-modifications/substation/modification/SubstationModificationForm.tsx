/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import GridItem from '../../../grid/grid-item';
import { TextInput } from '../../../inputs';
import { CountrySelectionInput } from '../../../inputs/reactHookForm/CountrySelectionInput';
import { FieldConstants, GsLang } from '../../../../utils';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';
import { useLocalizedCountries } from '../../../../hooks';
import { SubstationModificationInfos } from './substationModification.types';

interface SubstationModificationFormProps {
    substationToModify?: SubstationModificationInfos | null;
}

export function SubstationModificationForm({ substationToModify }: Readonly<SubstationModificationFormProps>) {
    const { locale } = useIntl();
    const { translate } = useLocalizedCountries(locale as GsLang);
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const substationIdField = (
        <TextField
            size="small"
            fullWidth
            label="ID"
            value={equipmentId ?? ''}
            InputProps={{
                readOnly: true,
            }}
            disabled
            {...filledTextField}
        />
    );

    const substationNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={substationToModify?.name}
            clearable
        />
    );

    const substationCountryField = (
        <CountrySelectionInput
            name={FieldConstants.COUNTRY}
            label="Country"
            formProps={filledTextField}
            size="small"
            previousValue={substationToModify?.country ? translate(substationToModify.country) : ''}
        />
    );

    return (
        <>
            <Grid container spacing={2}>
                <GridItem size={4}>{substationIdField}</GridItem>
                <GridItem size={4}>{substationNameField}</GridItem>
                <GridItem size={4}>{substationCountryField}</GridItem>
            </Grid>
            <PropertiesForm networkElementType="substation" isModification />
        </>
    );
}
