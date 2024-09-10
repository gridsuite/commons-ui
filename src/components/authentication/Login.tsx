/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Avatar, Box, Button, Container, Link, Theme, Typography } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

const styles = {
    paper: (theme: Theme) => ({
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }),
    avatar: (theme: Theme) => ({
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }),
    submit: (theme: Theme) => ({
        margin: theme.spacing(3, 0, 2),
        borderRadius: '30px',
    }),
    logo: {
        width: 64,
        height: 64,
    },
};

export interface LoginProps {
    onLoginClick: () => void;
    disabled: boolean;
}

function Login({ onLoginClick, disabled }: LoginProps) {
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={styles.paper}>
                <Avatar sx={styles.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <FormattedMessage id="login/login" defaultMessage="login" /> ?
                </Typography>

                <Button disabled={disabled} fullWidth variant="contained" sx={styles.submit} onClick={onLoginClick}>
                    <FormattedMessage id="login/connection" defaultMessage="connection" />
                </Button>
            </Box>
            <Box mt={2}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link color="inherit" href="#">
                        GridSuite
                    </Link>{' '}
                    {new Date().getFullYear()}.
                </Typography>
            </Box>
        </Container>
    );
}

export default Login;
