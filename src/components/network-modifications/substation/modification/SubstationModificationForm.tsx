/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
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

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs>
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
                </Grid>
                <Grid item xs>
                    <TextInput
                        name={FieldConstants.EQUIPMENT_NAME}
                        label="Name"
                        formProps={filledTextField}
                        previousValue={substationToModify?.name}
                        clearable
                    />
                </Grid>
                <Grid item xs>
                    <CountrySelectionInput
                        name={FieldConstants.COUNTRY}
                        label="Country"
                        formProps={filledTextField}
                        size="small"
                        previousValue={substationToModify?.country ? translate(substationToModify.country) : ''}
                    />
                </Grid>
            </Grid>
            <PropertiesForm networkElementType="substation" isModification />
        </>
    );
}
