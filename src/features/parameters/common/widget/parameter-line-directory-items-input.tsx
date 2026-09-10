/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { parametersStyles } from '../../parameters-style';
import { DirectoryItemsInput } from '../../../../components/ui';

type DirectoryItemsInputLineProps = {
    label: string;
    name: string;
    equipmentTypes?: string[];
    elementType: string;
    hideErrorMessage?: boolean;
    allowMultiSelect?: boolean;
    labelGridSize?: number;
    inputGridSize?: number;
    showPlaceHolder?: boolean;
};

export function ParameterLineDirectoryItemsInput({
    label,
    name,
    equipmentTypes,
    elementType,
    hideErrorMessage,
    allowMultiSelect = true,
    labelGridSize = 7,
    inputGridSize = 5,
    showPlaceHolder = false,
}: Readonly<DirectoryItemsInputLineProps>) {
    return (
        <Grid container spacing={1} paddingTop={1} paddingBottom={1} sx={{ width: '100%' }}>
            <Grid size={labelGridSize} sx={parametersStyles.parameterName}>
                <FormattedMessage id={label} />
            </Grid>
            <Grid size={inputGridSize} sx={parametersStyles.controlItem}>
                <DirectoryItemsInput
                    name={name}
                    equipmentTypes={equipmentTypes}
                    elementType={elementType}
                    titleId={label}
                    hideErrorMessage={hideErrorMessage}
                    label={undefined}
                    itemFilter={undefined}
                    allowMultiSelect={allowMultiSelect}
                    showPlaceHolder={showPlaceHolder}
                />
            </Grid>
        </Grid>
    );
}
