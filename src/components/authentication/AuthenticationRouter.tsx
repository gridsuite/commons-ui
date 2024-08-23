/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, useCallback } from 'react';
import { Location, Navigate, NavigateFunction, Route, Routes } from 'react-router-dom';
import { Alert, AlertTitle, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { UserManager } from 'oidc-client';
import { SignInCallbackHandler } from '../signInCallbackHandler';
import { SilentRenewCallbackHandler } from '../silentRenewCallbackHandler';
import Login from './Login';
import Logout from './Logout';

import { AuthenticationActions } from '../../redux/actions/authActions';
import { handleSigninCallback, handleSilentRenewCallback, login, logout } from './utils/authService';

export type AuthenticationRouterErrorState = {
    userName?: string;
    userValidationError?: { error: Error };
    logoutError?: { error: Error };
    unauthorizedUserInfo?: string;
};

export type UserManagerState = {
    instance: UserManager | null;
    error: string | null;
};

export interface AuthenticationRouterProps {
    userManager: UserManagerState;
    signInCallbackError: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showAuthenticationRouterLogin: boolean;
    dispatch: Dispatch<AuthenticationActions>;
    navigate: NavigateFunction;
    location: Location;
}

function AuthenticationRouter({
    userManager,
    signInCallbackError,
    authenticationRouterError,
    showAuthenticationRouterLogin,
    dispatch,
    navigate,
    location,
}: Readonly<AuthenticationRouterProps>) {
    const handleSigninCallbackClosure = useCallback(() => {
        if (userManager.instance != null) {
            handleSigninCallback(dispatch, navigate, userManager.instance);
        }
    }, [dispatch, navigate, userManager.instance]);
    const handleSilentRenewCallbackClosure = useCallback(() => {
        if (userManager.instance != null) {
            handleSilentRenewCallback(userManager.instance);
        }
    }, [userManager.instance]);
    return (
        <Grid container alignContent="center" alignItems="center" direction="column">
            {userManager.error !== null && <h1>Error : Getting userManager; {userManager.error}</h1>}
            {signInCallbackError !== null && (
                <h1>
                    Error : SignIn Callback Error;
                    {signInCallbackError.message}
                </h1>
            )}
            <Routes>
                <Route
                    path="sign-in-callback"
                    element={
                        <SignInCallbackHandler
                            userManager={userManager.instance}
                            handleSignInCallback={handleSigninCallbackClosure}
                        />
                    }
                />
                <Route
                    path="silent-renew-callback"
                    element={
                        <SilentRenewCallbackHandler
                            userManager={userManager.instance}
                            handleSilentRenewCallback={handleSilentRenewCallbackClosure}
                        />
                    }
                />
                <Route path="logout-callback" element={<Navigate to="/" />} />
                <Route
                    path="*"
                    element={
                        showAuthenticationRouterLogin &&
                        authenticationRouterError == null && (
                            <Login
                                disabled={userManager.instance === null}
                                onLoginClick={() => login(location, userManager.instance)}
                            />
                        )
                    }
                />
            </Routes>

            {authenticationRouterError !== null && (
                <>
                    <Grid item>
                        <Logout
                            disabled={userManager.instance === null}
                            onLogoutClick={() => logout(dispatch, userManager.instance)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {authenticationRouterError.logoutError != null && (
                            <Alert severity="error">
                                <AlertTitle>
                                    <FormattedMessage id="login/errorInLogout" />
                                </AlertTitle>
                                <FormattedMessage
                                    id="login/errorInLogoutMessage"
                                    values={{
                                        userName: authenticationRouterError.userName,
                                    }}
                                />
                                <p>{authenticationRouterError.logoutError.error.message}</p>
                            </Alert>
                        )}
                        {authenticationRouterError?.userValidationError != null && (
                            <Alert severity="error">
                                <AlertTitle>
                                    <FormattedMessage id="login/errorInUserValidation" />
                                </AlertTitle>
                                <FormattedMessage
                                    id="login/errorInUserValidationMessage"
                                    values={{
                                        userName: authenticationRouterError.userName,
                                    }}
                                />
                                <p>{authenticationRouterError.userValidationError.error.message}</p>
                            </Alert>
                        )}
                        {authenticationRouterError?.unauthorizedUserInfo != null && (
                            <Alert severity="info">
                                <AlertTitle>
                                    <FormattedMessage id="login/unauthorizedAccess" />
                                </AlertTitle>
                                <FormattedMessage
                                    id="login/unauthorizedAccessMessage"
                                    values={{
                                        userName: authenticationRouterError.userName,
                                    }}
                                />
                            </Alert>
                        )}
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default AuthenticationRouter;
