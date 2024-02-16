/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { DEFAULT_CELL_PADDING, KeyedColumnsRowIndexer } from '../../src';
import { styled, withStyles } from '@mui/material/styles';

import {
    Box,
    Button,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import MuiVirtualizedTable, {
    generateMuiVirtualizedTableClass,
} from '../../src/components/MuiVirtualizedTable';
import { CHANGE_WAYS } from '../../src/components/MuiVirtualizedTable/KeyedColumnsRowIndexer';

import { toNestedGlobalSelectors } from '../../src/utils/styles';

// For demo and fun.. all even numbers first, then all ascending odd numbers, only postive numbers..
const evenThenOddOrderingKey = (n) => {
    const remainder = Math.abs(n % 2);
    if (n <= 0 && remainder < 1) {
        // first negative even and zero ]...-3,-2,-1]
        return n / 2 - 1;
    } else if (n > 0 && remainder < 1) {
        // then positive even [-1/2, -1/3 ..., 0[
        return -1 / (n / 2 + 1);
    } else if (n < 0 && remainder >= 1) {
        // then negative odds ]0, 1/3, 1/2...
        return -1 / ((n - 1) / 2 - 1);
    } else {
        //positive odd [1,2,3,4...[
        return (n + 1) / 2;
    }
};

const styles = (theme) => ({
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight:
                theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.info.light,
        },
    },
    tableCell: {
        flex: 1,
        padding: DEFAULT_CELL_PADDING + 'px',
    },
    noClick: {
        cursor: 'initial',
    },
    tableCellColor: {
        color: theme.palette.primary.contrastText,
    },
    header: {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
    },
    rowBackgroundDark: {
        backgroundColor: theme.palette.info.dark,
    },
    rowBackgroundLight: {
        backgroundColor: theme.palette.info.main,
    },
});

const StyledVirtualizedTableJss = withStyles(styles)(MuiVirtualizedTable);

const stylesEmotion = ({ theme }) =>
    toNestedGlobalSelectors(styles(theme), generateMuiVirtualizedTableClass);
const StyledVirtualizedTableEmotion =
    styled(MuiVirtualizedTable)(stylesEmotion);

export const TableTab = ({ stylesProvider }) => {
    const [usesCustomStyles, setUsesCustomStyles] = useState(true);

    const StyledVirtualizedTable =
        stylesProvider === 'emotion'
            ? StyledVirtualizedTableEmotion
            : stylesProvider === 'jss'
            ? StyledVirtualizedTableJss
            : undefined;

    const VirtualizedTable = usesCustomStyles
        ? StyledVirtualizedTable
        : MuiVirtualizedTable;

    const columns = useMemo(
        () => [
            {
                label: 'header1',
                dataKey: 'key1',
            },
            {
                label: 'header2',
                dataKey: 'key2',
            },
            {
                label: 'header3 and some integers, and more, to be sure many lines are shown',
                dataKey: 'key3',
                numeric: true,
            },
            {
                label: 'floats',
                dataKey: 'key4',
                numeric: true,
                fractionDigits: 1,
            },
        ],
        []
    );

    const rows = useMemo(
        () => [
            { key1: 'group2', key2: 'val2', key3: 1, key4: 2.35 },
            { key1: 'group1', key2: 'val1', key3: 2, key4: 5.32 },
            { key1: 'group2', key2: 'val4', key3: 3, key4: 23.5 },
            { key1: 'group1', key2: 'val3', key3: 4, key4: 52.3 },
            { key1: 'group3', key2: 'val3', key3: 5, key4: 2.53 },
            { key1: 'group3', key2: 'val2', key3: 6, key4: 25.3 },
            { key1: 'group4', key2: 'val3', key3: 5, key4: 53.2 },
            { key1: 'group4', key2: 'val4', key3: 2, key4: 3.25 },
            { key1: 'group4', key2: 'val4', key3: 1, key4: 3.52 },
        ],
        []
    );

    function makeIndexer(prevIndexer) {
        const prevCol = prevIndexer?.highestCodedColumn(columns);
        let colKey = !prevCol ? 'key2' : 'key' + ((Math.abs(prevCol) % 4) + 1);
        const ret = new KeyedColumnsRowIndexer(true, false);
        ret.setColFilterOuterParams(colKey, ['val9']);

        const changeWay = CHANGE_WAYS.SIMPLE;
        // fake user click twice, to set descending order
        ret.updateSortingFromUser(colKey, changeWay);
        ret.updateSortingFromUser(colKey, changeWay);
        return ret;
    }

    const [indexer, setIndexer] = useState(() => makeIndexer());

    const [isIndexerExternal, setIndexerIsExternal] = useState(true);
    const [sortable, setSortable] = useState(true);
    const [recreates, setRecreates] = useState(false);

    const [defersFilterChanges, setDefersFilterChanges] = useState(false);

    const [headerHeight, setHeaderHeight] = useState('');

    const [filterValue, setFilterValue] = useState('');
    const [doesSort, setDoesSort] = useState(false);
    const filter = useCallback(
        (row) => {
            return row.key2 && row.key2.includes(filterValue);
        },
        [filterValue]
    );
    const sort = useCallback(
        (dataKey, reverse, isNumeric) => {
            let filtered = rows
                .map((r, i) => [r, i])
                .filter(([r]) => !filter || filter(r));
            if (dataKey) {
                filtered = filtered
                    .map(([r, j]) => [r[dataKey], j])
                    .map(([r, j]) => [
                        isNumeric ? r : Number(r.replace(/[^0-9.]/g, '')),
                        j,
                    ]); // for demo, extract any number from a string..
                filtered.sort(
                    ([a], [b]) =>
                        evenThenOddOrderingKey(b) - evenThenOddOrderingKey(a)
                );
                if (reverse) {
                    filtered = filtered.reverse();
                }
            }
            return filtered.map(([d, j]) => j);
        },
        [rows, filter]
    );

    const [key, setKey] = useState();

    function updateKeyIfNeeded() {
        if (recreates) {
            setKey(crypto.randomUUID());
        }
    }

    function mkSwitch(label, value, setter) {
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={value}
                        onChange={() => {
                            updateKeyIfNeeded();
                            setter((was) => !was);
                        }}
                    />
                }
                label={label}
            />
        );
    }

    function renderParams() {
        return (
            <Stack sx={{ margin: '1ex' }}>
                {mkSwitch(
                    'Custom theme (' + stylesProvider + ')',
                    usesCustomStyles,
                    setUsesCustomStyles
                )}
                {mkSwitch('Sortable', sortable, setSortable)}
                {mkSwitch('Instance renewal', recreates, setRecreates)}
                {mkSwitch(
                    'Uses external indexer',
                    isIndexerExternal,
                    setIndexerIsExternal
                )}
                <Button
                    disabled={!isIndexerExternal}
                    onClick={() => setIndexer(makeIndexer(indexer))}
                    variant={'contained'}
                >
                    New external indexer
                </Button>
                {mkSwitch(
                    'External sort (even then odds)',
                    doesSort,
                    setDoesSort
                )}
                <TextField
                    label="header2 filter"
                    size={'small'}
                    onChange={(event) => {
                        updateKeyIfNeeded();
                        setFilterValue(event.target.value);
                    }}
                />
                {mkSwitch(
                    'Defer filter changes',
                    defersFilterChanges,
                    setDefersFilterChanges
                )}
                <TextField
                    label="Header height"
                    size={'small'}
                    onChange={(event) => {
                        // still update the key to cause unmount/remount even if we don't get a new different number
                        // from the field to give more occasions to test unmount/remounts
                        updateKeyIfNeeded();
                        const newHeaderHeight = Number(event.target.value);
                        if (!isNaN(newHeaderHeight)) {
                            setHeaderHeight(event.target.value);
                        }
                    }}
                />
            </Stack>
        );
    }

    return (
        <Stack direction="row">
            {renderParams()}
            <Box style={{ width: '100%', height: 'auto' }}>
                <VirtualizedTable
                    key={recreates ? key : undefined}
                    name="Demo Virtualized Table"
                    rows={rows}
                    sortable={sortable}
                    defersFilterChanges={defersFilterChanges}
                    columns={columns}
                    enableExportCSV={true}
                    exportCSVDataKeys={['key2', 'key4']}
                    headerHeight={
                        !headerHeight ? undefined : Number(headerHeight)
                    }
                    onRowClick={(...args) => console.log('onRowClick', args)}
                    onClick={(...args) => console.log('onClick', args)}
                    onCellClick={(...args) => console.log('onCellClick', args)}
                    indexer={isIndexerExternal ? indexer : null}
                    {...(filterValue && { filter })}
                    {...(doesSort && { sort })}
                />
            </Box>
        </Stack>
    );
};
