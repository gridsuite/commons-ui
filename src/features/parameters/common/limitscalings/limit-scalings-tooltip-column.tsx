/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { ITemporaryLimitScaling } from './columns-definitions';

type LimitScalingsLabelColumnProps = {
    limits: ITemporaryLimitScaling;
};

export function LimitScalingsToolTipColumn({ limits }: Readonly<LimitScalingsLabelColumnProps>) {
    const intl = useIntl();
    const lowBound = `${Math.trunc(limits.limitDuration.lowBound / 60)} min`;
    const highBoundValue = Math.trunc(limits.limitDuration.highBound / 60);
    const highBound = highBoundValue === 0 ? '∞' : `${Math.trunc(limits.limitDuration.highBound / 60)} min`;
    const lowerBoundClosed = limits.limitDuration.lowClosed ? '[' : intl.formatMessage({ id: 'leftOpenBracket' });
    const higherBoundClosed =
        limits.limitDuration.highClosed || null ? ']' : intl.formatMessage({ id: 'rightOpenBracket' });
    return (
        <FormattedMessage
            id="LimitDurationInterval"
            values={{
                lowBound: `${lowBound}`,
                highBound: `${highBound}`,
                higherBoundClosed: `${higherBoundClosed}`,
                lowerBoundClosed: `${lowerBoundClosed}`,
            }}
        />
    );
}
