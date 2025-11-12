/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Typography } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { ReactNode, useMemo } from 'react';
import { mergeSx, type SxStyle, type MuiStyles, type DensityType } from '../../utils/styles';

const DENSITY_CONFIG: Record<
    DensityType,
    { logo: { width: number; height: number }; text: { fontSize: number; marginLeft: number } }
> = {
    default: {
        logo: { width: 32, height: 32 },
        text: { fontSize: 25, marginLeft: 8 },
    },
    compact: {
        logo: { width: 25, height: 30 },
        text: { fontSize: 18, marginLeft: 3 },
    },
} as const;

const getStyles = (density: DensityType = 'default') => {
    const config = DENSITY_CONFIG[density];

    return {
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        logo: {
            flexShrink: 0,
            width: `${config.logo.width}px`,
            height: `${config.logo.height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: `${config.text.fontSize}px`,
            marginLeft: `${config.text.marginLeft}px`,
            display: { xs: 'none', lg: 'block' },
        },
        clickable: {
            cursor: 'pointer',
        },
    } as const satisfies MuiStyles;
};

export interface GridLogoProps extends Omit<LogoTextProps, 'style'> {
    appLogo: ReactNode;
    density?: DensityType;
}

export function LogoText({ appName, appColor, style, onClick, density = 'default' }: Partial<LogoTextProps>) {
    const styles = useMemo(() => getStyles(density), [density]);
    return (
        <Typography sx={mergeSx(style, onClick && styles.clickable)} onClick={onClick}>
            <span style={{ fontWeight: 'bold' }}>Grid</span>
            <span style={{ color: appColor }}>{appName}</span>
        </Typography>
    );
}

export function GridLogo({ appLogo, appName, appColor, onClick, density = 'default' }: Partial<GridLogoProps>) {
    const styles = useMemo(() => getStyles(density), [density]);
    return (
        <Box sx={mergeSx(styles.container, onClick && styles.clickable)} onClick={onClick}>
            <Box sx={styles.logo}>{appLogo || <BrokenImage />}</Box>
            <LogoText appName={appName} appColor={appColor} style={styles.title} density={density} />
        </Box>
    );
}

export interface LogoTextProps {
    appName: string;
    appColor: string;
    style: SxStyle;
    onClick: () => void;
    density?: DensityType;
}
