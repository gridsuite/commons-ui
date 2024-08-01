import { Grid } from '@mui/material';
import Logout from '../Login/Logout';
import ErrorInLogoutAlert from './alert/ErrorInLogoutAlert';
import ErrorInUserValidationAlert from './alert/ErrorInUserValidationAlert';
import UnauthorizedAccessAlert from './alert/UnauthorizedAccessAlert';
import {
    AuthenticationRouterErrorState,
    AuthenticationRouterProps,
    UserManagerState,
} from './authenticationType';
import { logout } from '../../utils/AuthService';

type AuthenticationRouterErrorDisplayProps = {
    errorState: AuthenticationRouterErrorState;
    instance: UserManagerState['instance'];
    dispatch: AuthenticationRouterProps['dispatch'];
};

function AuthenticationRouterErrorDisplay({
    errorState,
    instance,
    dispatch,
}: AuthenticationRouterErrorDisplayProps) {
    return (
        <>
            <Grid item>
                <Logout
                    disabled={instance === null}
                    onLogoutClick={() => logout(dispatch, instance)}
                />
            </Grid>
            <Grid item xs={4}>
                {errorState.logoutError && (
                    <ErrorInLogoutAlert
                        userName={errorState.userName}
                        message={errorState.logoutError.error.message}
                    />
                )}
                {errorState.userValidationError && (
                    <ErrorInUserValidationAlert
                        userName={errorState.userName}
                        message={errorState.userValidationError.error.message}
                    />
                )}
                {errorState.unauthorizedUserInfo && (
                    <UnauthorizedAccessAlert userName={errorState.userName} />
                )}
            </Grid>
        </>
    );
}
export default AuthenticationRouterErrorDisplay;
