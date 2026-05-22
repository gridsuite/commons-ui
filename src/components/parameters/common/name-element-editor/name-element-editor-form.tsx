/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { Grid } from '@mui/material';
import { DescriptionField } from '../../../inputs/reactHookForm/text/DescriptionField';
import { UniqueNameInput } from '../../../inputs/reactHookForm/text/UniqueNameInput';
import { ElementType, FieldConstants } from '../../../../utils';
import { filterStyles } from '../../../filter/HeaderFilterForm';

export interface NameElementEditorFormProps {
    initialElementName: string;
    activeDirectory: UUID;
    elementType: ElementType;
}

export function NameElementEditorForm({
    initialElementName,
    activeDirectory,
    elementType,
}: Readonly<NameElementEditorFormProps>) {
    return (
        <Grid item>
            <Grid container spacing={2} direction="column" marginBottom="8px">
                <Grid item>
                    <UniqueNameInput
                        name={FieldConstants.NAME}
                        currentName={initialElementName}
                        label="nameProperty"
                        elementType={elementType}
                        activeDirectory={activeDirectory}
                        sx={filterStyles.textField}
                        fullWidth={false}
                    />
                </Grid>
                <Grid item>
                    <DescriptionField expandingTextSx={filterStyles.description} />
                </Grid>
            </Grid>
        </Grid>
    );
}
