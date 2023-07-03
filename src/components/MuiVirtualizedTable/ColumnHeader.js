/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';

import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const useStyles = makeStyles((theme) => ({
    label: {},
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
    filterTooLossy: {
        stroke: theme.palette.secondary.main,
    },
    transparent: {
        opacity: 0,
    },
    hovered: {
        opacity: 0.5,
    },
}));

// Shows an arrow pointing to smaller value when sorting is active.
// signedRank of 0 means no sorting, we only show the arrow on hovering of the header,
// in the same direction as it will get if clicked (once).
// signedRank > 0 means sorted by ascending value from lower indices to higher indices
// so lesser values are at top, so the upward arrow
const SortButton = (props) => {
    const classes = useStyles();
    const sortRank = Math.abs(props.signedRank);
    const visibilityClass =
        !props.signedRank &&
        (props.headerHovered ? classes.hovered : classes.transparent);
    return (
        <div className={clsx(classes.sortDiv)} onClick={props.onClick}>
            {props.signedRank >= 0 ? (
                <ArrowUpwardIcon className={clsx(visibilityClass)} />
            ) : (
                <ArrowDownwardIcon className={clsx(visibilityClass)} />
            )}
            {sortRank > 1 && !props.hovered && <sub>{sortRank}</sub>}
        </div>
    );
};

const FilterButton = (props) => {
    const classes = useStyles();
    const visibilityClass =
        !props.filterLevel &&
        (props.headerHovered ? classes.hovered : classes.transparent);
    return (
        <FilterAltOutlinedIcon
            onClick={props.onClick}
            className={clsx(
                classes.filterButton,
                props.filterLevel > 1 && classes.filterTooLossy,
                visibilityClass
            )}
        />
    );
};

export const ColumnHeader = React.forwardRef((props, ref) => {
    const {
        className,
        label,
        numeric,
        sortSignedRank,
        filterLevel,
        onSortClick,
        onFilterClick,
        onContextMenu,
        style,
    } = props;

    const classes = useStyles();

    const [hovered, setHovered] = React.useState();
    const onHover = React.useCallback((evt) => {
        setHovered(evt.type === 'mouseenter');
    }, []);

    const topmostDiv = useRef();

    const handleFilterClick = React.useMemo(() => {
        if (!onFilterClick) {
            return undefined;
        }
        return (evt) => {
            onFilterClick(evt, topmostDiv.current);
        };
    }, [onFilterClick]);

    return (
        <div
            ref={topmostDiv}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            className={clsx(
                classes.divFlex,
                numeric && classes.divNum,
                className
            )}
            style={style}
            onContextMenu={onContextMenu}
        >
            {/* we cheat here to get the _variable_ height */}
            <div ref={ref} className={clsx(classes.label)}>
                {label}
            </div>
            {onSortClick && (
                <SortButton
                    headerHovered={hovered}
                    onClick={onSortClick}
                    signedRank={sortSignedRank}
                />
            )}
            {handleFilterClick && (
                <FilterButton
                    headerHovered={hovered}
                    onClick={handleFilterClick}
                    filterLevel={filterLevel}
                />
            )}
        </div>
    );
});

export default ColumnHeader;
