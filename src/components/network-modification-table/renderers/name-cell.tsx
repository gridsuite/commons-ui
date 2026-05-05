/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Row } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import { Box, IconButton, InputBase, Tooltip, useTheme } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import {
    createModificationNameCellStyle,
    createNameCellLabelBoxSx,
    createNameCellRootStyle,
    networkModificationTableStyles,
} from '../network-modification-table-styles';
import { DepthBox } from './depth-box';
import { isCompositeModification } from '../utils';
import { useModificationLabelComputer } from '../../../hooks';
import { ComposedModificationMetadata, mergeSx, NetworkModificationMetadata } from '../../../utils';

const MIN_CHAR_WIDTH = 30;

function measureTextPx(text: string, font: string): number {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
        ctx.font = font;
        return ctx.measureText(text).width;
    }

    return text.length * 8;
}

interface NameCellProps {
    row: Row<ComposedModificationMetadata>;
    onEditNameCell?: (modification: ComposedModificationMetadata, newName: string) => void;
}

export function NameCell({ row, onEditNameCell }: Readonly<NameCellProps>) {
    const intl = useIntl();
    const theme = useTheme();
    const { computeLabel } = useModificationLabelComputer();

    const { depth } = row;

    const isComposite = isCompositeModification(row.original);

    const getModificationLabel = useCallback(
        (modification: ComposedModificationMetadata, formatBold: boolean = true) => {
            return intl.formatMessage(
                { id: `network_modifications.${modification.messageType}` },
                { ...(modification as NetworkModificationMetadata), ...computeLabel(modification, formatBold) }
            );
        },
        [computeLabel, intl]
    );

    const label = useMemo(() => getModificationLabel(row.original), [getModificationLabel, row.original]);

    const compositeName = useMemo(() => {
        if (!isComposite) {
            return '';
        }
        try {
            return (JSON.parse(row.original.messageValues)?.name as string) ?? '';
        } catch {
            return '';
        }
    }, [isComposite, row.original.messageValues]);

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState('');
    const [frozenWidthPx, setFrozenWidthPx] = useState<number | null>(null);
    const labelRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isEditingRef = useRef(false);

    const stopEditing = useCallback(() => {
        isEditingRef.current = false;
        setIsEditing(false);
        setFrozenWidthPx(null);
    }, []);

    // onBlur: only commits if editing wasn't already closed by Enter/Escape
    const handleBlur = useCallback(() => {
        if (!isEditingRef.current) {
            return;
        }
        const trimmed = draftName.trim();
        if (trimmed !== '' && trimmed !== compositeName) {
            onEditNameCell?.(row.original, trimmed);
        }
        stopEditing();
    }, [compositeName, draftName, onEditNameCell, row.original, stopEditing]);

    const handleLabelClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            // Init draft with current saved name
            setDraftName(compositeName);
            // Freeze input width at open time
            if (labelRef.current) {
                const style = window.getComputedStyle(labelRef.current);
                const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                const px =
                    compositeName.length >= MIN_CHAR_WIDTH
                        ? measureTextPx(compositeName, font) + 20
                        : measureTextPx('a'.repeat(MIN_CHAR_WIDTH), font) + 20;
                setFrozenWidthPx(px);
            }

            isEditingRef.current = true;
            setIsEditing(true);

            // Focus + select after the input mounts (next tick)
            requestAnimationFrame(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            });
        },
        [compositeName]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                const trimmed = draftName.trim();
                if (trimmed !== '' && trimmed !== compositeName) {
                    onEditNameCell?.(row.original, trimmed);
                }
                stopEditing();
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                stopEditing();
                inputRef.current?.blur();
            }
        },
        [compositeName, draftName, onEditNameCell, row.original, stopEditing]
    );

    const renderDepthBox = () => {
        const depthLevelCount = depth;
        return Array.from({ length: depthLevelCount }, (_, i) => (
            <DepthBox key={i} firstLevel={i === 0} displayAsFolder={isComposite && i === depthLevelCount - 1} />
        ));
    };

    return (
        <Box
            sx={mergeSx(
                networkModificationTableStyles.tableCell,
                createNameCellRootStyle(theme, row.getIsExpanded(), depth)
            )}
        >
            {renderDepthBox()}
            <Box sx={networkModificationTableStyles.nameCellInnerRow}>
                {isComposite && (
                    <Box sx={networkModificationTableStyles.nameCellTogglerBox}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                row.getToggleExpandedHandler()();
                            }}
                            sx={networkModificationTableStyles.nameCellToggleButton}
                            aria-label={row.getIsExpanded() ? 'Collapse' : 'Expand'}
                        >
                            {row.getIsExpanded() ? (
                                <KeyboardArrowDown fontSize="small" />
                            ) : (
                                <KeyboardArrowRight fontSize="small" />
                            )}
                        </IconButton>
                    </Box>
                )}
                <Box sx={createNameCellLabelBoxSx(row.getIsExpanded(), depth)}>
                    {/* Edit mode — composite only */}
                    {isComposite && isEditing ? (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                width: frozenWidthPx ? `${frozenWidthPx}px` : `${MIN_CHAR_WIDTH}ch`,
                                maxWidth: '100%',
                                flexShrink: 0,
                            }}
                        >
                            <InputBase
                                inputRef={inputRef}
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                onMouseDown={(e) => e.stopPropagation()}
                                sx={{
                                    width: '100%',
                                    fontSize: 'inherit',
                                    fontFamily: 'inherit',
                                    color: 'inherit',
                                    '& .MuiInputBase-input': {
                                        border: `1px solid ${theme.palette.primary.main}`,
                                        borderRadius: `${theme.shape.borderRadius}px`,
                                        backgroundColor: theme.palette.background.paper,
                                    },
                                }}
                            />
                        </Box>
                    ) : (
                        /* Read mode */
                        <Tooltip disableFocusListener disableTouchListener title={label}>
                            <Box
                                ref={isComposite ? labelRef : undefined}
                                onClick={isComposite ? handleLabelClick : undefined}
                                sx={mergeSx(
                                    networkModificationTableStyles.modificationLabel,
                                    createModificationNameCellStyle(row.original.activated),
                                    isComposite
                                        ? {
                                              cursor: 'text',
                                              '&:hover': {
                                                  textDecoration: 'underline dotted',
                                                  textDecorationColor: theme.palette.text.secondary,
                                              },
                                          }
                                        : undefined
                                )}
                            >
                                {label}
                            </Box>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
