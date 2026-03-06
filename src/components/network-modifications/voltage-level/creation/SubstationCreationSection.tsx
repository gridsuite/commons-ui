/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useIntl } from 'react-intl';
import { TextInput } from '../../../inputs';
import { CountrySelectionInput } from '../../../inputs/reactHookForm/CountrySelectionInput';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import GridSection from '../../../grid/grid-section';
import { LineSeparator } from '../../../parameters/common/line-separator';
import { FieldConstants } from '../../../../utils';

interface SubstationCreationSectionProps {
    showDeleteButton?: boolean;
    onDelete?: () => void;
}
export function SubstationCreationSection({
    showDeleteButton = true,
    onDelete,
}: Readonly<SubstationCreationSectionProps>) {
    const intl = useIntl();
    return (
        <Grid>
            <Grid item xs={12} container spacing={2} />
            <GridSection title={intl.formatMessage({ id: 'CreateSubstation' })} />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextInput name={FieldConstants.SUBSTATION_CREATION_ID} label="SubstationId" />
                </Grid>
                <Grid item xs={4}>
                    <TextInput name={FieldConstants.SUBSTATION_NAME} label="substationName" />
                </Grid>
                <Grid item xs={3}>
                    <CountrySelectionInput name={FieldConstants.COUNTRY} label="Country" size="small" />
                </Grid>
                {showDeleteButton && onDelete && (
                    <Grid item xs={1}>
                        <Tooltip title={intl.formatMessage({ id: 'DeleteRows' })}>
                            <IconButton onClick={onDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
            </Grid>
            <PropertiesForm id={FieldConstants.SUBSTATION_CREATION} networkElementType="substation" />
            <Grid item xs={12} paddingTop={2}>
                <LineSeparator />
            </Grid>
        </Grid>
    );
}
