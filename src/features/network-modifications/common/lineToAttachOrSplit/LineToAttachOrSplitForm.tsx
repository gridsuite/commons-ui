/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { AutocompleteInput } from '../../../../components/ui';
import { areIdsEqual, FieldConstants, getObjectId } from '../../../../utils';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { PercentageArea } from './PercentageArea';
import { LineToAttachOrSplitOption } from './lineToAttachOrSplit.types';

export interface LineToAttachOrSplitFormProps {
    label: string;
    lineOptions: LineToAttachOrSplitOption[];
}

export function LineToAttachOrSplitForm({ label, lineOptions = [] }: Readonly<LineToAttachOrSplitFormProps>) {
    const autocompleteOptions = useMemo(() => lineOptions.map((id) => ({ id, label: id })), [lineOptions]);

    const lineToAttachOrSplitField = (
        <AutocompleteInput
            isOptionEqualToValue={areIdsEqual}
            allowNewValue
            forcePopupIcon
            name={FieldConstants.LINE_TO_ATTACH_OR_SPLIT_ID}
            label={label}
            options={autocompleteOptions}
            getOptionLabel={getObjectId}
            outputTransform={(value: any) => getObjectId(value)}
            size="small"
            dataTestId="ExistingLineInput"
        />
    );
    const percentageArea = <PercentageArea upperLeftText="Line1" upperRightText="Line2" />;
    return (
        <Grid
            container
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <GridItem size={5}>{lineToAttachOrSplitField}</GridItem>
            <GridItem size={1} />
            <GridItem size={5}>{percentageArea}</GridItem>
            <GridItem size={1} />
        </Grid>
    );
}
