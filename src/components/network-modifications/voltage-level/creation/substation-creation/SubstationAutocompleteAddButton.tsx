/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { FieldConstants } from '../../../../../utils';
import { LineSeparator } from '../../../../parameters';

/**
 * Custom Paper component for the substation Autocomplete dropdown.
 * Appends a "Create Substation" action button below the options list.
 */
export function SubstationAutocompleteAddButton({ children, ...rest }: Readonly<React.HTMLAttributes<HTMLElement>>) {
    const { setValue, getValues } = useFormContext();
    const intl = useIntl();

    const handleCreateSubstation = useCallback(() => {
        setValue(FieldConstants.SUBSTATION_CREATION_ID, getValues(FieldConstants.SUBSTATION_ID));
        setValue(FieldConstants.ADD_SUBSTATION_CREATION, true);
    }, [setValue, getValues]);

    return (
        <Paper {...rest}>
            <Box>
                {children}
                <LineSeparator />
                <IconButton
                    color="primary"
                    sx={{ justifyContent: 'flex-start', fontSize: 'medium', marginLeft: '2%', width: '100%' }}
                    onMouseDown={handleCreateSubstation}
                >
                    {`${intl.formatMessage({ id: 'CreateSubstation' })} : ${getValues(FieldConstants.SUBSTATION_ID)}`}
                </IconButton>
            </Box>
        </Paper>
    );
}
