/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage } from 'react-intl';
import { ITemporaryLimitReduction } from './columns-definitions';

type LimitReductionsLabelColumnProps = {
    limits: ITemporaryLimitReduction;
};

export function LimitReductionsLabelColumn({ limits }: Readonly<LimitReductionsLabelColumnProps>) {
    const highBound = Math.trunc(limits.limitDuration.lowBound / 60);
    const lowBound = Math.trunc(limits.limitDuration.highBound / 60);

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
