/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Button, Grid } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { ControlPoint } from '@mui/icons-material';
import { FieldConstants } from '../../../../../../utils';
import { fetchDefaultCountry } from '../../../../../../services';
import { AutocompleteInput, TextInput } from '../../../../../inputs';
import { SubstationCreationSection, SubstationCreationSectionProps } from './SubstationCreationSection';

export interface SubstationTabContentProps extends Pick<SubstationCreationSectionProps, 'showDeleteButton'> {
    substationOptions?: string[];
}

export function SubstationTab({ substationOptions, showDeleteButton }: Readonly<SubstationTabContentProps>) {
    const watchAddSubstationCreation = useWatch({ name: FieldConstants.ADD_SUBSTATION_CREATION });
    const { setValue, getValues } = useFormContext();

    const handleDeleteSubstationCreation = useCallback(() => {
        setValue(FieldConstants.ADD_SUBSTATION_CREATION, false);
        // clear the fields of the new substation
        setValue(FieldConstants.SUBSTATION_CREATION_ID, null);
        setValue(FieldConstants.SUBSTATION_NAME, null);
        setValue(FieldConstants.COUNTRY, null);
    }, [setValue]);

    const handleCreateSubstation = useCallback(() => {
        setValue(FieldConstants.ADD_SUBSTATION_CREATION, true);
    }, [setValue]);

    useEffect(() => {
        // in new substation mode, set the default country
        if (watchAddSubstationCreation && !getValues(FieldConstants.COUNTRY)) {
            fetchDefaultCountry().then((country) => {
                if (country) {
                    setValue(FieldConstants.COUNTRY, country);
                }
            });
        }
    }, [setValue, getValues, watchAddSubstationCreation]);

    return watchAddSubstationCreation ? (
        <SubstationCreationSection showDeleteButton={showDeleteButton} onDelete={handleDeleteSubstationCreation} />
    ) : (
        <Grid container spacing={2} my={2}>
            <Grid item xs={6}>
                {substationOptions ? (
                    <AutocompleteInput
                        name={FieldConstants.SUBSTATION_ID}
                        label="SUBSTATION"
                        openOnFocus
                        forcePopupIcon
                        options={substationOptions}
                        size="small"
                        allowNewValue={false}
                        noOptionsText=""
                    />
                ) : (
                    <TextInput name={FieldConstants.SUBSTATION_ID} label="SUBSTATION" />
                )}
            </Grid>
            <Grid item mt={0.75}>
                <FormattedMessage id="Or" />
            </Grid>
            <Grid item>
                <Button variant="text" color="primary" startIcon={<ControlPoint />} onClick={handleCreateSubstation}>
                    <FormattedMessage id="CreateSubstation" />
                </Button>
            </Grid>
        </Grid>
    );
}
