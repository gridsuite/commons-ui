/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { AuthenticationRouterErrorState, AuthenticationRouterProps, UserManagerState } from './authenticationType';
import Logout from './Logout';
import { logout } from './utils';
import { ErrorInLogoutAlert, ErrorInUserValidationAlert, UnauthorizedAccessAlert } from './alert';

type AuthenticationRouterErrorDisplayProps = {
    errorState: AuthenticationRouterErrorState;
    instance: UserManagerState['instance'];
    dispatch: AuthenticationRouterProps['dispatch'];
};

function AuthenticationRouterErrorDisplay({ errorState, instance, dispatch }: AuthenticationRouterErrorDisplayProps) {
    return (
        <>
            <Grid item>
                <Logout disabled={instance === null} onLogoutClick={() => logout(dispatch, instance)} />
            </Grid>
            <Grid item xs={4}>
                {errorState.logoutError && (
                    <ErrorInLogoutAlert userName={errorState.userName} message={errorState.logoutError.error.message} />
                )}
                {errorState.userValidationError && (
                    <ErrorInUserValidationAlert
                        userName={errorState.userName}
                        message={errorState.userValidationError.error.message}
                    />
                )}
                {errorState.unauthorizedUserInfo && <UnauthorizedAccessAlert userName={errorState.userName} />}
            </Grid>
        </>
    );
}
export default AuthenticationRouterErrorDisplay;
