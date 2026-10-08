/*
 * Copyright (c) 2023-2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Box, Grid } from '@mui/material';
import { FieldConstants, Identifiable, Option } from '../../../utils';
import { VoltageLevelConnectivityForm } from '../common';
import { AutocompleteInput, GridItem, GridSection, TextInput } from '../../../components';

interface LinesAttachToSplitLinesFormProps {
    voltageLevelOptions: Identifiable[];
    fetchBusesOrBusbarSections: (voltageLevelId: string) => Promise<Identifiable[]>;
    lineOptions: Option[];
}

export function LinesAttachToSplittingLinesForm({
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    lineOptions,
}: Readonly<LinesAttachToSplitLinesFormProps>) {
    const availableLineOptions = lineOptions ?? [];
    const availableVoltageLevelOptions = voltageLevelOptions ?? [];

    const lineToAttachTo1Field = (
        <AutocompleteInput
            allowNewValue
            forcePopupIcon={availableLineOptions.length > 0}
            name={FieldConstants.LINE_TO_ATTACH_TO_1_ID}
            label="Line1"
            options={availableLineOptions}
            size="small"
        />
    );

    const lineToAttachTo2Field = (
        <AutocompleteInput
            allowNewValue
            forcePopupIcon={availableLineOptions.length > 0}
            name={FieldConstants.LINE_TO_ATTACH_TO_2_ID}
            label="Line2"
            options={availableLineOptions}
            size="small"
        />
    );

    const attachedLineField = (
        <AutocompleteInput
            allowNewValue
            forcePopupIcon={availableLineOptions.length > 0}
            name={FieldConstants.ATTACHED_LINE_ID}
            label="LineAttached"
            options={availableLineOptions}
            size="small"
        />
    );

    const connectivityForm = (
        <VoltageLevelConnectivityForm
            voltageLevelSelectLabel="AttachedVoltageLevelId"
            voltageLevelOptions={availableVoltageLevelOptions}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    const newLine1IdField = <TextInput name={FieldConstants.REPLACING_LINE_1_ID} label="Line1ID" />;

    const newLine1NameField = <TextInput name={FieldConstants.REPLACING_LINE_1_NAME} label="Line1Name" />;

    const newLine2IdField = <TextInput name={FieldConstants.REPLACING_LINE_2_ID} label="Line2ID" />;

    const newLine2NameField = <TextInput name={FieldConstants.REPLACING_LINE_2_NAME} label="Line2Name" />;

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
            <GridSection title="LineAttached" />
            <Grid
                container
                spacing={2}
                sx={{
                    alignItems: 'center',
                }}
            >
                <GridItem size={5}>{attachedLineField}</GridItem>
            </Grid>
            <GridSection title="lineAttachedToSplitLineVoltageLevel" />
            <Grid container spacing={2}>
                <GridItem size={12}>{connectivityForm}</GridItem>
            </Grid>
            <GridSection title="ReplacingLines" />
            <Grid container spacing={2}>
                <GridItem>{newLine1IdField}</GridItem>
                <GridItem>{newLine1NameField}</GridItem>
                <Box sx={{ width: '100%' }} />
                <GridItem>{newLine2IdField}</GridItem>
                <GridItem>{newLine2NameField}</GridItem>
            </Grid>
        </>
    );
}
