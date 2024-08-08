/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Grid } from '@mui/material';
import SignInCallbackHandler from '../SignInCallbackHandler';
import { handleSigninCallback, handleSilentRenewCallback, login } from '../../utils/AuthService';
import SilentRenewCallbackHandler from '../SilentRenewCallbackHandler';
import Login from '../Login';
import { AuthenticationRouterProps } from './authenticationType';
import AuthenticationRouterErrorDisplay from './AuthenticationRouterErrorDisplay';

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
        if (userManager.instance) {
            handleSigninCallback(dispatch, navigate, userManager.instance);
        }
    }, [dispatch, navigate, userManager.instance]);
    const handleSilentRenewCallbackClosure = useCallback(() => {
        if (userManager.instance) {
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
                <AuthenticationRouterErrorDisplay
                    dispatch={dispatch}
                    instance={userManager.instance}
                    errorState={authenticationRouterError}
                />
            )}
        </Grid>
    );
}

export default AuthenticationRouter;
