/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Box, Grid, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { LoadDialogTabs } from './LoadDialogTabs';
import { LoadFormInfos } from './load.types';
import { filledTextField } from '../../common';
import { SelectInput, TextInput } from '../../../inputs';
import GridItem from '../../../grid/grid-item';
import { FieldConstants, getLoadTypeLabel, LOAD_TYPES } from '../../../../utils';

interface LoadDialogHeaderProps {
    loadToModify?: LoadFormInfos | null;
    tabIndexesWithError: number[];
    tabIndex: number;
    setTabIndex: (index: number) => void;
    equipmentId?: string | null;
    isModification?: boolean;
}

export function LoadDialogHeader({
    loadToModify,
    tabIndexesWithError,
    tabIndex,
    setTabIndex,
    equipmentId,
    isModification = false,
}: Readonly<LoadDialogHeaderProps>) {
    const intl = useIntl();

    const loadIdField = isModification ? (
        <TextField
            size="small"
            fullWidth
            label="ID"
            value={equipmentId}
            InputProps={{
                readOnly: true,
            }}
            disabled
            {...filledTextField}
        />
    ) : (
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={{ autoFocus: true, ...filledTextField }} />
    );

    const loadNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={loadToModify?.name}
            clearable
        />
    );

    const loadTypeField = (
        <SelectInput
            name={FieldConstants.LOAD_TYPE}
            label="Type"
            options={Object.values(LOAD_TYPES)}
            fullWidth
            size="small"
            formProps={filledTextField}
            previousValue={
                loadToModify?.type && loadToModify.type !== 'UNDEFINED'
                    ? intl.formatMessage({
                          id: getLoadTypeLabel(loadToModify.type),
                      })
                    : undefined
            }
        />
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
            }}
        >
            <Grid container spacing={2}>
                <GridItem size={4}>{loadIdField}</GridItem>
                <GridItem size={4}>{loadNameField}</GridItem>
                <GridItem size={4}>{loadTypeField}</GridItem>
            </Grid>
            <LoadDialogTabs
                tabIndex={tabIndex}
                tabIndexesWithError={tabIndexesWithError}
                setTabIndex={setTabIndex}
                isModification={isModification}
            />
        </Box>
    );
}
