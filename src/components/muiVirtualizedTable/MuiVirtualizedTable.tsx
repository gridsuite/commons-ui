/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable react/jsx-curly-brace-presence, react/jsx-boolean-value, @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars, no-restricted-globals, no-else-return, react/no-unstable-nested-components, react/function-component-definition, react/no-this-in-sfc, react/require-default-props, react/no-access-state-in-setstate, spaced-comment, object-shorthand, prefer-destructuring, prefer-template, no-return-assign, no-restricted-syntax, react/static-property-placement, @typescript-eslint/lines-between-class-members, react/default-props-match-prop-types, react/destructuring-assignment, no-underscore-dangle, class-methods-use-this, react/sort-comp, prefer-const, no-plusplus */
/**
 * This class has been taken from 'Virtualized Table' example at https://material-ui.com/components/tables/
 */
import { createRef, KeyboardEvent, MouseEvent, MutableRefObject, PureComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';
import memoize from 'memoize-one';
import { Autocomplete, Chip, IconButton, Popover, styled, TableCell, TextField } from '@mui/material';
import { GetApp as GetAppIcon } from '@mui/icons-material';
import { AutoSizer, Column, ColumnProps, RowMouseEventHandlerParams, Table, TableCellProps } from 'react-virtualized';
import CsvDownloader from 'react-csv-downloader';
import { OverflowableText } from '../overflowableText/OverflowableText';
import { makeComposeClasses, MuiStyleObj, MuiStyles, toNestedGlobalSelectors } from '../../utils/styles';
import {
    ChangeWays,
    collectibleHelper,
    CustomColumnProps,
    getHelper,
    KeyedColumnsRowIndexer,
    RowProps,
} from './KeyedColumnsRowIndexer';
import { ColumnHeader } from './ColumnHeader';

function getTextWidth(text: any): number {
    // re-use canvas object for better performance
    let canvas =
        //@ts-ignore this is questioning
        getTextWidth.canvas ||
        //@ts-ignore this is questioning
        (getTextWidth.canvas = document.createElement('canvas'));
    let context = canvas.getContext('2d');
    // TODO find a better way to find Material UI style
    context.font = '14px "Roboto", "Helvetica", "Arial", sans-serif';
    let metrics = context.measureText(text);
    return metrics.width;
}

export const DEFAULT_CELL_PADDING = 16;
export const DEFAULT_HEADER_HEIGHT = 48;
export const DEFAULT_ROW_HEIGHT = 48;

// As a bunch of individual variables to try to make it easier
// to track that they are all used. Not sure, maybe group them in an object ?
const cssFlexContainer = 'flexContainer';
const cssTable = 'table';
const cssTableRow = 'tableRow';
const cssTableRowHover = 'tableRowHover';
const cssTableCell = 'tableCell';
const cssTableCellColor = 'tableCellColor';
const cssNoClick = 'noClick';
const cssHeader = 'header';
const cssRowBackgroundDark = 'rowBackgroundDark';
const cssRowBackgroundLight = 'rowBackgroundLight';

// converted to nested rules
const defaultStyles = {
    [cssFlexContainer]: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    [cssTable]: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
        } as MuiStyleObj, // "flip" property isn't recognized
    },
    [cssTableRow]: {
        cursor: 'pointer',
    },
    [cssTableRowHover]: {},
    [cssTableCell]: {
        flex: 1,
        padding: DEFAULT_CELL_PADDING + 'px',
    },
    [cssTableCellColor]: {},
    [cssNoClick]: {
        cursor: 'initial',
    },
    [cssHeader]: {
        fontWeight: 'bold',
    },
    [cssRowBackgroundDark]: {},
    [cssRowBackgroundLight]: {},
} as const satisfies MuiStyles;

// TODO find a better system, maybe MUI will fix/improve this ?
// Different from all others because of the poor nested sx support for portals
// requiring classname sharing/forwarding between the content and the tooltip
const defaultTooltipSx = {
    maxWidth: '1260px',
    fontSize: '0.9rem',
} as const satisfies MuiStyleObj;

//TODO do we need to export this to clients (index.js) ?
export const generateMuiVirtualizedTableClass = (className: string) => `MuiVirtualizedTable-${className}`;
const composeClasses = makeComposeClasses(generateMuiVirtualizedTableClass);

interface AmongChooserProps<T extends ReactNode> {
    options: T[];
    value?: T[];
    setValue: (values: T[]) => void;
    onDropDownVisibility: (visibility: boolean) => void;
    id: string;
}

const AmongChooser = <T extends ReactNode>(props: AmongChooserProps<T>) => {
    const { options, value, setValue, id, onDropDownVisibility } = props;

    return (
        <span>
            <Autocomplete
                id={id}
                value={value}
                multiple={true}
                onChange={(evt, newVal) => {
                    setValue(newVal);
                }}
                onClose={() => onDropDownVisibility(false)}
                onOpen={() => onDropDownVisibility(true)}
                options={options}
                renderInput={(props) => <TextField autoFocus {...props} />}
                renderTags={(val, getTagsProps) => {
                    return val.map((code, index) => {
                        return <Chip id={'chip_' + code} size={'small'} label={code} {...getTagsProps({ index })} />;
                    });
                }}
            />
        </span>
    );
};

function makeIndexRecord(
    viewIndexToModel: number[] | null,
    rows: Record<number, RowProps>
): {
    viewIndexToModel: number[] | null;
    rowGetter: (index: number) => RowProps;
} {
    return {
        viewIndexToModel,
        rowGetter: !viewIndexToModel
            ? (viewIndex: number) => rows[viewIndex]
            : (viewIndex: number) => {
                  if (viewIndex >= viewIndexToModel.length || viewIndex < 0) {
                      return {} as RowProps;
                  }
                  const modelIndex = viewIndexToModel[viewIndex];
                  return rows[modelIndex];
              },
    };
}

const initIndexer = (props: CustomColumnProps, versionSetter: (version: number) => void) => {
    if (!props.sortable) {
        return null;
    }

    if (props.indexer) {
        return props.indexer;
    }

    return new KeyedColumnsRowIndexer(true, true, null, versionSetter);
};

const preFilterData = memoize(
    (
        columns,
        rows,
        filterFromProps,
        indexer,
        filterVersion // filterVersion is unused directly, used only as a workaround just to reset the memoization
    ) => {
        return indexer.preFilterRowMapping(columns, rows, filterFromProps);
    }
);

const reorderIndex = memoize(
    (
        indexer,
        indirectionVersion,
        rows,
        columns,
        filterFromProps,
        sortFromProps
    ): {
        viewIndexToModel: number[] | null;
        rowGetter: ((index: number) => RowProps) | ((index: number) => number);
    } => {
        if (!rows) {
            return {
                viewIndexToModel: [],
                rowGetter: (viewIndex: number) => viewIndex,
            };
        }

        const highestCodedColumn = !indexer ? 0 : indexer.highestCodedColumn(columns);
        if (sortFromProps && highestCodedColumn) {
            const colIdx = Math.abs(highestCodedColumn) - 1;
            let reorderedIndex = sortFromProps(
                columns[colIdx].dataKey,
                highestCodedColumn > 0,
                !!columns[colIdx].numeric
            );
            return makeIndexRecord(reorderedIndex, rows);
        }
        if (sortFromProps) {
            try {
                const viewIndexToModel = sortFromProps(null, false, false);
                return makeIndexRecord(viewIndexToModel, rows);
            } catch (e) {
                //some external sort functions may expect to only be called
                //when the user has select a column. Catch their errors and ignore
                console.warn(
                    'error in external sort. consider adding support for datakey=null in your external sort function'
                );
            }
        }
        if (indexer) {
            const prefiltered = preFilterData(columns, rows, filterFromProps, indexer, indirectionVersion);
            const reorderedIndex = indexer.makeGroupAndSortIndirector(prefiltered, columns);
            return makeIndexRecord(reorderedIndex, rows);
        }
        if (filterFromProps) {
            const viewIndexToModel = rows
                .map((r: unknown, i: number) => [r, i])
                .filter(([r, _]: [unknown, number]) => filterFromProps(r))
                .map(([_, j]: [unknown, number]) => j);
            return makeIndexRecord(viewIndexToModel, rows);
        }

        return makeIndexRecord(null, rows);
    }
);

export interface MuiVirtualizedTableProps extends CustomColumnProps {
    headerHeight: number;
    columns: CustomColumnProps[];
    defersFilterChanges: (() => void) | null;
    rows: RowProps[];
    filter: unknown;
    sort: unknown;
    classes: Record<string, string>;
    onRowClick?: (event: RowMouseEventHandlerParams) => void;
    rowHeight: number;
    onCellClick: (row: RowProps, column: ColumnProps) => void;
    tooltipSx: MuiStyleObj;
    name: string;
    exportCSVDataKeys: unknown[];
    enableExportCSV: boolean;
}

export interface MuiVirtualizedTableState {
    headerHeight: number;
    indexer: KeyedColumnsRowIndexer | null;
    indirectionVersion: number;
    popoverAnchorEl: Element | null;
    popoverColKey: string | null;
    deferredFilterChange: null | {
        newVal: unknown[] | null;
        colKey: string | null;
    };
}

class MuiVirtualizedTableComponent extends PureComponent<MuiVirtualizedTableProps, MuiVirtualizedTableState> {
    static defaultProps = {
        headerHeight: DEFAULT_HEADER_HEIGHT,
        rowHeight: DEFAULT_ROW_HEIGHT,
        enableExportCSV: false,
        classes: {},
    };

    headers: MutableRefObject<any>;
    observer: IntersectionObserver;
    dropDownVisible: boolean;

    constructor(props: MuiVirtualizedTableProps, context: any) {
        super(props, context);

        this._computeHeaderSize = this._computeHeaderSize.bind(this);
        this._registerHeader = this._registerHeader.bind(this);
        this._registerObserver = this._registerObserver.bind(this);
        // we shouldn't use createRef here, just defining an object would be enough
        // We have to type RefObject to MutableRefObject to enable mutability, and TS enables that...
        this.headers = createRef();
        this.headers.current = {};
        let options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };
        this.observer = new IntersectionObserver(this._computeHeaderSize, options);
        this.dropDownVisible = false;
        this.state = {
            headerHeight: this.props.headerHeight,
            indexer: initIndexer(props, this.setVersion),
            indirectionVersion: 0,
            popoverAnchorEl: null,
            popoverColKey: null,
            deferredFilterChange: null,
        };
    }

    setVersion = (v: number) => {
        this.setState({ indirectionVersion: v });
    };

    componentDidUpdate(oldProps: MuiVirtualizedTableProps) {
        if (oldProps.indexer !== this.props.indexer || oldProps.sortable !== this.props.sortable) {
            this.setState((state) => {
                return {
                    indexer: initIndexer(this.props, this.setVersion),
                    indirectionVersion: (state?.indirectionVersion ?? 0) + 1,
                };
            });
        }
        if (oldProps.headerHeight !== this.props.headerHeight) {
            this._computeHeaderSize();
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this._computeHeaderSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._computeHeaderSize);
        this.observer.disconnect();
    }

    _registerHeader(label: string, header: unknown) {
        if (this.headers.current) {
            this.headers.current[label] = header;
        }
    }

    _registerObserver(element: Element) {
        if (element !== null) {
            this.observer.observe(element);
        }
    }

    computeDataWidth = (text: string) => {
        return getTextWidth(text || '') + 2 * DEFAULT_CELL_PADDING;
    };

    sizes = memoize((columns, rows, rowGetter) => {
        let sizes: Record<string, number> = {};
        columns.forEach((col: CustomColumnProps) => {
            if (col.width) {
                sizes[col.dataKey] = col.width;
            } else {
                /* calculate the header (and min size if exists)
                 * NB : ignores the possible icons
                 */
                let size = Math.max(col.minWidth || 0, this.computeDataWidth(col.label));
                /* calculate for each row the width, and keep the max  */
                for (let i = 0; i < rows.length; ++i) {
                    const gotRow = rowGetter(i);
                    let text = this.getDisplayValue(col, gotRow[col.dataKey]);
                    size = Math.max(size, this.computeDataWidth(text));
                }
                if (col.maxWidth) {
                    size = Math.min(col.maxWidth, size);
                }
                sizes[col.dataKey] = Math.ceil(size);
            }
        });
        return sizes;
    });

    openPopover = (popoverTarget: Element, colKey: string) => {
        const col = this.props.columns.find((c) => c.dataKey === colKey);
        if (getHelper(col) !== collectibleHelper) {
            return;
        }

        this.dropDownVisible = false;
        this.setState({
            popoverAnchorEl: popoverTarget,
            popoverColKey: colKey,
        });
    };

    handleKeyDownOnPopover = (evt: KeyboardEvent<HTMLDivElement>) => {
        if (evt.key === 'Enter' && !this.dropDownVisible) {
            this.closePopover(evt, 'enterKeyDown');
        }
    };

    closePopover = (_: KeyboardEvent<HTMLDivElement>, reason: string) => {
        let bumpsVersion = false;
        if (reason === 'backdropClick' || reason === 'enterKeyDown') {
            bumpsVersion = this._commitFilterChange();
        }
        this.setState((state, _) => {
            return {
                popoverAnchorEl: null,
                popoverColKey: null,
                deferredFilterChange: null,
                indirectionVersion: state.indirectionVersion + (bumpsVersion ? 1 : 0),
            };
        });
    };

    makeColumnFilterEditor = () => {
        const colKey = this.state.popoverColKey;
        const outerParams = this.state.indexer?.getColFilterOuterParams(colKey);
        const userParams =
            !this.props.defersFilterChanges || !this.state.deferredFilterChange
                ? this.state.indexer?.getColFilterUserParams(colKey)
                : this.state.deferredFilterChange.newVal ?? undefined;
        const prefiltered = preFilterData(
            this.props.columns,
            this.props.rows,
            this.props.filter,
            this.state.indexer,
            this.state.indirectionVersion
        );

        let options = [];
        if (outerParams) {
            options.push(...outerParams);
        }
        // @ts-ignore colKey could be null, how to handle this ?
        const colStat = prefiltered?.colsStats?.[colKey];
        if (colStat?.seen) {
            for (const key of Object.getOwnPropertyNames(colStat.seen)) {
                if (options.findIndex((o) => o === key) < 0) {
                    options.push(key);
                }
            }
        }
        options.sort();

        return (
            <AmongChooser
                options={options}
                value={userParams}
                id={'fielt' + colKey}
                setValue={(newVal) => {
                    this.onFilterParamsChange(newVal, colKey);
                }}
                onDropDownVisibility={(visible) => (this.dropDownVisible = visible)}
            />
        );
    };

    _commitFilterChange = () => {
        if (this.state.deferredFilterChange) {
            const colKey = this.state.deferredFilterChange.colKey;
            let newVal = this.state.deferredFilterChange.newVal;
            if (newVal?.length === 0) {
                newVal = null;
            }
            if (this.state.indexer?.setColFilterUserParams(colKey, newVal)) {
                return true;
            }
        }

        return false;
    };

    onFilterParamsChange(newVal: unknown[] | null, colKey: string | null) {
        const nonEmpty = newVal?.length === 0 ? null : newVal;
        if (this.props.defersFilterChanges) {
            this.setState({
                deferredFilterChange: { newVal: newVal, colKey },
            });
        } else if (this.state.indexer?.setColFilterUserParams(colKey, nonEmpty)) {
            this.setState({
                indirectionVersion: this.state.indirectionVersion + 1,
            });
        }
    }

    sortClickHandler = (evt: MouseEvent, _: unknown, columnIndex: number) => {
        const colKey = this.props.columns[columnIndex].dataKey;

        if (evt.altKey) {
            //@ts-ignore should be currentTarget maybe ?
            this.openPopover(evt.target, colKey);
            return;
        }

        let way = ChangeWays.SIMPLE;
        if (evt.ctrlKey && evt.shiftKey) {
            way = ChangeWays.AMEND;
        } else if (evt.ctrlKey) {
            way = ChangeWays.REMOVE;
        } else if (evt.shiftKey) {
            way = ChangeWays.TAIL;
        }

        if (this.state.indexer?.updateSortingFromUser(colKey, way)) {
            this.setState({
                indirectionVersion: this.state.indirectionVersion + 1,
            });
        }
    };

    filterClickHandler = (_: MouseEvent, target: Element | undefined, columnIndex: number) => {
        // ColumnHeader to (header) TableCell
        const retargeted = target?.parentNode ?? target;

        const colKey = this.props.columns[columnIndex].dataKey;
        //@ts-ignore still not the good types
        this.openPopover(retargeted, colKey);
    };

    sortableHeader = ({ label, columnIndex }: { label: string; columnIndex: number }) => {
        const { columns } = this.props;
        const indexer = this.state.indexer;
        const colKey = columns[columnIndex].dataKey;
        const signedRank = indexer?.columnSortingSignedRank(colKey);
        const userParams = indexer?.getColFilterUserParams(colKey);
        const numeric = columns[columnIndex].numeric;

        const prefiltered = preFilterData(columns, this.props.rows, this.props.filter, indexer, indexer?.filterVersion);
        const colStat = prefiltered?.colsStats?.[colKey];
        let filterLevel = 0;
        if (userParams?.length) {
            filterLevel += 1;
            if (!colStat?.seen) {
                filterLevel += 2;
            } else if (userParams.filter((v: string) => !colStat.seen[v]).length) {
                filterLevel += 2;
            }
        }

        // disable filtering when either:
        //  - the column is numeric, we only handle tags for string values
        //  - a cellRenderer is defined, as we have no simple way to match for chosen value(s)
        //  - using an external sort, because it would hardly know about the indexer filtering
        const onFilterClick =
            numeric || this.props.sort || columns[columnIndex].cellRenderer
                ? undefined
                : (ev: MouseEvent<SVGSVGElement>, retargeted?: Element) => {
                      this.filterClickHandler(ev, retargeted, columnIndex);
                  };
        return (
            <ColumnHeader
                label={label}
                ref={(e) => this._registerHeader(label, e)}
                sortSignedRank={signedRank}
                filterLevel={filterLevel}
                numeric={numeric ?? false}
                onSortClick={(ev: MouseEvent<HTMLDivElement>, name?: Element) => {
                    this.sortClickHandler(ev, name, columnIndex);
                }}
                onFilterClick={onFilterClick}
            />
        );
    };

    simpleHeaderRenderer = ({ label }: { label: string }) => {
        return (
            <div
                ref={(element) => {
                    this._registerHeader(label, element);
                }}
            >
                {label}
            </div>
        );
    };

    getRowClassName = ({
        index,
        rowGetter,
    }: {
        index: number;
        rowGetter: any; // Should be ((index: number) => RowProps) | ((index: number) => number) but it's not compatible with the code reorderIndex should be fixed to return only (index: number) => RowProps
    }) => {
        const { classes, onRowClick } = this.props;
        return clsx(
            composeClasses(classes, cssTableRow),
            composeClasses(classes, cssFlexContainer),
            index % 2 === 0 && composeClasses(classes, cssRowBackgroundDark),
            index % 2 !== 0 && composeClasses(classes, cssRowBackgroundLight),
            rowGetter(index)?.notClickable === true && composeClasses(classes, cssNoClick), // Allow to define a row as not clickable
            {
                [composeClasses(classes, cssTableRowHover)]: index !== -1 && onRowClick != null,
            }
        );
    };

    onClickableRowClick = (event: RowMouseEventHandlerParams) => {
        if (event.rowData?.notClickable !== true || event.event?.shiftKey || event.event?.ctrlKey) {
            //@ts-ignore onRowClick is possibly undefined
            this.props.onRowClick(event);
        }
    };

    cellRenderer = ({ cellData, columnIndex, rowIndex }: TableCellProps) => {
        const { columns, classes, rowHeight, onCellClick, rows, tooltipSx } = this.props;

        let displayedValue = this.getDisplayValue(columns[columnIndex], cellData);

        return (
            <TableCell
                component="div"
                className={clsx(composeClasses(classes, cssTableCell), composeClasses(classes, cssFlexContainer), {
                    [composeClasses(classes, cssNoClick)]:
                        displayedValue === undefined ||
                        rows[rowIndex]?.notClickable === true ||
                        onCellClick == null ||
                        columns[columnIndex].clickable === undefined ||
                        !columns[columnIndex].clickable,
                    [composeClasses(classes, cssTableCellColor)]:
                        displayedValue === undefined ||
                        (onCellClick !== null &&
                            !rows[rowIndex]?.notClickable === true &&
                            columns[columnIndex].clickable !== undefined &&
                            columns[columnIndex].clickable),
                })}
                variant="body"
                style={{ height: rowHeight, width: '100%' }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
                onClick={() => {
                    if (
                        onCellClick &&
                        columns[columnIndex].clickable !== undefined &&
                        !rows[rowIndex]?.notClickable === true &&
                        columns[columnIndex].clickable
                    ) {
                        onCellClick(rows[rowIndex], columns[columnIndex]);
                    }
                }}
            >
                <OverflowableText
                    text={displayedValue}
                    //@ts-ignore not really consistent but it should be legacy
                    tooltipStyle={classes.cellTooltip}
                    tooltipSx={{ ...defaultTooltipSx, ...tooltipSx }}
                />
            </TableCell>
        );
    };
    // type check should be increased here
    getDisplayValue(column: CustomColumnProps, cellData: any) {
        let displayedValue: any;
        if (!column.numeric) {
            displayedValue = cellData;
        } else if (isNaN(cellData)) {
            displayedValue = '';
        } else if (column.fractionDigits === undefined || column.fractionDigits === 0) {
            displayedValue = Math.round(cellData);
        } else {
            displayedValue = Number(cellData).toFixed(column.fractionDigits);
        }

        if (column.unit !== undefined) {
            displayedValue += ' ';
            displayedValue += column.unit;
        }
        return displayedValue;
    }

    _computeHeaderSize() {
        const headers = Object.values(this.headers.current);
        if (headers.length === 0) {
            return;
        }
        // for now keep 'historical' use of scrollHeight,
        // though it can not make a difference from clientHeight,
        // as overflow-y as no scroll value
        const scrollHeights = headers.map((header: any) => header.scrollHeight);
        let headerHeight = Math.max(
            Math.max(...scrollHeights) + DEFAULT_CELL_PADDING,
            this.props.headerHeight
            // hides (most often) padding override by forcing height
        );
        if (headerHeight !== this.state.headerHeight) {
            this.setState({
                headerHeight: headerHeight,
            });
        }
    }

    makeHeaderRenderer(dataKey: string, columnIndex: number) {
        const { columns, classes } = this.props;
        return (headerProps: any) => {
            return (
                <TableCell
                    component="div"
                    className={clsx(
                        composeClasses(classes, cssTableCell),
                        composeClasses(classes, cssFlexContainer),
                        composeClasses(classes, cssNoClick),
                        composeClasses(classes, cssHeader)
                    )}
                    variant="head"
                    style={{ height: this.state.headerHeight }}
                    align={columns[columnIndex].numeric || false ? 'right' : 'left'}
                    ref={(e: Element) => this._registerObserver(e)}
                >
                    {this.props.sortable && this.state.indexer
                        ? this.sortableHeader({
                              ...headerProps,
                              columnIndex,
                              key: { dataKey },
                          })
                        : this.simpleHeaderRenderer({
                              ...headerProps,
                          })}
                    {columns[columnIndex].extra && columns[columnIndex].extra}
                </TableCell>
            );
        };
    }

    makeSizedTable = (
        height: number,
        width: number,
        sizes: Record<string, number>,
        reorderedIndex: number[] | null,
        rowGetter: ((index: number) => RowProps) | ((index: number) => number)
    ) => {
        const { sort, ...otherProps } = this.props;

        return (
            <Table
                {...otherProps}
                height={height}
                width={width}
                rowHeight={otherProps.rowHeight}
                gridStyle={{ direction: 'inherit' }}
                headerHeight={this.state.headerHeight}
                className={composeClasses(otherProps.classes, cssTable)}
                onRowClick={
                    this.props.onRowClick &&
                    /* The {...otherProps} just above would hold the slot onRowClick */
                    this.onClickableRowClick
                }
                rowCount={reorderedIndex?.length ?? otherProps.rows.length}
                rowClassName={({ index }) => this.getRowClassName({ index, rowGetter })}
                rowGetter={({ index }) => rowGetter(index)}
            >
                {otherProps.columns.map(({ dataKey, ...other }, index) => {
                    return (
                        <Column
                            key={dataKey}
                            headerRenderer={this.makeHeaderRenderer(dataKey, index)}
                            className={composeClasses(otherProps.classes, cssFlexContainer)}
                            cellRenderer={this.cellRenderer}
                            dataKey={dataKey}
                            flexGrow={1}
                            //@ts-ignore will be overwritten by ...other
                            width={sizes[dataKey]}
                            {...other}
                        />
                    );
                })}
            </Table>
        );
    };

    getCSVFilename = () => {
        if (this.props.name?.length > 0) {
            return this.props.name.replace(/\s/g, '_');
        } else {
            let filename = Object.entries(this.props.columns)
                .map((p) => p[1].label)
                .join('_');
            return filename;
        }
    };

    getCSVData = () => {
        let reorderedIndex = reorderIndex(
            this.state.indexer,
            this.state.indirectionVersion,
            this.props.rows,
            this.props.columns,
            this.props.filter,
            this.props.sort
        );
        let rowsCount = reorderedIndex.viewIndexToModel?.length ?? this.props.rows.length;

        const csvData = [];
        for (let index = 0; index < rowsCount; ++index) {
            const myobj: Record<string, any> = {};
            const sortedRow: any = reorderedIndex.rowGetter(index);
            const exportedKeys = this.props.exportCSVDataKeys;
            this.props.columns.forEach((col) => {
                if (exportedKeys?.find((el: any) => el === col.dataKey)) {
                    myobj[col.dataKey] = sortedRow[col.dataKey];
                }
            });
            csvData.push(myobj);
        }

        return Promise.resolve(csvData);
    };

    csvHeaders = memoize((columns, exportCSVDataKeys) => {
        let tempHeaders: { displayName: string; id: string }[] = [];
        columns.forEach((col: CustomColumnProps) => {
            if (exportCSVDataKeys !== undefined && exportCSVDataKeys.find((el: string) => el === col.dataKey)) {
                tempHeaders.push({
                    displayName: col.label,
                    id: col.dataKey,
                });
            }
        });
        return tempHeaders;
    });

    render() {
        const { viewIndexToModel, rowGetter } = reorderIndex(
            this.state.indexer,
            this.state.indirectionVersion,
            this.props.rows,
            this.props.columns,
            this.props.filter,
            this.props.sort
        );

        const sizes = this.sizes(this.props.columns, this.props.rows, rowGetter);
        const csvHeaders = this.csvHeaders(this.props.columns, this.props.exportCSVDataKeys);

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
                className={this.props.className}
            >
                {this.props.enableExportCSV && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <FormattedMessage id="MuiVirtualizedTable/exportCSV" />
                        <CsvDownloader datas={this.getCSVData} columns={csvHeaders} filename={this.getCSVFilename()}>
                            <IconButton aria-label="exportCSVButton" size="large">
                                <GetAppIcon />
                            </IconButton>
                        </CsvDownloader>
                    </div>
                )}
                <div style={{ flexGrow: 1 }}>
                    <AutoSizer>
                        {({ height, width }) => this.makeSizedTable(height, width, sizes, viewIndexToModel, rowGetter)}
                    </AutoSizer>
                </div>
                {this.state.popoverAnchorEl && (
                    <Popover
                        anchorEl={this.state.popoverAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onKeyDownCapture={this.handleKeyDownOnPopover}
                        onClose={this.closePopover}
                        open={!!this.state.popoverAnchorEl}
                        PaperProps={{ style: { minWidth: '20ex' } }}
                    >
                        {this.makeColumnFilterEditor()}
                    </Popover>
                )}
            </div>
        );
    }
}

const nestedGlobalSelectorsStyles = toNestedGlobalSelectors(defaultStyles, generateMuiVirtualizedTableClass);

export const MuiVirtualizedTable = styled(MuiVirtualizedTableComponent)(nestedGlobalSelectorsStyles);
