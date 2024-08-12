/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext } from 'react-hook-form'; // Import useFormContext
import FieldConstants from '../../utils/field-constants';
import ExpandingTextField from './react-hook-form/ExpandingTextField';

function DescriptionField() {
    const [isDescriptionFieldVisible, setDescriptionFieldVisibility] = useState(false);
    const { setValue } = useFormContext();
    const handleToggle = () => {
        if (isDescriptionFieldVisible) {
            setValue(FieldConstants.DESCRIPTION, '');
        }
        setDescriptionFieldVisibility((prev) => !prev);
    };

    return (
        <Box>
            {!isDescriptionFieldVisible ? (
                <Button startIcon={<AddIcon />} onClick={handleToggle}>
                    <FormattedMessage id="AddDescription" />
                </Button>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ExpandingTextField
                        name={FieldConstants.DESCRIPTION}
                        label="descriptionProperty"
                        minRows={3}
                        rows={3}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        sx={{
                            alignSelf: 'flex-end',
                            marginLeft: 1,
                            padding: 1,
                            marginBottom: 2,
                        }}
                        onClick={handleToggle}
                    >
                        <DeleteIcon />
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default DescriptionField;
