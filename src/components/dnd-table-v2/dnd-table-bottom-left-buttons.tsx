/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, IconButton } from '@mui/material';
import { Replay as ReplayIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { CustomTooltip } from '../tooltip/CustomTooltip';

interface DndTableBottomLeftButtonsProps {
    handleUploadButton: () => void;
    uploadButtonMessageId: string;
    handleResetButton: () => void;
    resetButtonMessageId: string;
    withResetButton?: boolean;
    disableUploadButton?: boolean;
    disabled?: boolean;
}

export function DndTableBottomLeftButtons({
    handleUploadButton,
    uploadButtonMessageId,
    handleResetButton,
    resetButtonMessageId,
    withResetButton,
    disableUploadButton,
    disabled,
}: Readonly<DndTableBottomLeftButtonsProps>) {
    const intl = useIntl();

    return (
        <Grid container item xs spacing={1}>
            <Grid item>
                <CustomTooltip
                    title={intl.formatMessage({
                        id: uploadButtonMessageId,
                    })}
                >
                    <span>
                        <IconButton
                            color="primary"
                            onClick={() => handleUploadButton()}
                            disabled={disabled || disableUploadButton}
                        >
                            <UploadIcon />
                        </IconButton>
                    </span>
                </CustomTooltip>
            </Grid>
            {withResetButton && (
                <Grid item>
                    <CustomTooltip
                        title={intl.formatMessage({
                            id: resetButtonMessageId,
                        })}
                    >
                        <span>
                            <IconButton color="primary" onClick={() => handleResetButton()} disabled={disabled}>
                                <ReplayIcon />
                            </IconButton>
                        </span>
                    </CustomTooltip>
                </Grid>
            )}
        </Grid>
    );
}
