/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage } from 'react-intl';
import { ITemporaryLimitReduction } from './columns-definitions';

export function LimitReductionsToolTipColumn({ limitDuration }: ITemporaryLimitReduction) {
    const lowBound = `${Math.trunc(limitDuration.lowBound / 60)} min`;
    const highBoundValue = Math.trunc(limitDuration.highBound / 60);
    const highBound = highBoundValue === 0 ? '∞' : `${Math.trunc(limitDuration.highBound / 60)} min`;
    const lowerBoundClosed = limitDuration.lowClosed ? '[' : ']';
    const higherBoundClosed = limitDuration.highClosed || null ? ']' : '[';
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
