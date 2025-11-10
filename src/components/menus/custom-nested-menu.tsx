/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, useRef, useState } from 'react';
import { NestedMenuItem, NestedMenuItemProps } from 'mui-nested-menu';
import { Box, MenuItem, type MenuItemProps } from '@mui/material';
import { mergeSx, type MuiStyles, type SxStyle } from '../../utils/styles';

const styles = {
    highlightedParentLine: {
        backgroundColor: 'action.hover',
        color: 'primary.main',
        transition: 'all 300ms ease',
    },
    highlightedLine: {
        transition: 'all 300ms ease',
        '&:hover': {
            backgroundColor: 'action.hover',
            color: 'primary.main',
        },
    },
} as const satisfies MuiStyles;

interface CustomNestedMenuItemProps extends PropsWithChildren, Omit<NestedMenuItemProps, 'parentMenuOpen'> {
    sx?: SxStyle;
}

export function CustomNestedMenuItem({ sx, children, ...other }: Readonly<CustomNestedMenuItemProps>) {
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [shouldLiftLeft, setShouldLiftLeft] = useState(false);
    const containerRef = useRef<HTMLLIElement | null>(null);
    const calculatePosition = () => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const estimatedWidth = rect.width;
        const spaceRight = window.innerWidth - rect.right;
        setShouldLiftLeft(estimatedWidth > spaceRight);
    };

    const handleMouseEnter = () => {
        calculatePosition();
    };

    return (
        <NestedMenuItem
            {...other}
            parentMenuOpen
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            MenuProps={{
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: shouldLiftLeft ? 'left' : 'right',
                },
                transformOrigin: {
                    vertical: 'top',
                    horizontal: shouldLiftLeft ? 'right' : 'left',
                },
            }}
            sx={mergeSx(subMenuActive ? styles.highlightedParentLine : styles.highlightedLine, sx)}
        >
            <Box onMouseEnter={() => setSubMenuActive(true)} onMouseLeave={() => setSubMenuActive(false)}>
                {children}
            </Box>
        </NestedMenuItem>
    );
}

export function CustomMenuItem({ sx, ...other }: Readonly<MenuItemProps>) {
    return <MenuItem sx={mergeSx(styles.highlightedLine, sx)} {...other} />;
}
