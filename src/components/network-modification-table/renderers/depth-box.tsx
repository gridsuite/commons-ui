/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { networkModificationTableStyles } from '../network-modification-table-styles';

interface DepthBoxProps {
    firstLevel: boolean;
    displayAsFolder?: boolean;
}

function getDepthBoxStyle(displayAsFolder: boolean | undefined) {
    if (displayAsFolder) {
        return networkModificationTableStyles.folderDepthBox;
    }
    return networkModificationTableStyles.depthBox;
}

export function DepthBox({ firstLevel, displayAsFolder = false }: Readonly<DepthBoxProps>) {
    return (
        <>
            {
                /* double width depth box only on the first level */
                firstLevel && <Box sx={getDepthBoxStyle(displayAsFolder)} />
            }
            <Box sx={getDepthBoxStyle(displayAsFolder)}>
                {displayAsFolder && <Box sx={networkModificationTableStyles.depthBoxTick} />}
            </Box>
        </>
    );
}
