/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useIntl } from 'react-intl';
import { Grid, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CustomTooltip } from '../../../../../tooltip/CustomTooltip';
import { CountrySelectionInput, TextInput } from '../../../../../inputs';
import GridSection from '../../../../../grid/grid-section';
import { FieldConstants } from '../../../../../../utils';
import { PropertiesForm } from '../../../../common';

export interface SubstationCreationSectionProps {
    showDeleteButton?: boolean;
    onDelete?: () => void;
}
export function SubstationCreationSection({
    showDeleteButton = true,
    onDelete,
}: Readonly<SubstationCreationSectionProps>) {
    const intl = useIntl();
    return (
        <>
            <GridSection title="CreateSubstation" />
            <Grid container spacing={2}>
                <Grid item xs>
                    <TextInput name={FieldConstants.SUBSTATION_CREATION_ID} label="SubstationId" />
                </Grid>
                <Grid item xs>
                    <TextInput name={FieldConstants.SUBSTATION_NAME} label="substationName" />
                </Grid>
                <Grid item xs>
                    <CountrySelectionInput name={FieldConstants.COUNTRY} label="Country" size="small" />
                </Grid>
                {showDeleteButton && onDelete && (
                    <Grid item xs={1}>
                        <CustomTooltip title={intl.formatMessage({ id: 'DeleteRows' })}>
                            <IconButton onClick={onDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </CustomTooltip>
                    </Grid>
                )}
            </Grid>
            <PropertiesForm id={FieldConstants.SUBSTATION_CREATION} networkElementType="substation" />
        </>
    );
}
