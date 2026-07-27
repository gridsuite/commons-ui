/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import { Box, IconButton, InputBase, useTheme } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { CustomTooltip } from '../../../components';
import {
    createModificationNameCellStyle,
    createNameCellLabelBoxSx,
    createNameCellRootStyle,
    networkModificationTableStyles,
} from '../network-modification-table-styles';
import { DepthBox } from './depth-box';
import { isCompositeModification } from '../utils';
import { useModificationLabelComputer, useSnackMessage } from '../../../hooks';
import { ComposedModificationMetadata, mergeSx, NetworkModificationMetadata, snackWithFallback } from '../../../utils';

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
    table: Table<ComposedModificationMetadata>;
    onChange?: (modification: ComposedModificationMetadata, newValue: string) => Promise<unknown>;
}

export function NameCell({ row, table, onChange }: Readonly<NameCellProps>) {
    const { meta } = table.options;
    const intl = useIntl();
    const theme = useTheme();
    const { computeLabel } = useModificationLabelComputer();
    const { snackError } = useSnackMessage();

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

    // Composite name as carried by the server data.
    const savedCompositeName = useMemo(() => {
        if (!isComposite) {
            return '';
        }
        try {
            return (JSON.parse(row.original.messageValues)?.name as string) ?? '';
        } catch {
            return '';
        }
    }, [isComposite, row.original.messageValues]);

    // Single source of truth for the name: optimistic on rename, re-synced from the server.
    const [compositeName, setCompositeName] = useState(savedCompositeName);
    useEffect(() => {
        setCompositeName(savedCompositeName);
    }, [savedCompositeName]);

    // The displayed label is derived from that name for a composite, and straight from
    // the server data for any other modification.
    const label = useMemo(
        () =>
            isComposite
                ? getModificationLabel({ ...row.original, messageValues: JSON.stringify({ name: compositeName }) })
                : getModificationLabel(row.original),
        [getModificationLabel, row.original, isComposite, compositeName]
    );

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState('');
    const [inputBaseWidthPx, setInputBaseWidthPx] = useState<number | null>(null);
    const labelRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isEditingRef = useRef(false);

    const stopEditing = useCallback(() => {
        isEditingRef.current = false;
        setIsEditing(false);
        setInputBaseWidthPx(null);
    }, []);

    const updateName = useCallback(
        (newName: string) => {
            // Optimistic update: adopt the new name immediately (the label derives from
            // it); persistence is delegated to the consumer via onChange, and we
            // roll back to the server value if it fails.
            setCompositeName(newName);
            Promise.resolve(onChange?.(row.original, newName)).catch((error) => {
                setCompositeName(savedCompositeName); // rollback
                snackWithFallback(snackError, error, { headerId: 'networkModificationRenamingError' });
            });
        },
        [onChange, row.original, savedCompositeName, snackError]
    );

    // onBlur: only commits if editing wasn't already closed by Enter/Escape
    const handleBlur = useCallback(() => {
        if (!isEditingRef.current) {
            return;
        }
        const trimmed = draftName.trim();
        if (trimmed !== '' && trimmed !== compositeName) {
            updateName(trimmed);
        }
        stopEditing();
    }, [compositeName, draftName, updateName, stopEditing]);

    const beginEditingName = useCallback((originalName: string) => {
        // Init draft with current saved name
        setDraftName(originalName);
        // Freeze input width at open time
        if (labelRef.current) {
            const style = globalThis.getComputedStyle(labelRef.current);
            const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const px =
                originalName.length >= MIN_CHAR_WIDTH
                    ? measureTextPx(originalName, font) + 20
                    : measureTextPx('a'.repeat(MIN_CHAR_WIDTH), font) + 20;
            setInputBaseWidthPx(px);
        }

        isEditingRef.current = true;
        setIsEditing(true);

        // Focus + select after the input mounts (next tick)
        requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    }, []);

    const defaultCompositeName: string = useMemo(() => intl.formatMessage({ id: 'CompositeModification' }), [intl]);

    // triggers composite name editing from outside the component
    useEffect(() => {
        const modificationToEditLabel = meta?.interaction.modificationToEditLabel.current;
        if (isComposite && !isEditingRef.current && modificationToEditLabel === row.original.uuid) {
            beginEditingName(defaultCompositeName);
            if (meta) {
                meta.interaction.modificationToEditLabel.current = null;
            }
        }
    }, [meta, defaultCompositeName, isComposite, row.original.uuid, beginEditingName]);

    const handleLabelClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            beginEditingName(compositeName);
        },
        [beginEditingName, compositeName]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                const trimmed = draftName.trim();
                if (trimmed !== '' && trimmed !== compositeName) {
                    updateName(trimmed);
                }
                stopEditing();
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                stopEditing();
                inputRef.current?.blur();
            }
        },
        [compositeName, draftName, updateName, stopEditing]
    );

    const renderDepthBox = () => {
        const depthLevelCount = depth;
        return Array.from({ length: depthLevelCount }, (_, i) => (
            <DepthBox key={i} firstLevel={i === 0} displayAsFolder={isComposite && i === depthLevelCount - 1} />
        ));
    };
    const compositeReadModeProps = isComposite
        ? {
              ref: labelRef,
              onClick: handleLabelClick,
              sx: {
                  cursor: 'text',
                  '&:hover': {
                      textDecoration: 'underline dotted',
                      textDecorationColor: theme.palette.text.secondary,
                  },
              },
          }
        : {};
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
                            sx={mergeSx(networkModificationTableStyles.modificationLabel, {
                                display: 'inline-flex',
                                width: inputBaseWidthPx ? `${inputBaseWidthPx}px` : `${MIN_CHAR_WIDTH}ch`,
                                maxWidth: '100%',
                                flexShrink: 0,
                            })}
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
                        <CustomTooltip disableFocusListener disableTouchListener title={label}>
                            <Box
                                {...compositeReadModeProps}
                                sx={mergeSx(
                                    networkModificationTableStyles.modificationLabel,
                                    createModificationNameCellStyle(row.original.activated),
                                    compositeReadModeProps.sx
                                )}
                            >
                                {label}
                            </Box>
                        </CustomTooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
