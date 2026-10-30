/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, CircularProgress, IconButton } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { GetApp as GetAppIcon, Check as CheckIcon } from '@mui/icons-material';
import { CustomTooltip } from '../tooltip/CustomTooltip';

export interface ExportButtonProps {
    labelId?: string;
    withTooltip?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    isDownloadLoading?: boolean; // used mostly for previous Edge versions where download from backend file takes some time to begin
    isDownloadSuccessful?: boolean;
}

export function ExportCsvButton({
    labelId = 'MuiVirtualizedTable/exportCSV',
    withTooltip = false,
    onClick,
    disabled = false,
    isDownloadLoading: isCsvLoading = false,
    isDownloadSuccessful = false,
}: Readonly<ExportButtonProps>) {
    const iconButton = (
        <IconButton disabled={disabled} aria-label="exportCSVButton" onClick={onClick}>
            {isDownloadSuccessful ? <CheckIcon /> : <GetAppIcon />}
        </IconButton>
    );

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!withTooltip && <FormattedMessage id={labelId} />}
            <Box sx={{ position: 'relative' }}>
                {withTooltip ? (
                    <CustomTooltip title={<FormattedMessage id={labelId} />}>
                        <span>{iconButton}</span>
                    </CustomTooltip>
                ) : (
                    iconButton
                )}
                {isCsvLoading && (
                    <CircularProgress
                        size={30}
                        // style from MUI documentation to wrap icon with circular progress
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-15px',
                            marginLeft: '-15px',
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
