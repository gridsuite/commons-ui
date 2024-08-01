import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type ErrorInUserValidationAlertProps = {
    userName?: string;
    message: string;
};
function ErrorInUserValidationAlert({
    userName,
    message,
}: ErrorInUserValidationAlertProps) {
    return (
        <Alert severity="error">
            <AlertTitle>
                <FormattedMessage id="login/errorInUserValidation" />
            </AlertTitle>
            <FormattedMessage
                id="login/errorInUserValidationMessage"
                values={{ userName }}
            />
            <p>{message}</p>
        </Alert>
    );
}
export default ErrorInUserValidationAlert;
