/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { ExpandCircleDown, ExpandMore } from '@mui/icons-material';
import type { MuiStyles } from '../../../../utils/styles';

type AccordionIllustrationProps = {
    state: boolean;
    onClick: (show: boolean) => void;
};

const ILLUSTRATION_DARK_BG = '#272727ff';

const styles = {
    accordion: {
        background: 'none',
    },
    accordionIllustrationSummary: (theme) => ({
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'left',
        transition: '0.2s',
        padding: '0px 16px',
        backgroundColor: theme.palette.mode === 'light' ? 'none' : ILLUSTRATION_DARK_BG,
        '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(180deg)',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(0deg)',
        },
        '& .MuiAccordionSummary-content': {
            flexGrow: 0,
        },
    }),
    accordionIllustrationDetails: (theme) => ({
        padding: theme.spacing(0),
    }),
} as const satisfies MuiStyles;

export function AccordionIllustration({
    state,
    onClick,
    children,
}: Readonly<PropsWithChildren<AccordionIllustrationProps>>) {
    const [mouseHover, setMouseHover] = useState(false);

    return (
        <Accordion
            sx={styles.accordion}
            expanded={state}
            onChange={(event, showed) => onClick(showed)}
            disableGutters
            elevation={0}
            square
        >
            <AccordionSummary
                sx={styles.accordionIllustrationSummary}
                expandIcon={mouseHover ? <ExpandCircleDown /> : <ExpandMore />}
                onMouseEnter={() => setMouseHover(true)}
                onMouseLeave={() => setMouseHover(false)}
            >
                <Typography variant="subtitle1">
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 'fontWeightMedium',
                        }}
                    >
                        <FormattedMessage id="Information" />
                    </Box>
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.accordionIllustrationDetails}>{children}</AccordionDetails>
        </Accordion>
    );
}
