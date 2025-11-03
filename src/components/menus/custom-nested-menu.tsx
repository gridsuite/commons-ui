/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
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
    const [menuPosition, setMenuPosition] = useState<'left' | 'right'>('right');
    const parentRef = useRef<HTMLLIElement | null>(null);
    const submenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (parentRef.current && submenuRef.current) {
            const parentRect = parentRef.current.getBoundingClientRect();
            const submenuWidth = submenuRef.current.offsetWidth;
            const windowWidth = window.innerWidth;

            if (parentRect.right + submenuWidth > windowWidth) {
                setMenuPosition('left');
            } else {
                setMenuPosition('right');
            }
        }
    }, [children]);

    const anchorOrigin: { vertical: 'top' | 'center' | 'bottom'; horizontal: 'left' | 'center' | 'right' } = {
        vertical: 'top',
        horizontal: menuPosition === 'right' ? 'right' : 'left',
    };

    const transformOrigin: { vertical: 'top' | 'center' | 'bottom'; horizontal: 'left' | 'center' | 'right' } = {
        vertical: 'top',
        horizontal: menuPosition === 'right' ? 'left' : 'right',
    };

    return (
        <NestedMenuItem
            {...other}
            parentMenuOpen
            MenuProps={{
                anchorOrigin,
                transformOrigin,
                PaperProps: { ref: submenuRef },
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
