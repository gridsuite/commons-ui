import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type UnauthorizedAccessAlertProps = { userName?: string };
function UnauthorizedAccessAlert({ userName }: UnauthorizedAccessAlertProps) {
    return (
        <Alert severity="info">
            <AlertTitle>
                <FormattedMessage id="login/unauthorizedAccess" />
            </AlertTitle>
            <FormattedMessage
                id="login/unauthorizedAccessMessage"
                values={{ userName }}
            />
        </Alert>
    );
}
export default UnauthorizedAccessAlert;
