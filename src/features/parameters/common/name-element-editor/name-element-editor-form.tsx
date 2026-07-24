/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { Grid, Stack } from '@mui/material';
import { DescriptionField } from '../../../../components/ui/reactHookForm/text/DescriptionField';
import { UniqueNameInput } from '../../../../components/ui/reactHookForm/text/UniqueNameInput';
import { ElementType, FieldConstants } from '../../../../utils';
import { filterStyles } from '../../../../components/composite/filter/HeaderFilterForm';

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
        <Grid>
            <Stack spacing={2} marginBottom="8px">
                <Grid>
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
                <Grid>
                    <DescriptionField expandingTextSx={filterStyles.description} />
                </Grid>
            </Stack>
        </Grid>
    );
}
