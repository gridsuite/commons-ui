/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useState } from 'react';
import { Alert, Collapse, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    alert: {
        '& .MuiAlert-colorWarning': {
            backgroundColor: '#f6b26b',
            color: 'black',
            '& .MuiAlert-action .MuiIconButton-root:hover': {
                backgroundColor: '#e39648',
            },
            '& .MuiAlert-icon': {
                color: 'red',
            },
        },
        // MUI IconButton: square ripple
        '& .MuiAlert-action .MuiIconButton-root': {
            borderRadius: 1,
            '& .MuiTouchRipple-root .MuiTouchRipple-child ': {
                borderRadius: '8px',
            },
        },
    },
} as const satisfies MuiStyles;

export function DevModeBanner() {
    const [visible, setVisible] = useState(true);

    return (
        <Collapse in={visible} sx={styles.alert}>
            <Alert
                square
                severity="warning"
                variant="filled"
                elevation={0}
                onClose={useCallback(() => setVisible(false), [])}
            >
                <Typography variant="body1">
                    <FormattedMessage id="top-bar/developerModeWarning" defaultMessage="Developer mode" />
                </Typography>
            </Alert>
        </Collapse>
    );
}
