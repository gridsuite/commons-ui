/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo, useState } from 'react';
import { Box, Button, Grid, Stack, TextField, Tooltip } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { InfoOutlined } from '@mui/icons-material';
import { IntegerInput, useCustomFormContext } from '../../../../components/ui';
import { SwitchesBetweenSections } from '../creation';
import { FieldConstants } from '../../../../utils';
import { filledTextField, PositionDiagramPaneType } from '../../common';

export interface CreateVoltageLevelTopologyFormProps {
    voltageLevelId: string;
    PositionDiagramPane?: PositionDiagramPaneType;
}

export function CreateVoltageLevelTopologyForm({
    voltageLevelId,
    PositionDiagramPane,
}: Readonly<CreateVoltageLevelTopologyFormProps>) {
    const [isDiagramPaneOpen, setIsDiagramPaneOpen] = useState(false);
    const intl = useIntl();

    const { isNodeBuilt } = useCustomFormContext();

    const handleCloseDiagramPane = () => {
        setIsDiagramPaneOpen(false);
    };
    const handleClickOpenDiagramPane = () => {
        setIsDiagramPaneOpen(true);
    };

    const voltageLevelIdField = useMemo(
        () => (
            <TextField
                size="small"
                fullWidth
                label={intl.formatMessage({ id: 'VoltageLevelId' })}
                value={voltageLevelId ?? ''}
                slotProps={{
                    input: {
                        readOnly: true,
                    },
                }}
                disabled
                {...filledTextField}
            />
        ),
        [intl, voltageLevelId]
    );

    return (
        <>
            <Stack>
                <Grid>
                    <Stack spacing={2}>
                        <Grid>
                            <Grid container spacing={3} alignItems="center">
                                <Grid size={4}>{voltageLevelIdField}</Grid>
                                {PositionDiagramPane && isNodeBuilt && (
                                    <Grid>
                                        <Grid container spacing={1}>
                                            <Grid>
                                                <Button onClick={handleClickOpenDiagramPane} variant="outlined">
                                                    <FormattedMessage id="CreateCouplingDeviceDiagramButton" />
                                                </Button>
                                            </Grid>
                                            <Grid>
                                                <Tooltip
                                                    title={intl.formatMessage({ id: 'builtNodeTooltipForDiagram' })}
                                                >
                                                    <InfoOutlined color="info" fontSize="small" />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        <Grid>
                            <Grid container spacing={3}>
                                <Grid size={4}>
                                    <IntegerInput name={FieldConstants.SECTION_COUNT} label="SectionCount" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
                <Grid>
                    <SwitchesBetweenSections />
                </Grid>
            </Stack>
            {PositionDiagramPane && (
                <Box>
                    <PositionDiagramPane
                        open={isDiagramPaneOpen}
                        onClose={handleCloseDiagramPane}
                        voltageLevelId={voltageLevelId}
                    />
                </Box>
            )}
        </>
    );
}
