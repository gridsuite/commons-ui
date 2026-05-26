/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ExpandCircleDown, ExpandMore, Settings as SettingsIcon } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { parametersStyles } from '../../parameters-style';

type ParameterGroupProps = PropsWithChildren & {
    label: string;
    state: boolean;
    onClick: (show: boolean) => void;
    disabled?: boolean;
    infoText?: string;
    unmountOnExit?: boolean;
};

export function ParameterGroup({
    label,
    state,
    onClick,
    disabled,
    infoText,
    unmountOnExit,
    children,
}: Readonly<ParameterGroupProps>) {
    const [mouseHover, setMouseHover] = useState(false);

    return (
        <Grid item xs={12} sx={parametersStyles.subgroupParameters}>
            <Accordion
                sx={parametersStyles.subgroupParametersAccordion}
                expanded={state}
                onChange={(event, showed) => onClick(showed)}
                disableGutters
                elevation={0}
                square
                slotProps={{
                    transition: {
                        unmountOnExit: unmountOnExit || false,
                    },
                }}
                disabled={disabled || undefined}
            >
                <AccordionSummary
                    sx={parametersStyles.subgroupParametersAccordionSummary}
                    expandIcon={mouseHover ? <ExpandCircleDown /> : <ExpandMore />}
                    onMouseEnter={() => setMouseHover(true)}
                    onMouseLeave={() => setMouseHover(false)}
                >
                    <SettingsIcon />
                    <Typography sx={{ width: '66%', flexShrink: 0 }}>
                        <FormattedMessage id={label} />
                    </Typography>
                    {infoText && (
                        <Typography sx={{ color: 'text.secondary', width: '34%' }} noWrap align="right" variant="body2">
                            {infoText}
                        </Typography>
                    )}
                </AccordionSummary>
                <AccordionDetails sx={parametersStyles.subgroupParametersAccordionDetails}>{children}</AccordionDetails>
            </Accordion>
        </Grid>
    );
}
