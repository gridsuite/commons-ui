/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { AutocompleteInput, GridItem, GridSection, TextInput } from '../../../components';
import { areIdsEqual, FieldConstants, getIdOrValue, getObjectId, Option } from '../../../utils';

export interface DeleteVoltageLevelOnLineFormProps {
    lineOptions: Option[];
}

export function DeleteVoltageLevelOnLineForm({ lineOptions }: Readonly<DeleteVoltageLevelOnLineFormProps>) {
    console.info('JBO', lineOptions);
    const lineOptionsMemo = useMemo(() => lineOptions ?? [], [lineOptions]);
    const lineToAttachTo1Field = (
        <AutocompleteInput
            isOptionEqualToValue={areIdsEqual}
            allowNewValue
            forcePopupIcon
            name={FieldConstants.LINE_TO_ATTACH_TO_1_ID}
            label="Line1"
            options={lineOptionsMemo}
            getOptionLabel={getObjectId}
            inputTransform={(value) => value ?? ''}
            outputTransform={(value: any) => (value === '' ? null : getIdOrValue(value))}
            size="small"
        />
    );

    const lineToAttachTo2Field = (
        <AutocompleteInput
            isOptionEqualToValue={areIdsEqual}
            allowNewValue
            forcePopupIcon
            name={FieldConstants.LINE_TO_ATTACH_TO_2_ID}
            label="Line2"
            options={lineOptionsMemo}
            getOptionLabel={getObjectId}
            inputTransform={(value) => value ?? ''}
            outputTransform={(value: any) => (value === '' ? null : getIdOrValue(value))}
            size="small"
        />
    );

    const replacingLineIdField = <TextInput name={FieldConstants.REPLACING_LINE_1_ID} label="ReplacingLineId" />;
    const replacingLineNameField = <TextInput name={FieldConstants.REPLACING_LINE_1_NAME} label="ReplacingLineName" />;

    return (
        <>
            <GridSection title="Line1" />
            <Grid
                container
                spacing={2}
                sx={{
                    alignItems: 'center',
                }}
            >
                <GridItem size={5}>{lineToAttachTo1Field}</GridItem>
            </Grid>
            <GridSection title="Line2" />
            <Grid
                container
                spacing={2}
                sx={{
                    alignItems: 'center',
                }}
            >
                <GridItem size={5}>{lineToAttachTo2Field}</GridItem>
            </Grid>
            <GridSection title="ReplacingLine" />
            <Grid container spacing={2}>
                <GridItem>{replacingLineIdField}</GridItem>
                <GridItem>{replacingLineNameField}</GridItem>
            </Grid>
        </>
    );
}

export default DeleteVoltageLevelOnLineForm;
