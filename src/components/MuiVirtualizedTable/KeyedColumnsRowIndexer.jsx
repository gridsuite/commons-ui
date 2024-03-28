/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { equalsArray } from '../../utils/algos';

export const CHANGE_WAYS = {
    SIMPLE: 'Simple',
    TAIL: 'Tail',
    AMEND: 'Amend',
    REMOVE: 'Remove',
};

/* This is not real code commented
const someTypicalColumns = [
    { label: 'strings column', dataKey: 'key1' },
    {
        label: 'integers column',
        dataKey: 'key2',
        numeric: true,
        fractionDigits: 0,
    },
    {
        label: 'column to ignore',
        dataKey: 'key3',
        nostat: true,
    },
];
 */

export const noOpHelper = Object.freeze({
    debugName: 'noOp',
    maintainsStats: false,
    initStat: () => undefined,
    updateStat: (colStat, value) => {},
    accepts: (value, userParams, outerParams) => {
        return true;
    },
});

const numericHelper = Object.freeze({
    debugName: 'num',
    maintainsStats: true,
    initStat: () => {
        return { imin: null, imax: null };
    },
    updateStat: (colStat, value) => {
        if (colStat.imin === null || colStat.imin > value) {
            colStat.imin = value;
        }
        if (colStat.imax === null || colStat.imax < value) {
            colStat.imax = value;
        }
    },
    accepts: (value, userParams, outerParams) => {
        return true;
    },
});

export const collectibleHelper = Object.freeze({
    debugName: 'collectible',
    maintainsStats: true,
    initStat: () => {
        return { seen: {}, kept: {} };
    },
    updateStat: (colStat, cellValue, isForKeep) => {
        const m = isForKeep ? colStat.kept : colStat.seen;
        if (!m[cellValue]) {
            m[cellValue] = 1;
        } else {
            m[cellValue] += 1;
        }
    },
    accepts: (value, userParams, outerParams) => {
        return !userParams || userParams.some((v) => v === value);
    },
});

export const getHelper = (column) => {
    if (column?.numeric) {
        return numericHelper;
    } else if (!column?.nostat) {
        return collectibleHelper;
    } else {
        return noOpHelper;
    }
};

/**
 * A rows indexer for MuiVirtualizedTable to delegate to an instance of it
 * for filtering, grouping and multi-column sorting via
 * a view index to model index array.
 */
export class KeyedColumnsRowIndexer {
    static get CHANGE_WAYS() {
        return CHANGE_WAYS;
    }

    constructor(
        isThreeState = true,
        singleColumnByDefault = false,
        delegatorCallback = null,
        versionSetter = null
    ) {
        this._versionSetter = versionSetter;
        this.version = 0;
        this.filterVersion = 0;

        this.delegatorCallback = delegatorCallback;
        this.indirectionStatus = null;

        this.isThreeState = isThreeState;
        this.singleColumnByDefault = singleColumnByDefault;

        this.lastUsedRank = 1;
        this.sortingState = null;

        this.groupingCount = 0;
        this.byColFilter = null; // common
        this.byRowFilter = null;
    }

    hasVersionSetter = () => {
        return !!this._versionSetter;
    };

    getVersion = () => {
        return this.version;
    };

    _bumpVersion = (isFilter = false) => {
        this.version += 1;
        if (isFilter) {
            this.filterVersion = this.version;
        }
        if (this.delegatorCallback) {
            this.indirectionStatus = 'to sort';
            this.delegatorCallback(this, (updated_ok) => {
                this.indirectionStatus = updated_ok ? 'done' : 'no_luck';
            });
        }
        if (this._versionSetter) {
            this._versionSetter(this.version);
        }
    };

    updatePreferences = (preferences) => {
        if (
            preferences.isThreeState === this.isThreeState &&
            preferences.singleColumnByDefault === this.singleColumnByDefault
        ) {
            return false;
        }

        if (preferences.isThreeState !== this.isThreeState) {
            this.isThreeState = preferences.isThreeState;
        }
        if (preferences.singleColumnByDefault !== this.singleColumnByDefault) {
            this.singleColumnByDefault = preferences.singleColumnByDefault;
        }

        this._bumpVersion();
    };

    // Does not mutate any internal
    // returns
    // { rowAndOrigIndex : [[row, originalRowIndex],...],
    //   colsStats : {
    //     colKey1 : {
    //       seen : Map(value : count),
    //       kept : Map(value : count)
    //     },
    //     colKey2 : {
    //       imin : number,
    //       imax : number,
    //     }, colKeyN, ...
    //   }
    // }
    preFilterRowMapping = (columns, rows, rowFilter) => {
        if (!rows?.length || !columns?.length) {
            return null;
        }

        const ri = [];
        const cs = {};

        for (const col of columns) {
            const helper = getHelper(col);
            const colStat = helper.initStat();
            if (colStat) {
                cs[col.dataKey] = colStat;
            }
        }

        for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
            const row = rows[rowIdx];
            let acceptsRow = true;
            let acceptedOnRow = {};
            for (let colIdx = 0; colIdx < columns.length; colIdx++) {
                const col = columns[colIdx];
                const helper = getHelper(col);
                const colKey = col.dataKey;
                const cellValue = row[colKey];
                helper.updateStat(cs[colKey], cellValue, false);

                const colFilterParams = this.byColFilter?.[colKey];
                let acceptsCell = true;
                if (colFilterParams) {
                    const up = colFilterParams.userParams;
                    const op = colFilterParams.outerParams;

                    if (!helper.accepts(cellValue, up, op)) {
                        acceptsCell = false;
                    }
                }
                if (helper.maintainsStats && acceptsCell) {
                    acceptedOnRow[colIdx] = cellValue;
                }
                acceptsRow &= acceptsCell;
            }

            if (acceptsRow && rowFilter) {
                acceptsRow = rowFilter(row);
            }
            if (acceptsRow && this.byRowFilter) {
                acceptsRow = this.byRowFilter(row);
            }

            if (acceptsRow) {
                for (let [idx, value] of Object.entries(acceptedOnRow)) {
                    const col = columns[idx];
                    const helper = getHelper(col);
                    helper.updateStat(cs[col.dataKey], value, true);
                }
                ri.push([row, rowIdx]);
            }
        }

        return { rowAndOrigIndex: ri, colsStats: cs, rowsCount: rows.length };
    };

    // Does not mutate any internal
    // returns an array of indexes in rows given to preFilter
    makeGroupAndSortIndirector = (preFilteredRowPairs, columns) => {
        if (!preFilteredRowPairs) {
            return null;
        }

        const codedColumns = !this.sortingState
            ? null
            : codedColumnsFromKeyAndDirection(this.sortingState, columns);
        const groupingColumnsCount = this.groupingCount;
        let indexedArray = groupAndSort(
            preFilteredRowPairs,
            codedColumns,
            groupingColumnsCount,
            columns
        );

        return !indexedArray ? null : indexedArray.map((k) => k[1]);
    };

    getSortingAsKeyAndCodedRank = () => {
        if (!this.sortingState) {
            return [];
        }

        return this.sortingState.map((kd, i) => {
            const sign = giveDirSignFor(kd[1]);
            const codedRank = sign * (i + 1);
            return [kd[0], codedRank];
        });
    };

    // returns true if really changed (and calls versionSetter if needed)
    updateSortingFromUser = (colKey, change_way) => {
        const keyAndDirections = this.sortingState;

        if (change_way === CHANGE_WAYS.REMOVE) {
            if (!keyAndDirections) {
                return false;
            }

            const would = keyAndDirections.filter((p) => p[0] !== colKey);
            if (would.length === keyAndDirections.length) {
                return false;
            }

            this.sortingState = would.length ? would : null;
        } else if (!keyAndDirections) {
            this.sortingState = [[colKey, canonicalForSign(1)]];
            this.lastUsedRank = 1;
        } else {
            let wasAtIdx = keyAndDirections.findIndex((p) => p[0] === colKey);
            const wasFuzzyDir =
                wasAtIdx < 0 ? 0 : keyAndDirections[wasAtIdx][1];
            const wasSignDir = giveDirSignFor(wasFuzzyDir);

            if (change_way === CHANGE_WAYS.SIMPLE) {
                if (wasSignDir < 0 && this.isThreeState) {
                    if (this.sortingState.length === 1) {
                        this.sortingState = null;
                    } else {
                        this.sortingState.splice(wasAtIdx, 1);
                    }
                } else {
                    if (this.singleColumnByDefault || wasAtIdx < 0) {
                        this.sortingState = [];
                    } else {
                        this.sortingState.splice(wasAtIdx, 1);
                    }
                    const nextSign = wasSignDir ? -wasSignDir : 1;
                    const nextKD = [colKey, canonicalForSign(nextSign)];
                    this.sortingState.unshift(nextKD);
                }
            } else if (change_way === CHANGE_WAYS.TAIL) {
                if (wasAtIdx < 0) {
                    this.sortingState.push([colKey, canonicalForSign(1)]);
                } else if (wasAtIdx !== keyAndDirections.length - 1) {
                    return false;
                } else if (!(this.isThreeState && wasSignDir === -1)) {
                    this.sortingState[wasAtIdx][1] =
                        canonicalForSign(-wasSignDir);
                } else {
                    this.sortingState.splice(wasAtIdx, 1);
                }
            } else {
                // AMEND
                if (wasAtIdx < 0) {
                    if (this.lastUsedRank - 1 > this.sortingState.length) {
                        return false;
                    } else {
                        this.sortingState.splice(this.lastUsedRank - 1, 0, [
                            colKey,
                            canonicalForSign(1),
                        ]);
                    }
                } else if (!(this.isThreeState && wasSignDir === -1)) {
                    this.sortingState[wasAtIdx][1] =
                        canonicalForSign(-wasSignDir);
                } else {
                    this.lastUsedRank = wasAtIdx + 1;
                    this.sortingState.splice(wasAtIdx, 1);
                }
            }
        }
        this._bumpVersion();
        return true;
    };

    codedRankByColumnIndex = (columns) => {
        return codedColumnsFromKeyAndDirection(this.sortingState, columns);
    };

    columnSortingSignedRank = (colKey) => {
        if (!this?.sortingState?.length) {
            return 0;
        }
        const idx = this.sortingState.findIndex((kd) => kd[0] === colKey);
        if (idx < 0) {
            return 0;
        }
        const colSorting = this.sortingState[idx];
        return giveDirSignFor(colSorting[1]) * (idx + 1);
    };

    highestCodedColumn = (columns) => {
        if (!this?.sortingState?.length) {
            return 0;
        }
        const colSorting = this.sortingState[0];
        const colKey = colSorting[0];
        const idx = columns.findIndex((col) => col.dataKey === colKey);
        if (idx < 0) {
            return 0;
        }
        return giveDirSignFor(colSorting[1]) * (idx + 1);
    };

    _getColFilterParams = (colKey, isForUser) => {
        if (!colKey || !this.byColFilter) {
            return undefined;
        }
        const colFilter = this.byColFilter[colKey];
        if (!colFilter) {
            return undefined;
        }

        return colFilter[isForUser ? 'userParams' : 'outerParams'];
    };

    _setColFilterParams = (colKey, params, isForUser) => {
        if (!colKey) {
            if (params) {
                throw new Error('column key has to be defined');
            }
            return false;
        }

        const fieldName = isForUser ? 'userParams' : 'outerParams';

        if (params) {
            if (!this.byColFilter) {
                this.byColFilter = {};
            }
            let colFilter = this.byColFilter[colKey];
            if (!colFilter) {
                colFilter = {};
                this.byColFilter[colKey] = colFilter;
            } else if (colFilter[fieldName] === params) {
                return false;
            }

            colFilter[fieldName] = params;
        } else {
            if (!this.byColFilter) {
                return false;
            }

            const otherFieldName = !isForUser ? 'userParams' : 'outerParams';
            if (this.byColFilter[colKey]?.[otherFieldName]) {
                delete this.byColFilter[colKey][fieldName];
            } else {
                delete this.byColFilter[colKey];
            }
        }
        if (isForUser) {
            this._bumpVersion(true);
        }
        return true;
    };

    getColFilterOuterParams = (colKey) => {
        return this._getColFilterParams(colKey, false);
    };

    setColFilterOuterParams = (colKey, outerParams) => {
        return this._setColFilterParams(colKey, outerParams, false);
    };

    getColFilterUserParams = (colKey) => {
        return this._getColFilterParams(colKey, true);
    };

    setColFilterUserParams = (colKey, params) => {
        return this._setColFilterParams(colKey, params, true);
    };

    getUserFiltering = () => {
        const ret = {};
        if (this.byColFilter) {
            Object.entries(this.byColFilter).forEach(([k, v]) => {
                if (!v.userParams) {
                    return;
                }
                ret[k] = [...v.userParams];
            });
        }
        return ret;
    };

    updateRowFiltering = (rowFilterFunc) => {
        if (typeof rowFilterFunc !== 'function') {
            throw new Error('row filter should be a function');
        }
        this.byRowFilter = rowFilterFunc;
        this._bumpVersion();
    };
}

const giveDirSignFor = (fuzzySign) => {
    if (fuzzySign < 0) {
        return -1;
    }
    if (fuzzySign > 0) {
        return 1;
    }
    if (fuzzySign === 'asc') {
        return 1;
    }
    if (fuzzySign === 'desc') {
        return -1;
    }
    return 0;
};

const canonicalForSign = (dirSign) => {
    if (dirSign > 0) {
        return 'asc';
    }
    if (dirSign < 0) {
        return 'desc';
    }
    return undefined;
};

const codedColumnsFromKeyAndDirection = (keyAndDirections, columns) => {
    if (!keyAndDirections) {
        return null;
    }

    const ret = [];
    const columIndexByKey = {};
    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const col = columns[colIdx];
        const colKey = col.dataKey;
        columIndexByKey[colKey] = colIdx;
    }

    for (const knd of keyAndDirections) {
        const colKey = knd[0];
        const dir = knd[1];

        const colIdx = columIndexByKey[colKey];
        if (colIdx === undefined) {
            continue;
        }

        const sign = giveDirSignFor(dir);
        ret.push((colIdx + 1) * sign);
    }
    return ret;
};

const compareValue = (a, b, isNumeric, undefSign = -1) => {
    if (a === undefined && b === undefined) {
        return 0;
    } else {
        if (a === undefined) {
            return undefSign;
        } else {
            if (b === undefined) {
                return -undefSign;
            }
        }
    }
    if (!isNumeric) {
        return ('' + a).localeCompare(b);
    } else {
        if (isNaN(a)) {
            return isNaN(b) ? 0 : 1;
        }
        if (isNaN(b)) {
            return -1;
        }
        return Math.sign(Number(a) - Number(b));
    }
};

const makeCompositeComparatorFromCodedColumns = (
    codedColumns,
    columns,
    rowExtractor
) => {
    return (row_a_i, row_b_i) => {
        const row_a = rowExtractor(row_a_i);
        const row_b = rowExtractor(row_b_i);
        for (const cc of codedColumns) {
            const i = Math.abs(cc) - 1;
            const mul = Math.sign(cc);
            const col = columns[i];
            const key = col.dataKey;
            const sgn = compareValue(row_a[key], row_b[key], col.numeric);
            if (sgn) {
                return mul * sgn;
            }
        }
        return 0;
    };
};

const groupRows = (groupingColumnsCount, columns, indexedArray) => {
    const groupingComparator = makeCompositeComparatorFromCodedColumns(
        Array(groupingColumnsCount).map((x, i) => i + 1),
        columns,
        (ar) => ar[0]
    );
    indexedArray.sort(groupingComparator);

    const groups = [];
    let prevSlice = null;
    let inBuildGroup = [];
    groups.push(inBuildGroup);
    for (const p of indexedArray) {
        const nextSlice = p[0].slice(0, groupingColumnsCount);
        if (prevSlice === null || !equalsArray(prevSlice, nextSlice)) {
            inBuildGroup = [];
            groups.push(inBuildGroup);
        }
        inBuildGroup.push(p);
        prevSlice = nextSlice;
    }
    return groups;
};

const groupAndSort = (
    preFilteredRowPairs,
    codedColumns,
    groupingColumnsCount,
    columns
) => {
    const nothingToDo = !codedColumns && !groupingColumnsCount;

    let indexedArray = preFilteredRowPairs.rowAndOrigIndex;
    const noOutFiltered = preFilteredRowPairs.rowsCount === indexedArray.length;
    if (nothingToDo && noOutFiltered) {
        return null;
    } else if (!nothingToDo) {
        // make a copy for not losing base order
        indexedArray = [...indexedArray];
    }

    if (nothingToDo) {
        // just nothing
    } else if (!groupingColumnsCount) {
        const sortingComparator = makeCompositeComparatorFromCodedColumns(
            codedColumns,
            columns,
            (ar) => ar[0]
        );
        indexedArray.sort(sortingComparator);
    } else {
        const groups = groupRows(groupingColumnsCount, columns, indexedArray);

        const interGroupSortingComparator =
            makeCompositeComparatorFromCodedColumns(
                codedColumns,
                columns,
                (ar) => ar[0][0]
            );
        groups.sort(interGroupSortingComparator);

        const intraGroupSortingComparator =
            makeCompositeComparatorFromCodedColumns(
                codedColumns,
                columns,
                (ar) => ar[0]
            );

        indexedArray = [];
        for (const group of groups) {
            group.sort(intraGroupSortingComparator);
            indexedArray.push(...group);
        }
    }
    return indexedArray;
};

export const forTesting = {
    codedColumnsFromKeyAndDirection,
    makeCompositeComparatorFromCodedColumns,
};
