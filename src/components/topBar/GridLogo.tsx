/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Typography } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { ReactNode, useMemo } from 'react';
import { mergeSx, type SxStyle, type MuiStyles } from '../../utils/styles';

// Logo size constants
const LOGO_WIDTH = 32;
const LOGO_HEIGHT = 32;
const LOGO_WIDTH_DENSE = 26;
const LOGO_HEIGHT_DENSE = 26;

const getStyles = (dense: boolean = false) => {
    return {
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        logo: (_theme) => ({
            flexShrink: 0,
            width: dense ? LOGO_WIDTH_DENSE : LOGO_WIDTH,
            height: dense ? LOGO_HEIGHT_DENSE : LOGO_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }),
        title: (theme) => ({
            marginLeft: theme.spacing(dense ? 0.5 : 1),
            display: { xs: 'none', lg: 'block' },
            ...(dense && {
                fontSize: 18,
            }),
        }),
        clickable: {
            cursor: 'pointer',
        },
    } as const satisfies MuiStyles;
};

export interface GridLogoProps extends Omit<LogoTextProps, 'style'> {
    appLogo: ReactNode;
    dense?: boolean;
}

export function LogoText({ appName, appColor, style, onClick, dense = false }: Readonly<Partial<LogoTextProps>>) {
    const styles = useMemo(() => getStyles(dense), [dense]);
    return (
        <Typography sx={mergeSx(style, onClick && styles.clickable)} onClick={onClick}>
            <span style={{ fontWeight: 'bold' }}>Grid</span>
            <span style={{ color: appColor }}>{appName}</span>
        </Typography>
    );
}

export function GridLogo({ appLogo, appName, appColor, onClick, dense = false }: Readonly<Partial<GridLogoProps>>) {
    const styles = useMemo(() => getStyles(dense), [dense]);
    return (
        <Box sx={mergeSx(styles.container, onClick && styles.clickable)} onClick={onClick}>
            <Box sx={styles.logo}>{appLogo || <BrokenImage />}</Box>
            <LogoText appName={appName} appColor={appColor} style={styles.title} dense={dense} />
        </Box>
    );
}

export interface LogoTextProps {
    appName: string;
    appColor: string;
    style: SxStyle;
    onClick: () => void;
    dense?: boolean;
}
