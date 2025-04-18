/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { Campaign as CampaignIcon, Close as CloseIcon, WarningAmber as WarningAmberIcon } from '@mui/icons-material';
import { mergeSx } from '../../utils';

const styles = {
    banner: (theme) => ({
        left: 0,
        width: '100%',
        color: 'black',
        padding: theme.spacing(1),
        textAlign: 'left',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }),
    warningBg: () => ({
        backgroundColor: '#f6b26b',
    }),
    infoBg: () => ({
        backgroundColor: '#90caf9',
    }),
    icon: (theme) => ({
        paddingRight: theme.spacing(0.75),
        marginTop: theme.spacing(0.5),
    }),
    warningIcon: () => ({
        color: 'red',
    }),
    infoIcon: () => ({
        color: 'darkblue',
    }),
    message: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    button: (theme) => ({
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
} as const satisfies Record<string, SxProps<Theme>>;

export interface MessageBannerProps {
    announcementInfos?: AnnouncementProps;
}

export type AnnouncementProps = {
    message: string;
    duration: number;
    severity: string;
};

export function MessageBanner({ children, announcementInfos }: PropsWithChildren<MessageBannerProps>) {
    const [visible, setVisible] = useState(true);
    const isInfo = useMemo(() => announcementInfos?.severity === 'INFO', [announcementInfos]);
    const removeBannerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (announcementInfos) {
            setVisible(true);
            if (announcementInfos?.duration) {
                removeBannerRef.current = setTimeout(() => {
                    setVisible(false);
                }, announcementInfos.duration);
            }
        }
    }, [announcementInfos]);

    const handleClose = useCallback(() => {
        clearTimeout(removeBannerRef.current);
        setVisible(false);
    }, []);

    return (
        visible && (
            <Box sx={mergeSx(styles.banner, isInfo ? styles.infoBg : styles.warningBg)}>
                {isInfo && (
                    <Box sx={mergeSx(styles.icon, styles.infoIcon)}>
                        <CampaignIcon />
                    </Box>
                )}
                {!isInfo && (
                    <Box sx={mergeSx(styles.icon, styles.warningIcon)}>
                        <WarningAmberIcon />
                    </Box>
                )}
                <Box sx={styles.message}>{children}</Box>
                <Box sx={styles.button} onClick={handleClose}>
                    <CloseIcon />
                </Box>
            </Box>
        )
    );
}
