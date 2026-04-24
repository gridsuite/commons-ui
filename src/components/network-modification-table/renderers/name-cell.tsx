/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import { Box, IconButton, useTheme } from '@mui/material';
import { CustomTooltip } from '../../tooltip/CustomTooltip';
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

interface NameCellProps {
    row: Row<ComposedModificationMetadata>;
}

export function NameCell({ row }: Readonly<NameCellProps>) {
    const intl = useIntl();
    const theme = useTheme();
    const { computeLabel } = useModificationLabelComputer();

    const { depth } = row;

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

    const renderDepthBox = () => {
        const depthLevelCount = depth;
        return Array.from({ length: depthLevelCount }, (_, i) => (
            <DepthBox
                key={i}
                firstLevel={i === 0}
                displayAsFolder={isCompositeModification(row.original) && i === depthLevelCount - 1}
            />
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
                {isCompositeModification(row.original) && (
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
                    <CustomTooltip disableFocusListener disableTouchListener title={label}>
                        <Box
                            sx={mergeSx(
                                networkModificationTableStyles.modificationLabel,
                                createModificationNameCellStyle(row.original.activated)
                            )}
                        >
                            {label}
                        </Box>
                    </CustomTooltip>
                </Box>
            </Box>
        </Box>
    );
}
