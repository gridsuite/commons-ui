import { FormattedMessage } from 'react-intl';
import { ITemporaryLimitReduction } from './columns-definitions';

export function LimitReductionsLabelColumn({ limitDuration }: ITemporaryLimitReduction) {
    const highBound = Math.trunc(limitDuration.lowBound / 60);
    const lowBound = Math.trunc(limitDuration.highBound / 60);

    if (lowBound === 0) {
        return <FormattedMessage id="LimitVoltageAfterIST" values={{ highBound: `${highBound}` }} />;
    }

    return (
        <FormattedMessage
            id="LimitVoltageInterval"
            values={{
                lowBound: `${lowBound}`,
                highBound: `${highBound}`,
            }}
        />
    );
}