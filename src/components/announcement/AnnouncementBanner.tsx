/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'crypto';
import { type PropsWithChildren, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    AlertColor,
    type AlertProps,
    AlertTitle,
    Collapse,
    type SxProps,
    type Theme,
    Tooltip,
    useTheme,
} from '@mui/material';
import { Campaign as CampaignIcon } from '@mui/icons-material';
import type { User } from 'oidc-client';
import { AnnouncementSeverity } from '../../utils/types';

// Pick the same color than Snackbar
const snackbarInfo = '#2196f3';
const snackbarWarning = '#ff9800';
// const snackbarError = '#d32f2f';

const styles = {
    alert: (theme) => ({
        '&.MuiAlert-colorWarning': {
            color: theme.palette.getContrastText(snackbarWarning),
            backgroundColor: snackbarWarning,
        },
        '&.MuiAlert-colorInfo': {
            color: theme.palette.getContrastText(snackbarInfo),
            backgroundColor: snackbarInfo,
        },
    }),
} as const satisfies Record<string, SxProps<Theme>>;

export type AnnouncementBannerProps = PropsWithChildren<{
    // message only visible if user logged
    user?: User | {};
    // only to detect if new msg
    id: UUID;
    duration?: number;
    severity?: AnnouncementSeverity;
    title?: ReactNode;
    sx?: AlertProps['sx'];
}>;

const iconMapping: AlertProps['iconMapping'] = {
    info: <CampaignIcon />,
};

function convertSeverity(severity: AnnouncementSeverity): AlertColor | undefined {
    switch (severity) {
        case AnnouncementSeverity.INFO:
            return 'info';
        case AnnouncementSeverity.WARN:
            return 'warning';
        default:
            return undefined;
    }
}

export function AnnouncementBanner({
    user,
    id,
    severity = AnnouncementSeverity.INFO,
    title,
    children,
    duration,
    sx,
}: Readonly<AnnouncementBannerProps>) {
    const theme = useTheme();
    const [visible, setVisible] = useState(true);
    const removeBannerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(
        () => {
            // If the message to show changed
            setVisible(true);
            if (duration) {
                if (removeBannerRef.current) {
                    clearTimeout(removeBannerRef.current); // clear previous timer
                }
                removeBannerRef.current = setTimeout(() => {
                    setVisible(false);
                }, duration);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- we check msg id in cas of an announcement
        [id]
    );

    const handleClose = useCallback(() => {
        if (removeBannerRef.current) {
            clearTimeout(removeBannerRef.current);
            removeBannerRef.current = undefined;
        }
        setVisible(false);
    }, []);

    return (
        <Collapse in={user !== undefined && visible} sx={sx} style={{ margin: theme.spacing(1) }}>
            <Alert
                variant="filled"
                elevation={0}
                severity={convertSeverity(severity)}
                onClose={handleClose}
                iconMapping={iconMapping}
                hidden={!visible}
                className={title ? undefined : 'no-title'}
                sx={styles.alert}
            >
                {title && <AlertTitle>{title}</AlertTitle>}
                <Tooltip title={children} placement="bottom">
                    <span>{children}</span>
                </Tooltip>
            </Alert>
        </Collapse>
    );
}
