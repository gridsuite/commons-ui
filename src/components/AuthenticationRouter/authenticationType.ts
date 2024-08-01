import { UserManager } from 'oidc-client';
import { Dispatch } from 'react';
import { NavigateFunction, Location } from 'react-router-dom';
import { AuthenticationActions } from '../../redux/authActions';

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
