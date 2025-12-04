/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Button } from '@mui/material';
import { ControlPoint as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import { ExpandingTextField } from './ExpandingTextField';
import type { SxStyle } from '../../../../utils/styles';
import { MAX_CHAR_DESCRIPTION } from '../../../../utils';

export interface DescriptionFieldProps {
    expandingTextSx?: SxStyle;
    maxCharactersNumber?: number;
    rows?: number;
}

export function DescriptionField({
    expandingTextSx,
    maxCharactersNumber = MAX_CHAR_DESCRIPTION,
    rows = 3,
}: Readonly<DescriptionFieldProps>) {
    const { setValue, getValues } = useFormContext();
    const description = getValues(FieldConstants.DESCRIPTION);
    const [isDescriptionFieldVisible, setIsDescriptionFieldVisible] = useState(!!description);

    const handleOpenDescription = () => {
        setIsDescriptionFieldVisible(true);
    };

    const handleCloseDescription = () => {
        setIsDescriptionFieldVisible(false);
        setValue(FieldConstants.DESCRIPTION, '', { shouldDirty: true });
    };

    useEffect(() => {
        if (description) {
            setIsDescriptionFieldVisible(true);
        }
    }, [description]);

    return (
        <Box>
            {!isDescriptionFieldVisible ? (
                <Button startIcon={<AddIcon />} onClick={handleOpenDescription} data-testid="AddDescriptionButton">
                    <FormattedMessage id="AddDescription" />
                </Button>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ExpandingTextField
                        name={FieldConstants.DESCRIPTION}
                        label="descriptionProperty"
                        minRows={rows}
                        rows={rows}
                        sx={expandingTextSx}
                        maxCharactersNumber={maxCharactersNumber}
                    />
                    <Button
                        sx={{
                            alignSelf: 'flex-end',
                            marginLeft: 1,
                            padding: 1,
                            marginBottom: 2,
                        }}
                        onClick={handleCloseDescription}
                    >
                        <DeleteIcon />
                    </Button>
                </Box>
            )}
        </Box>
    );
}
