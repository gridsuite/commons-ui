/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Avatar, Box, Container, Link, Typography } from '@mui/material';
import { LogoutOutlined as LogoutOutlinedIcon } from '@mui/icons-material';
import { Button } from '@design-system-rte/react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    paper: (theme) => ({
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }),
    avatar: (theme) => ({
        margin: theme.spacing(1),
        backgroundColor: theme.palette.error.main,
    }),
} as const satisfies MuiStyles;

export interface LogoutProps {
    onLogoutClick: () => void;
    disabled: boolean;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link color="inherit" href="#">
                GridSuite
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}

export function Logout({ onLogoutClick, disabled }: LogoutProps) {
    const intl = useIntl();
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={styles.paper}>
                <Avatar sx={styles.avatar}>
                    <LogoutOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <FormattedMessage id="login/logout" defaultMessage="logout" /> ?
                </Typography>

                <Button
                    label={intl.formatMessage({ id: 'login/logout' })}
                    disabled={disabled}
                    variant="primary"
                    onClick={onLogoutClick}
                />
            </Box>
            <Box mt={2}>
                <Copyright />
            </Box>
        </Container>
    );
}
