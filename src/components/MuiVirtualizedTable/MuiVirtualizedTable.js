/**
 * This class has been taken from 'Virtualized Table' example at https://material-ui.com/components/tables/
 */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import { AutoSizer, Column, Table } from 'react-virtualized';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import memoize from 'memoize-one';

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

class MuiVirtualizedTable extends React.PureComponent {
    static defaultProps = {
        headerHeight: DEFAULT_HEADER_HEIGHT,
        rowHeight: DEFAULT_ROW_HEIGHT,
    };

    state = {
        key: undefined,
        direction: 'asc',
        headerHeight: this.props.headerHeight,
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

    reorderIndex = memoize((key, direction, filter, rows) => {
        if (!rows) return [];
        let indexedArray = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!filter || filter(row)) indexedArray.push([row, i]);
        }

        function compareValue(a, b, isNumeric, reverse) {
            const mult = reverse ? 1 : -1;
            if (a === undefined && b === undefined) return 0;
            else if (a === undefined) return mult;
            else if (b === undefined) return -mult;

            return isNumeric
                ? (Number(a) < Number(b) ? 1 : -1) * mult
                : ('' + a).localeCompare(b) * mult;
        }

        if (key !== undefined) {
            const reverse = direction === 'asc';
            const isNumeric = this.props.columns[key].numeric;
            const dataKey = this.props.columns[key].dataKey;
            if (dataKey && dataKey !== '' && this.state.direction !== '')
                if (this.props.sort)
                    return this.props.sort(dataKey, reverse, isNumeric);
            indexedArray.sort((a, b) =>
                compareValue(a[0][dataKey], b[0][dataKey], isNumeric, reverse)
            );
        }
        return indexedArray.map((k) => k[1]);
    });

    computeDataWidth = (text) => {
        return getTextWidth(text || '') + 2 * DEFAULT_CELL_PADDING;
    };

    sizes = memoize((columns, rows, rowGetter) => {
        let sizes = {};
        columns.forEach((col) => {
            if (col.width) {
                sizes[col.dataKey] = col.width;
            } else {
                /* calculate the header (and min size if exists) */
                let size = Math.max(
                    col.minWidth || 0,
                    this.computeDataWidth(col.label)
                );
                /* calculate for each row the width, and keep the max  */
                for (let i = 0; i < rows.length; ++i) {
                    let text = this.getDisplayValue(
                        col,
                        rowGetter({ index: i })[col.dataKey]
                    );
                    size = Math.max(size, this.computeDataWidth(text));
                }
                if (col.maxWidth) size = Math.min(col.maxWidth, size);
                sizes[col.dataKey] = Math.ceil(size);
            }
        });
        return sizes;
    });

    sortableHeader = ({ label, columnIndex, width }) => {
        const { columns, classes } = this.props;
        return (
            <TableSortLabel
                component="div"
                className={clsx(
                    classes.tableCell,
                    classes.flexContainer,
                    classes.header
                )}
                active={columnIndex === this.state.key}
                style={{
                    justifyContent: columns[columnIndex].numeric
                        ? 'flex-end'
                        : 'baseline',
                    height: this.state.headerHeight,
                }}
                direction={this.state.direction}
                onClick={() => {
                    let { key, direction } = this.state;
                    if (key === undefined) key = columnIndex;
                    else if (direction === 'asc') direction = 'desc';
                    else {
                        key = undefined;
                        direction = 'asc';
                    }
                    this.setState({
                        key: key,
                        direction: direction,
                    });
                }}
                width={width}
                ref={(e) => this._registerObserver(e)}
            >
                <div
                    style={{
                        minHeight: this.props.headerHeight,
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                    ref={(element) => {
                        this._registerHeader(label, element);
                    }}
                >
                    {label}
                </div>
            </TableSortLabel>
        );
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;
        return clsx(
            classes.tableRow,
            classes.flexContainer,
            index % 2 === 0 && classes.rowBackgroundDark,
            index % 2 !== 0 && classes.rowBackgroundLight,
            {
                [classes.tableRowHover]: index !== -1 && onRowClick != null,
            }
        );
    };

    cellRenderer = ({ cellData, columnIndex, rowIndex }) => {
        const { columns, classes, rowHeight, onCellClick, rows } = this.props;

        let displayedValue = this.getDisplayValue(
            columns[columnIndex],
            cellData
        );

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]:
                        displayedValue === undefined ||
                        onCellClick == null ||
                        columns[columnIndex].clickable === undefined ||
                        !columns[columnIndex].clickable,
                    [classes.tableCellColor]:
                        displayedValue === undefined ||
                        (onCellClick !== null &&
                            columns[columnIndex].clickable !== undefined &&
                            columns[columnIndex].clickable),
                })}
                variant="body"
                style={{ height: rowHeight }}
                align={
                    (columnIndex != null && columns[columnIndex].numeric) ||
                    false
                        ? 'right'
                        : 'left'
                }
                onClick={() => {
                    if (onCellClick) {
                        onCellClick(rows[rowIndex], columns[columnIndex]);
                    }
                }}
            >
                {displayedValue}
            </TableCell>
        );
    };

    getDisplayValue(column, cellData) {
        let displayedValue;
        if (column.numeric) {
            if (!isNaN(cellData)) {
                if (
                    column.fractionDigits !== undefined &&
                    column.fractionDigits !== 0
                ) {
                    displayedValue = Number(cellData).toFixed(
                        column.fractionDigits
                    );
                } else {
                    displayedValue = Math.round(cellData);
                }
            } else {
                displayedValue = '';
            }
        } else {
            displayedValue = cellData;
        }

        if (column.unit !== undefined) {
            displayedValue += ' ';
            displayedValue += column.unit;
        }
        return displayedValue;
    }

    headerRenderer = ({ label, columnIndex }) => {
        const { columns, classes } = this.props;
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
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
                ref={(e) => this._registerObserver(e)}
            >
                <div
                    style={{
                        minHeight: this.props.headerHeight,
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                    }}
                    ref={(element) => {
                        this._registerHeader(label, element);
                    }}
                >
                    {label}
                </div>
            </TableCell>
        );
    };

    _computeHeaderSize() {
        console.debug('recompute header size');
        const headers = Object.values(this.headers.current);
        if (headers.length === 0) return;
        let headerHeight = this.props.headerHeight;
        headers.forEach((h) => {
            // https://developer.mozilla.org/fr/docs/Web/API/Element/scrollHeight
            // The scrollHeight value is equal to the minimum height the element
            // would require in order to fit all the content in the viewport
            // without using a vertical scrollbar.
            headerHeight = Math.max(
                h.scrollHeight + DEFAULT_CELL_PADDING,
                headerHeight
            );
        });
        if (headerHeight !== this.state.headerHeight) {
            this.setState({
                headerHeight: headerHeight,
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this._computeHeaderSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._computeHeaderSize);
        this.observer.disconnect();
    }

    render() {
        const {
            classes,
            rows,
            columns,
            rowHeight,
            headerHeight,
            rowCount,
            sortable,
            ...tableProps
        } = this.props;

        const reorderedIndex = this.reorderIndex(
            this.state.key,
            this.state.direction,
            this.props.filter,
            this.props.rows
        );

        const getIndexFor = (index) => {
            return index < reorderedIndex.length ? reorderedIndex[index] : 0;
        };

        const rowGetter = (index) => this.props.rows[getIndexFor(index)];

        const sizes = this.sizes(
            this.props.columns,
            this.props.rows,
            rowGetter
        );
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        height={height}
                        width={width}
                        rowHeight={rowHeight}
                        gridStyle={{
                            direction: 'inherit',
                        }}
                        headerHeight={this.state.headerHeight}
                        className={classes.table}
                        {...tableProps}
                        rowCount={reorderedIndex.length}
                        rowClassName={this.getRowClassName}
                        rowGetter={({ index }) => rowGetter(index)}
                    >
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={(headerProps) => {
                                        if (sortable) {
                                            return this.sortableHeader({
                                                ...headerProps,
                                                width: sizes[dataKey],
                                                columnIndex: index,
                                                key: { dataKey },
                                            });
                                        } else {
                                            return this.headerRenderer({
                                                ...headerProps,
                                                columnIndex: index,
                                            });
                                        }
                                    }}
                                    className={classes.flexContainer}
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    flexGrow={1}
                                    width={sizes[dataKey]}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

MuiVirtualizedTable.propTypes = {
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
    sortable: PropTypes.bool,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    onCellClick: PropTypes.func,
    rowHeight: PropTypes.number,
    filter: PropTypes.func,
    sort: PropTypes.func,
};

export default MuiVirtualizedTable;
