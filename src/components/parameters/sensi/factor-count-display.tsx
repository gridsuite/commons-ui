/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, CircularProgress, SxProps, Theme } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import type { MuiStyles } from '../../../utils';

const styles = {
    circularProgress: (theme) => ({
        display: 'flex',
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    }),
    errorOutlineIcon: (theme) => ({
        marginRight: theme.spacing(1),
        color: theme.palette.error.main,
        display: 'flex',
    }),
    textInfo: (theme) => ({
        color: theme.palette.primary.main,
        display: 'flex',
    }),
    textInitial: {
        color: 'grey',
    },
    textAlert: (theme) => ({
        color: theme.palette.error.main,
        display: 'flex',
    }),
} as const satisfies MuiStyles;

const renderLoadingState = () => {
    return (
        <Box sx={styles.textInfo}>
            <CircularProgress size="1em" sx={styles.circularProgress} />
        </Box>
    );
};

interface FactorCountDisplayProps {
    count: number;
    maxCount: number;
    messageId: string;
    isLoading: boolean;
}

export function FactorCountDisplay(props: FactorCountDisplayProps) {
    const { count, maxCount, messageId, isLoading } = props;

    if (isLoading) return renderLoadingState();

    const isOverMillion = count > 999_999;
    const isOverLimit = count > maxCount;
    const isZero = count === 0;

    const isAlert = isOverMillion || isOverLimit;

    let sx: SxProps<Theme> = styles.textInfo;
    if (isAlert) {
        sx = styles.textAlert;
    } else if (isZero) {
        sx = styles.textInitial;
    }

    const displayCount = isOverMillion ? '999999' : count.toString();
    const suffix = isOverMillion ? '+' : '';

    return (
        <Box sx={sx}>
            {isAlert && <ErrorOutlineIcon sx={styles.errorOutlineIcon} />}
            <FormattedMessage id={messageId} values={{ count: displayCount, suffix }} />
        </Box>
    );
}
