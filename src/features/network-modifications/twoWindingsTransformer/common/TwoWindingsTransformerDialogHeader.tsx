/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { filledTextField } from '../../common';
import { SwitchInput, TextInput } from '../../../../components/ui';
import { FieldConstants } from '../../../../utils';
import { GridItem } from '../../../../components';
import { TwoWindingsTransformerMapInfos } from './twoWindingsTransformer.types';

export interface TwoWindingsTransformerDialogHeaderProps {
    twtToModify?: TwoWindingsTransformerMapInfos | null;
    isModification?: boolean;
}

export function TwoWindingsTransformerDialogHeader({
    twtToModify,
    isModification = false,
}: Readonly<TwoWindingsTransformerDialogHeaderProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    const twtIdField = isModification ? (
        <TextField
            size="small"
            fullWidth
            label="ID"
            value={equipmentId}
            slotProps={{
                input: {
                    readOnly: true,
                },
            }}
            disabled
            {...filledTextField}
        />
    ) : (
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={filledTextField} />
    );

    const twtNameField = (
        <TextInput
            name={FieldConstants.EQUIPMENT_NAME}
            label="Name"
            formProps={filledTextField}
            previousValue={twtToModify?.name ?? undefined}
            clearable={isModification}
        />
    );

    const ratioTapChangerEnabledField = (
        <SwitchInput
            name={`${FieldConstants.RATIO_TAP_CHANGER}.${FieldConstants.ENABLED}`}
            label={isModification ? 'WithRatioTapChanger' : 'ConfigureRatioTapChanger'}
        />
    );

    const phaseTapChangerEnabledField = (
        <SwitchInput
            name={`${FieldConstants.PHASE_TAP_CHANGER}.${FieldConstants.ENABLED}`}
            label={isModification ? 'WithPhaseTapChanger' : 'ConfigurePhaseTapChanger'}
        />
    );

    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            <GridItem size={4}>{twtIdField}</GridItem>
            <GridItem size={4}>{twtNameField}</GridItem>
            <GridItem size={2}>{ratioTapChangerEnabledField}</GridItem>
            <GridItem size={2}>{phaseTapChangerEnabledField}</GridItem>
        </Grid>
    );
}
