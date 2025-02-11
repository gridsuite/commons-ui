/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { type ReactNode, useState } from 'react';
import { Box, type Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const styles = {
    banner: (theme: Theme): SystemStyleObject<Theme> => ({
        left: 0,
        width: '100%',
        backgroundColor: '#f6b26b',
        color: 'black',
        padding: theme.spacing(1),
        textAlign: 'left',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }),
    icon: (theme: Theme): SystemStyleObject<Theme> => ({
        paddingRight: theme.spacing(0.75),
        color: 'red',
        marginTop: theme.spacing(0.5),
    }),
    message: {
        flexGrow: 1,
    },
    button: (theme: Theme): SystemStyleObject<Theme> => ({
        backgroundColor: '#f6b26b',
        border: 'none',
        cursor: 'pointer',
        borderRadius: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        '&:hover': {
            backgroundColor: '#e39648',
        },
        '& svg': {
            width: '100%',
            height: '100%',
        },
    }),
};

export interface MessageBannerProps {
    children: ReactNode;
}

function MessageBanner({ children }: MessageBannerProps) {
    const [visible, setVisible] = useState(true);

    return (
        visible && (
            <Box sx={styles.banner}>
                <Box sx={styles.icon}>
                    <WarningAmberIcon />
                </Box>
                <Box sx={styles.message}>{children}</Box>
                <Box sx={styles.button} onClick={() => setVisible(false)}>
                    <CloseIcon />
                </Box>
            </Box>
        )
    );
}

export default MessageBanner;
