/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentProps, forwardRef, MouseEvent, ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import {
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    FilterAltOutlined as FilterAltOutlinedIcon,
} from '@mui/icons-material';

import { styled } from '@mui/system';
import { Box, BoxProps, Theme } from '@mui/material';
import { mergeSx } from '../../utils/styles';

const styles = {
    label: {
        fontWeight: 'bold',
        fontSize: '0.875rem', // to mimic TableCellRoot 'binding'
    },
    divFlex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    divNum: {
        flexDirection: 'row-reverse',
        textAlign: 'right',
    },
    sortDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    sortButton: {
        fill: 'currentcolor',
    },
    filterButton: {
        stroke: 'currentcolor',
    },
    filterTooLossy: (theme: Theme) => ({
        stroke: theme.palette.secondary.main,
    }),
    transparent: {
        opacity: 0,
    },
    hovered: {
        opacity: 0.5,
    },
};

interface SortButtonProps {
    signedRank?: number;
    headerHovered: boolean;
    hovered?: boolean;
    onClick: BoxProps['onClick'];
}

// Shows an arrow pointing to smaller value when sorting is active.
// signedRank of 0 means no sorting, we only show the arrow on hovering of the header,
// in the same direction as it will get if clicked (once).
// signedRank > 0 means sorted by ascending value from lower indices to higher indices
// so lesser values are at top, so the upward arrow
function SortButton({ signedRank = 0, ...props }: SortButtonProps) {
    const sortRank = Math.abs(signedRank);
    const visibilityStyle = (!signedRank || undefined) && (props.headerHovered ? styles.hovered : styles.transparent);
    return (
        <Box sx={styles.sortDiv} onClick={props.onClick}>
            {signedRank >= 0 ? <ArrowUpwardIcon sx={visibilityStyle} /> : <ArrowDownwardIcon sx={visibilityStyle} />}
            {sortRank > 1 && !props.hovered && <sub>{sortRank}</sub>}
        </Box>
    );
}

interface FilterButtonProps {
    filterLevel: number;
    headerHovered: boolean;
    onClick: ComponentProps<typeof FilterAltOutlinedIcon>['onClick'];
}

function FilterButton(props: FilterButtonProps) {
    const { filterLevel, headerHovered, onClick } = props;
    const visibilityStyle = !filterLevel && (headerHovered ? styles.hovered : styles.transparent);
    return (
        <FilterAltOutlinedIcon
            onClick={onClick}
            sx={mergeSx(
                styles.filterButton,
                // @ts-ignore type incompatibility of styles
                filterLevel > 1 && styles.filterTooLossy,
                visibilityStyle
            )}
        />
    );
}

export interface ColumnHeaderProps extends BoxProps {
    label: ReactNode;
    numeric: boolean;
    sortSignedRank: SortButtonProps['signedRank'];
    filterLevel: FilterButtonProps['filterLevel'];
    onSortClick: SortButtonProps['onClick'];
    onFilterClick: FilterButtonProps['onClick'];
}

export const ColumnHeaderComponent = forwardRef<typeof Box, ColumnHeaderProps>((props, ref) => {
    const { className, label, numeric, sortSignedRank, filterLevel, onSortClick, onFilterClick, onContextMenu, style } =
        props;

    const [hovered, setHovered] = useState<boolean>(false);
    const onHover = useCallback((evt: Event) => {
        setHovered(evt.type === 'mouseenter');
    }, []);

    const topmostDiv = useRef();

    const handleFilterClick = useMemo(() => {
        if (!onFilterClick) {
            return undefined;
        }
        return (evt: MouseEvent<SVGSVGElement>) => {
            onFilterClick(evt);
        };
    }, [onFilterClick]);

    return (
        // @ts-ignore it does not let us define Box with onMouseEnter/onMouseLeave attributes with 'div' I think, not sure though
        <Box
            ref={topmostDiv}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            sx={mergeSx(styles.divFlex, numeric ? styles.divNum : undefined)}
            className={className}
            style={style}
            onContextMenu={onContextMenu}
        >
            {/* we cheat here to get the _variable_ height */}
            <Box ref={ref} sx={styles.label}>
                {label}
            </Box>
            {onSortClick && <SortButton headerHovered={hovered} onClick={onSortClick} signedRank={sortSignedRank} />}
            {handleFilterClick && (
                <FilterButton headerHovered={hovered} onClick={handleFilterClick} filterLevel={filterLevel} />
            )}
        </Box>
    );
});

export const ColumnHeader = styled(ColumnHeaderComponent)({});
