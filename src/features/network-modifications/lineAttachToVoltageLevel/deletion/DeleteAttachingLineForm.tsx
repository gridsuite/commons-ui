/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Fragment } from 'react';
import { Grid } from '@mui/material';
import { AutocompleteInput, TextInput } from '../../../../components/ui';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { areIdsEqual, FieldConstants, getIdOrValue, getObjectId, Option } from '../../../../utils';

const GRID_ITEM_SIZE = 5;
const GRID_SPACING = 2;

const LINE_AUTOCOMPLETE_SHARED_PROPS = {
    isOptionEqualToValue: areIdsEqual,
    allowNewValue: true,
    forcePopupIcon: true,
    getOptionLabel: getObjectId,
    outputTransform: getIdOrValue,
    size: 'small' as const,
} as const;

export interface DeleteAttachingLineFormProps {
    lineOptions?: Option[];
}

interface LineFieldConfig {
    name: string;
    label: string;
    sectionTitle: string;
}

const LINE_FIELDS: readonly LineFieldConfig[] = [
    { name: FieldConstants.LINE_TO_ATTACH_TO_1_ID, label: 'Line1', sectionTitle: 'Line1' },
    { name: FieldConstants.LINE_TO_ATTACH_TO_2_ID, label: 'Line2', sectionTitle: 'Line2' },
    { name: FieldConstants.ATTACHED_LINE_ID, label: 'LineAttached', sectionTitle: 'LineAttached' },
] as const;

export function DeleteAttachingLineForm({ lineOptions = [] }: Readonly<DeleteAttachingLineFormProps>) {
    return (
        <>
            {LINE_FIELDS.map(({ name, label, sectionTitle }) => (
                <Fragment key={name}>
                    <GridSection title={sectionTitle} />
                    <Grid
                        container
                        spacing={GRID_SPACING}
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <GridItem size={GRID_ITEM_SIZE}>
                            <AutocompleteInput
                                {...LINE_AUTOCOMPLETE_SHARED_PROPS}
                                name={name}
                                label={label}
                                options={lineOptions}
                            />
                        </GridItem>
                    </Grid>
                </Fragment>
            ))}

            <GridSection title="ReplacingLine" />
            <Grid container spacing={GRID_SPACING}>
                <GridItem>
                    <TextInput name={FieldConstants.REPLACING_LINE_1_ID} label="ReplacingLineId" />
                </GridItem>
                <GridItem>
                    <TextInput name={FieldConstants.REPLACING_LINE_1_NAME} label="ReplacingLineName" />
                </GridItem>
            </Grid>
        </>
    );
}
