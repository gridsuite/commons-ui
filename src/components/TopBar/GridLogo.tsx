/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, SxProps, Typography } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { ReactNode } from 'react';
import { mergeSx } from '../../utils/styles';

const styles = {
    logo: {
        flexShrink: 0,
        width: 48,
        height: 48,
        marginBottom: '8px',
    },
    title: {
        marginLeft: '18px',
        display: { xs: 'none', lg: 'block' },
    },
    clickable: {
        cursor: 'pointer',
    },
};

export interface GridLogoProps extends Omit<LogoTextProps, 'style'> {
    appLogo: ReactNode;
}

export function LogoText({ appName, appColor, style, onClick }: Partial<LogoTextProps>) {
    return (
        <Typography variant="h4" sx={mergeSx(style, onClick && styles.clickable)} onClick={onClick}>
            <span style={{ fontWeight: 'bold' }}>Grid</span>
            <span style={{ color: appColor }}>{appName}</span>
        </Typography>
    );
}

function GridLogo({ appLogo, appName, appColor, onClick }: Partial<GridLogoProps>) {
    return (
        <>
            <Box sx={mergeSx(styles.logo, onClick && styles.clickable)} onClick={onClick}>
                {appLogo || <BrokenImage />}
            </Box>
            <LogoText appName={appName} appColor={appColor} onClick={onClick} style={styles.title} />
        </>
    );
}

export default GridLogo;

export interface LogoTextProps {
    appName: string;
    appColor: string;
    style: SxProps;
    onClick: () => void;
}
