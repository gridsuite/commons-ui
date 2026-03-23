/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import { Box, Tooltip } from '@mui/material';
import { createModificationNameCellStyle, networkTableStyles } from '../network-table-styles';
import { NetworkModificationMetadata, useModificationLabelComputer } from '../../../hooks';
import { mergeSx } from '../../../utils';

export const NameCell: FunctionComponent<{ row: Row<NetworkModificationMetadata> }> = ({ row }) => {
    const intl = useIntl();
    const { computeLabel } = useModificationLabelComputer();

    const getModificationLabel = useCallback(
        (modification: NetworkModificationMetadata, formatBold: boolean = true) => {
            return intl.formatMessage(
                { id: `network_modifications.${modification.messageType}` },
                { ...modification, ...computeLabel(modification, formatBold) }
            );
        },
        [computeLabel, intl]
    );

    const label = useMemo(() => getModificationLabel(row.original), [getModificationLabel, row.original]);

    return (
        <Box sx={mergeSx(networkTableStyles.tableCell, createModificationNameCellStyle(row.original.activated))}>
            <Tooltip disableFocusListener disableTouchListener title={label}>
                <Box sx={networkTableStyles.modificationLabel}>{label}</Box>
            </Tooltip>
        </Box>
    );
};

export default NameCell;
