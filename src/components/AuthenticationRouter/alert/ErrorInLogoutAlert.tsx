import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type ErrorInLogoutAlertProps = {
    userName?: string;
    message: string;
};
function ErrorInLogoutAlert({ userName, message }: ErrorInLogoutAlertProps) {
    return (
        <Alert severity="error">
            <AlertTitle>
                <FormattedMessage id="login/errorInLogout" />
            </AlertTitle>
            <FormattedMessage
                id="login/errorInLogoutMessage"
                values={{ userName }}
            />
            <p>{message}</p>
        </Alert>
    );
}

export default ErrorInLogoutAlert;
