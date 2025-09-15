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

export function LimitReductionsToolTipColumn({ limits }: Readonly<LimitReductionsLabelColumnProps>) {
    const lowBound = `${Math.trunc(limits.limitDuration.lowBound / 60)} min`;
    const highBoundValue = Math.trunc(limits.limitDuration.highBound / 60);
    const highBound = highBoundValue === 0 ? '∞' : `${Math.trunc(limits.limitDuration.highBound / 60)} min`;
    const lowerBoundClosed = limits.limitDuration.lowClosed ? '[' : ']';
    const higherBoundClosed = limits.limitDuration.highClosed || null ? ']' : '[';
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
