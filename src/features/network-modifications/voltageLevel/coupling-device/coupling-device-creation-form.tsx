/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Box, Button, Grid, TextField, Tooltip } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { AutocompleteInput, GridItem, GridSection } from '../../../../components';
import { FieldConstants, getObjectId, Option } from '../../../../utils';
import { filledTextField, PositionDiagramPaneType } from '../../common';

export interface CouplingDeviceCreationFormProps {
    sectionOptions: Option[];
    canOpenPositionDiagramPane?: boolean;
    PositionDiagramPane?: PositionDiagramPaneType;
}

export function CouplingDeviceCreationForm({
    sectionOptions,
    canOpenPositionDiagramPane,
    PositionDiagramPane,
}: Readonly<CouplingDeviceCreationFormProps>) {
    const intl = useIntl();
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });
    const [isDiagramPaneOpen, setIsDiagramPaneOpen] = useState(false);
    const canOpenDiagram = Boolean(PositionDiagramPane && canOpenPositionDiagramPane);

    const voltageLevelIdField = (
        <TextField
            size="small"
            fullWidth
            label={intl.formatMessage({ id: 'VoltageLevelId' })}
            value={equipmentId ?? ''}
            slotProps={{
                input: { readOnly: true },
            }}
            disabled
            {...filledTextField}
        />
    );

    const busBarSectionId1Field = (
        <AutocompleteInput
            allowNewValue
            forcePopupIcon={!!sectionOptions}
            name={`${FieldConstants.BUS_BAR_SECTION_ID1}`}
            label="BusBarSectionID1"
            options={sectionOptions ?? []}
            getOptionLabel={getObjectId}
            size="small"
            sx={{ paddingTop: 2, paddingRight: 1 }}
        />
    );
    const busBarSectionId2Field = (
        <AutocompleteInput
            allowNewValue
            forcePopupIcon={!!sectionOptions}
            name={`${FieldConstants.BUS_BAR_SECTION_ID2}`}
            label="BusBarSectionID2"
            options={sectionOptions ?? []}
            getOptionLabel={getObjectId}
            size="small"
            sx={{ paddingTop: 2, paddingRight: 4 }}
        />
    );

    const diagramToolTip = canOpenDiagram ? (
        <Tooltip sx={{ paddingLeft: 1 }} title={intl.formatMessage({ id: 'builtNodeTooltipForDiagram' })}>
            <InfoOutlined color="info" fontSize="medium" />
        </Tooltip>
    ) : null;

    return (
        <>
            <Grid container spacing={2}>
                <GridItem size={4}>{voltageLevelIdField}</GridItem>

                {canOpenDiagram && (
                    <GridItem size={3}>
                        <Grid sx={{ paddingTop: 1 }}>
                            <Button onClick={() => setIsDiagramPaneOpen(true)} variant="outlined">
                                <FormattedMessage id="CreateCouplingDeviceDiagramButton" />
                            </Button>
                            {diagramToolTip}
                        </Grid>
                    </GridItem>
                )}
            </Grid>
            <GridSection
                title="CouplingDeviceText"
                tooltipEnabled
                tooltipMessage="CouplingDeviceBusBarSectionToolTipText"
            />
            <Grid container>
                <GridItem size={4}>{busBarSectionId1Field}</GridItem>
                <GridItem size={4}>{busBarSectionId2Field}</GridItem>
            </Grid>

            {PositionDiagramPane && (
                <Box>
                    <PositionDiagramPane
                        open={isDiagramPaneOpen}
                        onClose={() => setIsDiagramPaneOpen(false)}
                        voltageLevelId={equipmentId}
                    />
                </Box>
            )}
        </>
    );
}
