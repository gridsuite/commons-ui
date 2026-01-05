/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Checkbox, Theme, Tooltip } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomCellRendererProps } from 'ag-grid-react';
import { useIntl } from 'react-intl';
import { isBlankOrEmpty, mergeSx, MuiStyles } from '../../utils';

const styles = {
    tableCell: (theme: Theme) => ({
        fontSize: 'small',
        cursor: 'inherit',
        display: 'flex',
        '&:before': {
            content: '""',
            position: 'absolute',
            left: theme.spacing(0.5),
            right: theme.spacing(0.5),
            bottom: 0,
        },
    }),
    overflow: {
        whiteSpace: 'pre',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    numericValue: {
        marginLeft: 'inherit',
    },
} as const satisfies MuiStyles;

const FORMULA_ERROR_KEY = 'spreadsheet/formula/error';

interface BaseCellRendererProps {
    value: string | undefined;
    tooltip?: string;
}

export function BooleanCellRenderer({ value }: Readonly<any>) {
    const isChecked = value;
    return (
        <div>
            {value !== undefined && (
                <Checkbox style={{ padding: 0 }} color="default" checked={isChecked} disableRipple />
            )}
        </div>
    );
}

export function BooleanNullableCellRenderer({ value }: Readonly<any>) {
    return (
        <div>
            <Checkbox
                style={{ padding: 0 }}
                color="default"
                checked={value === true}
                indeterminate={isBlankOrEmpty(value)}
                disableRipple
            />
        </div>
    );
}

const formatNumericCell = (value: number, fractionDigits?: number) => {
    if (value === null || Number.isNaN(value)) {
        return { value: null };
    }
    return { value: value.toFixed(fractionDigits ?? 2), tooltip: value?.toString() };
};

const formatCell = (props: any) => {
    let value = props?.valueFormatted || props.value;
    let tooltipValue;
    // we use valueGetter only if value is not defined
    if (!value && props.colDef.valueGetter) {
        props.colDef.valueGetter(props);
    }
    if (value != null && props.colDef.context?.numeric && props.colDef.context?.fractionDigits) {
        // only numeric rounded cells have a tooltip (their raw numeric value)
        tooltipValue = value;
        value = Number.parseFloat(value).toFixed(props.colDef.context.fractionDigits);
    }
    if (props.colDef.context?.numeric && Number.isNaN(value)) {
        value = null;
    }
    return { value, tooltip: tooltipValue };
};

export interface NumericCellRendererProps extends CustomCellRendererProps {
    fractionDigits?: number;
}

export function NumericCellRenderer({ value, fractionDigits }: Readonly<NumericCellRendererProps>) {
    const numericalValue = typeof value === 'number' ? value : Number.parseFloat(value);
    const cellValue = formatNumericCell(numericalValue, fractionDigits);
    return (
        <Box sx={mergeSx(styles.tableCell)}>
            <Tooltip
                disableFocusListener
                disableTouchListener
                title={cellValue.tooltip ? cellValue.tooltip : cellValue.value?.toString()}
            >
                <Box sx={styles.overflow}>{cellValue.value}</Box>
            </Tooltip>
        </Box>
    );
}

function BaseCellRenderer({ value, tooltip }: Readonly<BaseCellRendererProps>) {
    return (
        <Box sx={mergeSx(styles.tableCell)}>
            <Tooltip disableFocusListener disableTouchListener title={tooltip || value || ''}>
                <Box sx={styles.overflow}>{value}</Box>
            </Tooltip>
        </Box>
    );
}

export function ErrorCellRenderer({ value }: Readonly<CustomCellRendererProps>) {
    const intl = useIntl();
    const errorMessage = intl.formatMessage({ id: value?.error });
    const errorValue = intl.formatMessage({ id: FORMULA_ERROR_KEY });
    return <BaseCellRenderer value={errorValue} tooltip={errorMessage} />;
}

export function DefaultCellRenderer(props: Readonly<CustomCellRendererProps>) {
    const cellValue = formatCell(props).value?.toString();
    return <BaseCellRenderer value={cellValue} />;
}

export function NetworkModificationNameCellRenderer({ value }: Readonly<CustomCellRendererProps>) {
    return (
        <Box sx={mergeSx(styles.tableCell)}>
            <Tooltip
                disableFocusListener
                disableTouchListener
                title={value}
                componentsProps={{
                    tooltip: {
                        sx: {
                            maxWidth: 'none',
                        },
                    },
                }}
            >
                <Box sx={styles.overflow}>{value}</Box>
            </Tooltip>
        </Box>
    );
}

export function MessageLogCellRenderer({
    param,
    highlightColor,
    currentHighlightColor,
    searchTerm,
    currentResultIndex,
    searchResults,
}: Readonly<{
    param: ICellRendererParams;
    highlightColor?: string;
    currentHighlightColor?: string;
    searchTerm?: string;
    currentResultIndex?: number;
    searchResults?: number[];
}>) {
    const marginLeft = (param.data?.depth ?? 0) * 2; // add indentation based on depth
    const textRef = useRef<HTMLDivElement>(null);
    const [isEllipsisActive, setIsEllipsisActive] = useState(false);

    const checkEllipsis = () => {
        if (textRef.current) {
            const zoomLevel = window.devicePixelRatio;
            const adjustedScrollWidth = textRef.current.scrollWidth / zoomLevel;
            const adjustedClientWidth = textRef.current.clientWidth / zoomLevel;
            setIsEllipsisActive(adjustedScrollWidth > adjustedClientWidth);
        }
    };

    useEffect(() => {
        checkEllipsis();
        const resizeObserver = new ResizeObserver(() => checkEllipsis());
        if (textRef.current) {
            resizeObserver.observe(textRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [param.value]);

    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const renderHighlightedText = (value: string) => {
        if (!searchTerm || searchTerm === '') {
            return value;
        }

        const escapedSearchTerm = escapeRegExp(searchTerm);
        const parts = value.split(new RegExp(`(${escapedSearchTerm})`, 'gi'));
        let count = 0;
        return (
            <span>
                {parts.map((part: string) => {
                    count += 1;
                    const key = `${param.node.rowIndex}-${count}`;
                    const isMatch = part.toLowerCase() === searchTerm.toLowerCase();
                    if (isMatch) {
                        return (
                            <span
                                key={key}
                                style={{
                                    backgroundColor:
                                        searchResults &&
                                        currentResultIndex !== undefined &&
                                        searchResults[currentResultIndex] === param.node.rowIndex
                                            ? currentHighlightColor
                                            : highlightColor,
                                }}
                            >
                                {part}
                            </span>
                        );
                    }
                    return <span key={key}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <Box sx={mergeSx(styles.tableCell)}>
            <Tooltip disableFocusListener disableTouchListener title={isEllipsisActive ? param.value : ''}>
                <Box
                    ref={textRef}
                    sx={{
                        ...styles.overflow,
                        marginLeft,
                    }}
                >
                    {renderHighlightedText(param.value)}
                </Box>
            </Tooltip>
        </Box>
    );
}

export function ContingencyCellRenderer({
    value,
}: Readonly<{ value: { cellValue: ReactNode; tooltipValue: ReactNode } }>) {
    const { cellValue, tooltipValue } = value ?? {};

    if (cellValue == null || tooltipValue == null) {
        return null;
    }

    return (
        <Box sx={mergeSx(styles.tableCell)}>
            <Tooltip title={<div style={{ whiteSpace: 'pre-line' }}>{tooltipValue}</div>}>
                <Box sx={styles.overflow}>{cellValue}</Box>
            </Tooltip>
        </Box>
    );
}
