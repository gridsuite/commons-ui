/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * This class has been taken from 'Virtualized Table' example at https://material-ui.com/components/tables/
 */
import React, { createRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import memoize from 'memoize-one';
import {
    Autocomplete,
    Chip,
    IconButton,
    Popover,
    TableCell,
    TextField,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import GetAppIcon from '@mui/icons-material/GetApp';
import { AutoSizer, Column, Table } from 'react-virtualized';
import CsvDownloader from 'react-csv-downloader';
import OverflowableText from '../OverflowableText/overflowable-text';
import {
    CHANGE_WAYS,
    collectibleHelper,
    getHelper,
    KeyedColumnsRowIndexer,
} from './KeyedColumnsRowIndexer';
import ColumnHeader from './ColumnHeader';

function getTextWidth(text) {
    // re-use canvas object for better performance
    let canvas =
        getTextWidth.canvas ||
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

const defaultStyles = {
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
        },
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {},
    tableCell: {
        flex: 1,
        padding: DEFAULT_CELL_PADDING + 'px',
    },
    tableCellColor: {},
    noClick: {
        cursor: 'initial',
    },
    header: {
        fontWeight: 'bold',
    },
    rowBackgroundDark: {},
    rowBackgroundLight: {},
    cellTooltip: {
        maxWidth: '1260px',
        fontSize: '0.9rem',
    },
};

const AmongChooser = (props) => {
    const { options, value, setValue, id, onDropDownVisibility } = props;

    return (
        <span>
            <Autocomplete
                id={id}
                value={value ?? []}
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
                        return (
                            <Chip
                                id={'chip_' + code}
                                size={'small'}
                                label={code}
                                {...getTagsProps({ index })}
                            />
                        );
                    });
                }}
            />
        </span>
    );
};

function makeIndexRecord(viewIndexToModel, rows) {
    return {
        viewIndexToModel,
        rowGetter: !viewIndexToModel
            ? (viewIndex) => rows[viewIndex]
            : (viewIndex) => {
                  if (viewIndex >= viewIndexToModel.length || viewIndex < 0) {
                      return {};
                  }
                  const modelIndex = viewIndexToModel[viewIndex];
                  return rows[modelIndex];
              },
    };
}

const initIndexer = (props, oldProps, versionSetter) => {
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
    ) => {
        if (!rows) {
            return {
                viewIndexToModel: [],
                rowGetter: (viewIndex) => viewIndex,
            };
        }

        const highestCodedColumn = !indexer
            ? 0
            : indexer.highestCodedColumn(columns);
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
            const prefiltered = preFilterData(
                columns,
                rows,
                filterFromProps,
                indexer,
                indirectionVersion
            );
            const reorderedIndex = indexer.makeGroupAndSortIndirector(
                prefiltered,
                columns
            );
            return makeIndexRecord(reorderedIndex, rows);
        }
        if (filterFromProps) {
            const viewIndexToModel = rows
                .map((r, i) => [r, i])
                .filter(([r, idx]) => filterFromProps(r))
                .map(([r, j]) => j);
            return makeIndexRecord(viewIndexToModel, rows);
        }

        return makeIndexRecord(null, rows);
    }
);

class MuiVirtualizedTable extends React.PureComponent {
    static defaultProps = {
        headerHeight: DEFAULT_HEADER_HEIGHT,
        rowHeight: DEFAULT_ROW_HEIGHT,
        enableExportCSV: false,
    };

    constructor(props, context) {
        super(props, context);

        this._computeHeaderSize = this._computeHeaderSize.bind(this);
        this._registerHeader = this._registerHeader.bind(this);
        this._registerObserver = this._registerObserver.bind(this);
        this.headers = createRef();
        this.headers.current = {};
        let options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };
        this.observer = new IntersectionObserver(
            this._computeHeaderSize,
            options
        );
        this.state = {
            headerHeight: this.props.headerHeight,
            indexer: initIndexer(props, null, this.setVersion),
            indirectionVersion: 0,
            popoverAnchorEl: null,
            popoverColKey: null,
            deferredFilterChange: null,
        };
    }

    setVersion = (v) => {
        this.setState({ indirectionVersion: v });
    };

    componentDidUpdate(oldProps) {
        if (
            oldProps.indexer !== this.props.indexer ||
            oldProps.sortable !== this.props.sortable
        ) {
            this.setState((state) => {
                return {
                    indexer: initIndexer(this.props, oldProps, this.setVersion),
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

    _registerHeader(label, header) {
        if (header !== null) {
            this.headers.current[label] = header;
        }
    }

    _registerObserver(element) {
        if (element !== null) {
            this.observer.observe(element);
        }
    }

    computeDataWidth = (text) => {
        return getTextWidth(text || '') + 2 * DEFAULT_CELL_PADDING;
    };

    sizes = memoize((columns, rows, rowGetter) => {
        let sizes = {};
        columns.forEach((col) => {
            if (col.width) {
                sizes[col.dataKey] = col.width;
            } else {
                /* calculate the header (and min size if exists)
                 * NB : ignores the possible icons
                 */
                let size = Math.max(
                    col.minWidth || 0,
                    this.computeDataWidth(col.label)
                );
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

    openPopover = (popoverTarget, colKey) => {
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

    handleKeyDownOnPopover = (evt) => {
        if (evt.key === 'Enter' && !this.dropDownVisible) {
            this.closePopover(evt, 'enterKeyDown');
        }
    };

    closePopover = (evt, reason) => {
        let bumpsVersion = false;
        if (reason === 'backdropClick' || reason === 'enterKeyDown') {
            bumpsVersion = this._commitFilterChange();
        }
        this.setState((state, props) => {
            return {
                popoverAnchorEl: null,
                popoverColKey: null,
                deferredFilterChange: null,
                indirectionVersion:
                    state.indirectionVersion + (bumpsVersion ? 1 : 0),
            };
        });
    };

    makeColumnFilterEditor = () => {
        const colKey = this.state.popoverColKey;
        const outerParams = this.state.indexer.getColFilterOuterParams(colKey);
        const userParams =
            !this.props.defersFilterChanges || !this.state.deferredFilterChange
                ? this.state.indexer.getColFilterUserParams(colKey)
                : this.state.deferredFilterChange.newVal;
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
        const colStat = prefiltered?.colsStats?.[colKey];
        if (colStat?.seen) {
            for (const key of Object.getOwnPropertyNames(colStat.seen)) {
                if (options.findIndex((o) => o === key) < 0) {
                    options.push(key);
                }
            }
        }
        options.sort();

        const col = this.props.columns.find((c) => c.dataKey === colKey);

        return (
            <AmongChooser
                options={options}
                value={userParams}
                id={'fielt' + colKey}
                label={col?.label ?? '\u2208'} // "contained in" math symbol
                setValue={(newVal) => {
                    this.onFilterParamsChange(newVal, colKey);
                }}
                onDropDownVisibility={(visible) =>
                    (this.dropDownVisible = visible)
                }
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
            if (this.state.indexer.setColFilterUserParams(colKey, newVal)) {
                return true;
            }
        }

        return false;
    };

    onFilterParamsChange(newVal, colKey) {
        const nonEmpty = newVal.length === 0 ? null : newVal;
        if (this.props.defersFilterChanges) {
            this.setState({
                deferredFilterChange: { newVal: newVal, colKey },
            });
        } else if (
            this.state.indexer.setColFilterUserParams(colKey, nonEmpty)
        ) {
            this.setState({
                indirectionVersion: this.state.indirectionVersion + 1,
            });
        }
    }

    sortClickHandler = (evt, name, colKey) => {
        if (evt.altKey) {
            this.openPopover(evt.target, colKey);
            return;
        }

        let way = CHANGE_WAYS.SIMPLE;
        if (evt.ctrlKey && evt.shiftKey) {
            way = CHANGE_WAYS.AMEND;
        } else if (evt.ctrlKey) {
            way = CHANGE_WAYS.REMOVE;
        } else if (evt.shiftKey) {
            way = CHANGE_WAYS.TAIL;
        }

        if (this.state.indexer.updateSortingFromUser(colKey, way)) {
            this.setState({
                indirectionVersion: this.state.indirectionVersion + 1,
            });
        }
    };

    filterClickHandler = (evt, target, colKey) => {
        // ColumnHeader to (header) TableCell
        const retargeted = target.parentNode ?? target;
        this.openPopover(retargeted, colKey);
    };

    sortableHeader = ({ label, dataKey, columnData }) => {
        const { columns } = this.props;
        const indexer = this.state.indexer;
        const colKey = dataKey;
        const signedRank = indexer.columnSortingSignedRank(colKey);
        const userParams = indexer.getColFilterUserParams(colKey);

        const prefiltered = preFilterData(
            columns,
            this.props.rows,
            this.props.filter,
            indexer,
            indexer.filterVersion
        );
        const colStat = prefiltered?.colsStats?.[colKey];
        let filterLevel = 0;
        if (userParams?.length) {
            filterLevel += 1;
            if (!colStat?.seen) {
                filterLevel += 2;
            } else if (userParams.filter((v) => !colStat.seen[v]).length) {
                filterLevel += 2;
            }
        }

        // disable filtering when either:
        //  - the column is numeric, we only handle tags for string values
        //  - a cellRenderer is defined, as we have no simple way to match for chosen value(s)
        //  - using an external sort, because it would hardly know about the indexer filtering
        const onFilterClick =
            columnData.numeric || this.props.sort || columnData.cellRenderer
                ? undefined
                : (ev, retargeted) => {
                      this.filterClickHandler(ev, retargeted, colKey);
                  };
        return (
            <ColumnHeader
                label={label}
                ref={(e) => this._registerHeader(label, e)}
                sortSignedRank={signedRank}
                filterLevel={filterLevel}
                numeric={columnData.numeric}
                onSortClick={(ev, name) => {
                    this.sortClickHandler(ev, name, colKey);
                }}
                onFilterClick={onFilterClick}
            />
        );
    };

    simpleHeaderRenderer = ({ label }) => {
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

    getRowClassName = ({ index, rowGetter }) => {
        const { classes, onRowClick } = this.props;
        return clsx(
            classes.tableRow,
            classes.flexContainer,
            index % 2 === 0 && classes.rowBackgroundDark,
            index % 2 !== 0 && classes.rowBackgroundLight,
            rowGetter(index)?.notClickable === true && classes.noClick, // Allow to define a row as not clickable
            {
                [classes.tableRowHover]: index !== -1 && onRowClick != null,
            }
        );
    };

    onClickableRowClick = (event) => {
        if (!(event.rowData?.notClickable === true)) {
            this.props.onRowClick(event);
        }
    };

    cellRenderer = ({ cellData, columnData, rowData }) => {
        const { classes, rowHeight, onCellClick } = this.props;
        let displayedValue = this.getDisplayValue(columnData, cellData);

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]:
                        displayedValue === undefined ||
                        rowData?.notClickable === true ||
                        onCellClick == null ||
                        columnData.clickable === undefined ||
                        !columnData.clickable,
                    [classes.tableCellColor]:
                        displayedValue === undefined ||
                        (onCellClick !== null &&
                            !rowData?.notClickable === true &&
                            columnData.clickable !== undefined &&
                            columnData.clickable),
                })}
                variant="body"
                style={{ height: rowHeight, width: '100%' }}
                align={
                    (columnData != null && columnData.numeric) || false
                        ? 'right'
                        : 'left'
                }
                onClick={() => {
                    if (
                        onCellClick &&
                        columnData.clickable !== undefined &&
                        !rowData?.notClickable === true &&
                        columnData.clickable
                    ) {
                        onCellClick(rowData, columnData);
                    }
                }}
            >
                <OverflowableText
                    text={displayedValue}
                    tooltipStyle={classes.cellTooltip}
                />
            </TableCell>
        );
    };

    getDisplayValue(column, cellData) {
        let displayedValue;
        if (!column.numeric) {
            displayedValue = cellData;
        } else if (isNaN(cellData)) {
            displayedValue = '';
        } else if (
            column.fractionDigits === undefined ||
            column.fractionDigits === 0
        ) {
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
        const scrollHeights = headers.map((header) => header.scrollHeight);
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

    headerRenderer = (headerData) => {
        const { classes } = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(
                    classes.tableCell,
                    classes.flexContainer,
                    classes.noClick,
                    classes.header
                )}
                variant="head"
                style={{ height: this.state.headerHeight }}
                align={
                    headerData.columnData.numeric || false ? 'right' : 'left'
                }
                ref={(e) => this._registerObserver(e)}
            >
                {this.props.sortable && this.state.indexer
                    ? this.sortableHeader(headerData)
                    : this.simpleHeaderRenderer(headerData)}
            </TableCell>
        );
    };

    makeSizedTable = (height, width, sizes, reorderedIndex, rowGetter) => {
        const { sort, ...otherProps } = this.props;

        return (
            <Table
                {...otherProps}
                height={height}
                width={width}
                rowHeight={otherProps.rowHeight}
                gridStyle={{ direction: 'inherit' }}
                headerHeight={this.state.headerHeight}
                className={otherProps.classes.table}
                onRowClick={
                    this.props.onRowClick &&
                    /* The {...otherProps} just above would hold the slot onRowClick */
                    this.onClickableRowClick
                }
                rowCount={reorderedIndex?.length ?? otherProps.rows.length}
                rowClassName={({ index }) =>
                    this.getRowClassName({ index, rowGetter })
                }
                rowGetter={({ index }) => rowGetter(index)}
            >
                {otherProps.columns.map((columnData, index) => {
                    const { dataKey, ...others } = columnData;
                    return (
                        <Column
                            key={dataKey}
                            headerRenderer={this.headerRenderer}
                            className={otherProps.classes.flexContainer}
                            cellRenderer={this.cellRenderer}
                            dataKey={dataKey}
                            flexGrow={1}
                            width={sizes[dataKey]}
                            columnData={columnData}
                            {...others}
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
        let rowsCount =
            reorderedIndex.viewIndexToModel?.length ?? this.props.rows.length;

        const csvData = [];
        for (let index = 0; index < rowsCount; ++index) {
            const myobj = {};
            const sortedRow = reorderedIndex.rowGetter(index);
            const exportedKeys = this.props.exportCSVDataKeys;
            this.props.columns.forEach((col) => {
                if (exportedKeys?.find((el) => el === col.dataKey)) {
                    myobj[col.dataKey] = sortedRow[col.dataKey];
                }
            });
            csvData.push(myobj);
        }

        return Promise.resolve(csvData);
    };

    csvHeaders = memoize((columns, exportCSVDataKeys) => {
        let tempHeaders = [];
        columns.forEach((col) => {
            if (
                exportCSVDataKeys !== undefined &&
                exportCSVDataKeys.find((el) => el === col.dataKey)
            ) {
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

        const sizes = this.sizes(
            this.props.columns,
            this.props.rows,
            rowGetter
        );
        const csvHeaders = this.csvHeaders(
            this.props.columns,
            this.props.exportCSVDataKeys
        );

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
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
                        <CsvDownloader
                            datas={this.getCSVData}
                            columns={csvHeaders}
                            filename={this.getCSVFilename()}
                        >
                            <IconButton
                                aria-label="exportCSVButton"
                                size="large"
                            >
                                <GetAppIcon />
                            </IconButton>
                        </CsvDownloader>
                    </div>
                )}
                <div style={{ flexGrow: 1 }}>
                    <AutoSizer>
                        {({ height, width }) =>
                            this.makeSizedTable(
                                height,
                                width,
                                sizes,
                                viewIndexToModel,
                                rowGetter
                            )
                        }
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

MuiVirtualizedTable.propTypes = {
    name: PropTypes.string,
    classes: PropTypes.object.isRequired,
    rows: PropTypes.array,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            dataKey: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            numeric: PropTypes.bool,
            width: PropTypes.number,
            minWidth: PropTypes.number,
            maxWidth: PropTypes.number,
            unit: PropTypes.string,
            fractionDigits: PropTypes.number,
        })
    ).isRequired,
    enableExportCSV: PropTypes.bool,
    exportCSVDataKeys: PropTypes.array,
    sort: PropTypes.func,
    sortable: PropTypes.bool,
    indexer: PropTypes.object,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    onCellClick: PropTypes.func,
    rowHeight: PropTypes.number,
    filter: PropTypes.func,
};

export default withStyles(defaultStyles)(MuiVirtualizedTable);
