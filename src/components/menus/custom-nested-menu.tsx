/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, useCallback, useRef, useState } from 'react';
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

    const [shouldLiftLeft, setShouldLiftLeft] = useState<boolean>(false);
    const containerRef = useRef<HTMLElement | null>(null);
    const calculateSubmenuPosition = useCallback(() => {
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            // for simplicity and keep all items have the same behavior,
            // take the width of the item as the estimated width of submenus
            const submenuWidth = containerRect.width;
            const availableSpaceToRight = window.innerWidth - containerRect.right;
            // should lift to left or not
            setShouldLiftLeft(submenuWidth > availableSpaceToRight);
        }
    }, []);

    return (
        <NestedMenuItem
            onMouseEnter={calculateSubmenuPosition}
            {...other}
            parentMenuOpen
            ContainerProps={{ ref: containerRef }}
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
