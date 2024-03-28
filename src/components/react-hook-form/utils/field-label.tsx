import { FormattedMessage } from 'react-intl';

type OwnProps = {
    label: string;
    optional?: boolean;
    values?: any;
};

const FieldLabel = ({ label, optional, values = undefined }: OwnProps) => {
    return (
        <>
            <FormattedMessage id={label} values={values} />
            {optional && <FormattedMessage id="Optional" />}
        </>
    );
};

export default FieldLabel;
