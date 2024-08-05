/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable @typescript-eslint/no-unused-vars, no-param-reassign */
import { ReactElement } from 'react';
import { ColumnProps } from 'react-virtualized';
import equalsArray from '../../utils/algos';

export interface RowProps {
    notClickable?: boolean;
}

export interface CustomColumnProps extends ColumnProps {
    sortable?: boolean;
    numeric?: boolean;
    indexer?: KeyedColumnsRowIndexer;
    label: string;
    clickable?: boolean;
    fractionDigits?: number;
    unit?: number;
    extra?: ReactElement;
    nostat?: boolean;
}

export enum ChangeWays {
    SIMPLE = 'Simple',
    TAIL = 'Tail',
    AMEND = 'Amend',
    REMOVE = 'Remove',
}

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

export interface ColStat {
    imin?: number | null;
    imax?: number | null;
    seen?: any;
    kept?: any;
}

export const noOpHelper = Object.freeze({
    debugName: 'noOp',
    maintainsStats: false,
    initStat: () => undefined,
    updateStat: (colStat: ColStat, value: number) => {},
    accepts: (value: any, userParams: any[] | undefined, outerParams: any[] | undefined) => {
        return true;
    },
});

const numericHelper = Object.freeze({
    debugName: 'num',
    maintainsStats: true,
    initStat: () => {
        return { imin: null, imax: null };
    },
    updateStat: (colStat: ColStat, value: number) => {
        if (colStat.imin === undefined || colStat.imin === null || colStat.imin > value) {
            colStat.imin = value;
        }
        if (colStat.imax === undefined || colStat.imax === null || colStat.imax < value) {
            colStat.imax = value;
        }
    },
    accepts: (value: number, userParams: any[] | undefined, outerParams: any[] | undefined) => {
        return true;
    },
});

export const collectibleHelper = Object.freeze({
    debugName: 'collectible',
    maintainsStats: true,
    initStat: () => {
        return { seen: {}, kept: {} };
    },
    updateStat: (colStat: ColStat, cellValue: number, isForKeep: boolean) => {
        const m = isForKeep ? colStat.kept : colStat.seen;
        if (!m[cellValue]) {
            m[cellValue] = 1;
        } else {
            m[cellValue] += 1;
        }
    },
    accepts: (value: number, userParams: any[] | undefined, outerParams: any[] | undefined) => {
        return !userParams || userParams.some((v) => v === value);
    },
});

export const getHelper = (column?: CustomColumnProps) => {
    if (column?.numeric) {
        return numericHelper;
    }
    if (!column?.nostat) {
        return collectibleHelper;
    }
    return noOpHelper;
};

export interface Preferences {
    isThreeState: boolean;
    singleColumnByDefault: boolean;
}

export interface FilteredRows {
    rowAndOrigIndex: [RowProps, number][];
    colsStats: Record<string, ColStat>;
    rowsCount: number;
}

const giveDirSignFor = (fuzzySign: number | string | undefined) => {
    // @ts-ignore we should check whether it is a string or a number first
    if (fuzzySign < 0) {
        return -1;
    }
    // @ts-ignore we should check whether it is a string or a number first
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

const codedColumnsFromKeyAndDirection = (
    keyAndDirections: [string, string | undefined][] | null,
    columns: CustomColumnProps[]
) => {
    if (!keyAndDirections) {
        return null;
    }

    let ret = [];
    const columIndexByKey: Record<string, number> = {};
    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const col = columns[colIdx];
        const colKey = col.dataKey;
        columIndexByKey[colKey] = colIdx;
    }

    ret = keyAndDirections.map((knd) => {
        const colKey = knd[0];
        const dir = knd[1];

        const colIdx = columIndexByKey[colKey];
        if (colIdx === undefined) {
            return 0;
        }

        const sign = giveDirSignFor(dir);
        return (colIdx + 1) * sign;
    });
    return ret;
};

const compareValue = (
    a: number | string | undefined,
    b: number | string | undefined,
    isNumeric: boolean,
    undefSign: number = -1
) => {
    if (a === undefined && b === undefined) {
        return 0;
    }
    if (a === undefined) {
        return undefSign;
    }
    if (b === undefined) {
        return -undefSign;
    }

    if (!isNumeric) {
        return `${a}`.localeCompare(b as string);
    }
    if (Number.isNaN(a as number)) {
        return Number.isNaN(b as number) ? 0 : 1;
    }
    if (Number.isNaN(b as number)) {
        return -1;
    }
    return Math.sign(Number(a) - Number(b));
};

const makeCompositeComparatorFromCodedColumns = (
    codedColumns: number[] | null,
    columns: CustomColumnProps[],
    rowExtractor: (
        row: [Record<string, number | string | undefined>, number][]
    ) => Record<string, number | string | undefined>
) => {
    return (
        row_a_i: [Record<string, number | string | undefined>, number][],
        row_b_i: [Record<string, number | string | undefined>, number][]
    ) => {
        const rowA = rowExtractor(row_a_i);
        const rowB = rowExtractor(row_b_i);
        // @ts-ignore codedColumns could be null we should add a check
        codedColumns.map((cc) => {
            const i = Math.abs(cc) - 1;
            const mul = Math.sign(cc);
            const col = columns[i];
            const key = col.dataKey;
            // @ts-ignore numeric could be undefined, how to handle this case ?
            const sgn = compareValue(rowA[key], rowB[key], col.numeric);
            if (sgn) {
                return mul * sgn;
            }
            return undefined;
        });
        return 0;
    };
};

const canonicalForSign = (dirSign: number): string | undefined => {
    if (dirSign > 0) {
        return 'asc';
    }
    if (dirSign < 0) {
        return 'desc';
    }
    return undefined;
};

const groupRows = (
    groupingColumnsCount: number,
    columns: CustomColumnProps[],
    indexedArray: [Record<string, number | string | undefined>, number][]
) => {
    const groupingComparator = makeCompositeComparatorFromCodedColumns(
        Array(groupingColumnsCount).map((x, i) => i + 1),
        columns,
        // @ts-ignore does not match other pattern
        (ar) => ar[0]
    );
    // @ts-ignore does not match other pattern
    indexedArray.sort(groupingComparator);

    const groups: any = [];
    let prevSlice: any[] | null = null;
    let inBuildGroup: any = [];
    groups.push(inBuildGroup);
    indexedArray.forEach((p) => {
        // @ts-ignore could be undefined how to handle this case ?
        const nextSlice = p[0].slice(0, groupingColumnsCount);
        if (prevSlice === null || !equalsArray(prevSlice, nextSlice)) {
            inBuildGroup = [];
            groups.push(inBuildGroup);
        }
        inBuildGroup.push(p);
        prevSlice = nextSlice;
    });
    return groups;
};

const groupAndSort = (
    preFilteredRowPairs: FilteredRows,
    codedColumns: number[] | null,
    groupingColumnsCount: number,
    columns: CustomColumnProps[]
) => {
    const nothingToDo = !codedColumns && !groupingColumnsCount;

    let indexedArray = preFilteredRowPairs.rowAndOrigIndex;
    const noOutFiltered = preFilteredRowPairs.rowsCount === indexedArray.length;
    if (nothingToDo && noOutFiltered) {
        return null;
    }
    if (!nothingToDo) {
        // make a copy for not losing base order
        indexedArray = [...indexedArray];
    }

    if (nothingToDo) {
        // just nothing
    } else if (!groupingColumnsCount) {
        const sortingComparator = makeCompositeComparatorFromCodedColumns(
            codedColumns,
            columns,
            // @ts-ignore I don't know how to fix this one
            (ar) => ar[0]
        );
        // @ts-ignore I don't know how to fix this one
        indexedArray.sort(sortingComparator);
    } else {
        // @ts-ignore I don't know how to fix this one
        const groups = groupRows(groupingColumnsCount, columns, indexedArray);

        const interGroupSortingComparator = makeCompositeComparatorFromCodedColumns(
            codedColumns,
            columns,
            (ar) => ar[0][0]
        );
        groups.sort(interGroupSortingComparator);

        const intraGroupSortingComparator = makeCompositeComparatorFromCodedColumns(
            codedColumns,
            columns,
            // @ts-ignore I don't know how to fix this one
            (ar) => ar[0]
        );

        indexedArray = [];
        groups.forEach((group: any) => {
            group.sort(intraGroupSortingComparator);
            indexedArray.push(...group);
        });
    }
    return indexedArray;
};

/**
 * A rows indexer for MuiVirtualizedTable to delegate to an instance of it
 * for filtering, grouping and multi-column sorting via
 * a view index to model index array.
 */
export class KeyedColumnsRowIndexer {
    static get CHANGE_WAYS() {
        return ChangeWays;
    }

    versionSetter: ((version: number) => void) | null;

    byColFilter: Record<string, { userParams?: any[]; outerParams?: any[] }> | null;

    byRowFilter: ((row: RowProps) => boolean) | null;

    delegatorCallback: ((instance: KeyedColumnsRowIndexer, callback: (input: any) => void) => void) | null;

    filterVersion: number;

    groupingCount: number;

    indirectionStatus: string | null;

    isThreeState: boolean;

    lastUsedRank: number;

    singleColumnByDefault: boolean;

    sortingState: [string, string | undefined][] | null;

    version: number;

    constructor(
        isThreeState = true,
        singleColumnByDefault = false,
        delegatorCallback = null,
        versionSetter: ((version: number) => void) | null = null
    ) {
        this.versionSetter = versionSetter;
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
        return !!this.versionSetter;
    };

    getVersion = () => {
        return this.version;
    };

    bumpVersion = (isFilter = false) => {
        this.version += 1;
        if (isFilter) {
            this.filterVersion = this.version;
        }
        if (this.delegatorCallback) {
            this.indirectionStatus = 'to sort';
            this.delegatorCallback(this, (updated_ok: boolean) => {
                this.indirectionStatus = updated_ok ? 'done' : 'no_luck';
            });
        }
        if (this.versionSetter) {
            this.versionSetter(this.version);
        }
    };

    updatePreferences = (preferences: Preferences) => {
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

        this.bumpVersion();
        return true;
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
    preFilterRowMapping = (
        columns: CustomColumnProps[],
        rows: RowProps[],
        rowFilter: (row: RowProps) => boolean
    ): FilteredRows | null => {
        if (!rows?.length || !columns?.length) {
            return null;
        }

        const ri: [RowProps, number][] = [];
        const cs: Record<string, ColStat> = {};

        columns.forEach((col) => {
            const helper = getHelper(col);
            const colStat = helper.initStat();
            if (colStat) {
                cs[col.dataKey] = colStat;
            }
        });

        for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
            const row = rows[rowIdx];
            let acceptsRow = true;
            const acceptedOnRow: Record<number, any> = {};
            for (let colIdx = 0; colIdx < columns.length; colIdx++) {
                const col = columns[colIdx];
                const helper = getHelper(col);
                const colKey = col.dataKey;
                // @ts-ignore should not access to value directly
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
                acceptsRow &&= acceptsCell;
            }

            if (acceptsRow && rowFilter) {
                acceptsRow = rowFilter(row);
            }
            if (acceptsRow && this.byRowFilter) {
                acceptsRow = this.byRowFilter(row);
            }

            if (acceptsRow) {
                Object.entries(acceptedOnRow).forEach(([idx, value]) => {
                    const col = columns[Number(idx)];
                    const helper = getHelper(col);
                    helper.updateStat(cs[col.dataKey], value, true);
                });
                ri.push([row, rowIdx]);
            }
        }

        return { rowAndOrigIndex: ri, colsStats: cs, rowsCount: rows.length };
    };

    // Does not mutate any internal
    // returns an array of indexes in rows given to preFilter
    makeGroupAndSortIndirector = (preFilteredRowPairs: FilteredRows | null, columns: CustomColumnProps[]) => {
        if (!preFilteredRowPairs) {
            return null;
        }

        const codedColumns = !this.sortingState ? null : codedColumnsFromKeyAndDirection(this.sortingState, columns);
        const groupingColumnsCount = this.groupingCount;
        const indexedArray = groupAndSort(preFilteredRowPairs, codedColumns, groupingColumnsCount, columns);

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
    updateSortingFromUser = (colKey: string, change_way: ChangeWays) => {
        const keyAndDirections = this.sortingState;

        if (change_way === ChangeWays.REMOVE) {
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
            const wasAtIdx = keyAndDirections.findIndex((p) => p[0] === colKey);
            const wasFuzzyDir = wasAtIdx < 0 ? 0 : keyAndDirections[wasAtIdx][1];
            const wasSignDir = giveDirSignFor(wasFuzzyDir);

            if (change_way === ChangeWays.SIMPLE) {
                if (wasSignDir < 0 && this.isThreeState) {
                    if (this.sortingState?.length === 1) {
                        this.sortingState = null;
                    } else {
                        this.sortingState?.splice(wasAtIdx, 1);
                    }
                } else {
                    if (this.singleColumnByDefault || wasAtIdx < 0) {
                        this.sortingState = [];
                    } else {
                        this.sortingState?.splice(wasAtIdx, 1);
                    }
                    const nextSign = wasSignDir ? -wasSignDir : 1;
                    const nextKD: [string, string | undefined] = [colKey, canonicalForSign(nextSign)];
                    this.sortingState?.unshift(nextKD);
                }
            } else if (change_way === ChangeWays.TAIL) {
                if (wasAtIdx < 0) {
                    this.sortingState?.push([colKey, canonicalForSign(1)]);
                } else if (wasAtIdx !== keyAndDirections.length - 1) {
                    return false;
                } else if (!(this.isThreeState && wasSignDir === -1)) {
                    // @ts-ignore could be null but hard to handle with such accesses
                    this.sortingState[wasAtIdx][1] = canonicalForSign(-wasSignDir);
                } else {
                    this.sortingState?.splice(wasAtIdx, 1);
                }
            } else if (wasAtIdx < 0) {
                if (
                    this.lastUsedRank - 1 >
                    // @ts-ignore could be undefined, how to handle this case ?
                    this.sortingState.length
                ) {
                    return false;
                }
                this.sortingState?.splice(this.lastUsedRank - 1, 0, [colKey, canonicalForSign(1)]);
            } else if (!(this.isThreeState && wasSignDir === -1)) {
                // @ts-ignore could be null but hard to handle with such accesses
                this.sortingState[wasAtIdx][1] = canonicalForSign(-wasSignDir);
            } else {
                this.lastUsedRank = wasAtIdx + 1;
                this.sortingState?.splice(wasAtIdx, 1);
            }
        }
        this.bumpVersion();
        return true;
    };

    codedRankByColumnIndex = (columns: CustomColumnProps[]) => {
        return codedColumnsFromKeyAndDirection(this.sortingState, columns);
    };

    columnSortingSignedRank = (colKey: string) => {
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

    highestCodedColumn = (columns: CustomColumnProps[]) => {
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

    getColFilterParams = (colKey: string | null, isForUser: boolean) => {
        if (!colKey || !this.byColFilter) {
            return undefined;
        }
        const colFilter = this.byColFilter[colKey];
        if (!colFilter) {
            return undefined;
        }

        return colFilter[isForUser ? 'userParams' : 'outerParams'];
    };

    setColFilterParams = (colKey: string | null, params: any[] | null, isForUser: boolean) => {
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
            let colFilter: { userParams?: any[]; outerParams?: any[] } = this.byColFilter[colKey];
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
            this.bumpVersion(true);
        }
        return true;
    };

    getColFilterOuterParams = (colKey: string | null) => {
        return this.getColFilterParams(colKey, false);
    };

    setColFilterOuterParams = (colKey: string, outerParams: any[]) => {
        return this.setColFilterParams(colKey, outerParams, false);
    };

    getColFilterUserParams = (colKey: string | null) => {
        return this.getColFilterParams(colKey, true);
    };

    setColFilterUserParams = (colKey: string | null, params: any[] | null) => {
        return this.setColFilterParams(colKey, params, true);
    };

    getUserFiltering = () => {
        const ret: Record<string, object> = {};
        if (this.byColFilter) {
            Object.entries(this.byColFilter).forEach(([k, v]) => {
                if (!v.userParams) {
                    return;
                }
                // @ts-ignore must be an iterator to use spread iterator
                ret[k] = [...v.userParams];
            });
        }
        return ret;
    };

    updateRowFiltering = (rowFilterFunc: (row: RowProps) => boolean) => {
        if (typeof rowFilterFunc !== 'function') {
            throw new Error('row filter should be a function');
        }
        this.byRowFilter = rowFilterFunc;
        this.bumpVersion();
    };
}

export const forTesting = {
    codedColumnsFromKeyAndDirection,
    makeCompositeComparatorFromCodedColumns,
};
