/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IntlShape } from 'react-intl';
import { useCallback, useMemo } from 'react';

export const useIntlResultStatusMessages = (
    intl: IntlShape,
    hasNoData: boolean = false,
    hasFilters: boolean = false
) => {
    const specificMessage = useCallback(():
        { noData: string } | { noLimitViolation: string } | { fetching: string } => {
        if (hasNoData) {
            return {
                noData: intl.formatMessage({ id: !hasFilters ? 'grid.noRowsToShow' : 'grid.noMatchedFilters' }),
            };
        }
        return { noLimitViolation: intl.formatMessage({ id: 'grid.noLimitViolation' }) };
    }, [intl, hasNoData, hasFilters]);

    return useMemo(() => {
        return {
            noCalculation: intl.formatMessage({ id: 'grid.noCalculation' }),
            ...specificMessage(),
            running: intl.formatMessage({ id: 'grid.running' }),
            failed: intl.formatMessage({ id: 'grid.failed' }),
            fetching: intl.formatMessage({ id: 'LoadingRemoteData' }),
        };
    }, [intl, specificMessage]);
};
