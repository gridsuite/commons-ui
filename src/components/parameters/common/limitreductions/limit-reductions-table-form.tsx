/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
    COLUMNS_DEFINITIONS_LIMIT_REDUCTIONS,
    ILimitReductionsByVoltageLevel,
    ITemporaryLimitReduction,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
} from './columns-definitions';
import { CustomVoltageLevelTable } from '../voltage-level-table';

export function LimitReductionsTableForm({ limits }: Readonly<{ limits: ILimitReductionsByVoltageLevel[] }>) {
    const intl = useIntl();

    const getLabelColumn = useCallback(
        (limit: ITemporaryLimitReduction) => {
            const highBound = Math.trunc(limit.limitDuration.lowBound / 60);
            const lowBound = Math.trunc(limit.limitDuration.highBound / 60);

            if (lowBound === 0) {
                return intl.formatMessage({ id: 'LimitVoltageAfterIST' }, { highBound: `${highBound}` });
            }

            return intl.formatMessage(
                { id: 'LimitVoltageInterval' },
                {
                    lowBound: `${lowBound}`,
                    highBound: `${highBound}`,
                }
            );
        },
        [intl]
    );

    const getToolTipColumn = useCallback(
        (limit: ITemporaryLimitReduction) => {
            const lowBound = `${Math.trunc(limit.limitDuration.lowBound / 60)} min`;
            const highBoundValue = Math.trunc(limit.limitDuration.highBound / 60);
            const highBound = highBoundValue === 0 ? '∞' : `${Math.trunc(limit.limitDuration.highBound / 60)} min`;
            const lowerBoundClosed = limit.limitDuration.lowClosed ? '[' : ']';
            const higherBoundClosed = limit.limitDuration.highClosed || null ? ']' : '[';
            return intl.formatMessage(
                { id: 'LimitDurationInterval' },
                {
                    lowBound: `${lowBound}`,
                    highBound: `${highBound}`,
                    higherBoundClosed: `${higherBoundClosed}`,
                    lowerBoundClosed: `${lowerBoundClosed}`,
                }
            );
        },
        [intl]
    );

    const columnsDefinition = useMemo(() => {
        const columnsDef = COLUMNS_DEFINITIONS_LIMIT_REDUCTIONS.map((column) => ({
            ...column,
            label: intl.formatMessage({ id: column.label }),
            tooltip: intl.formatMessage({ id: column.tooltip }),
        }));

        if (limits !== null && limits.length > 0) {
            limits[0].temporaryLimitReductions.forEach((tlimit, index) => {
                columnsDef.push({
                    label: getLabelColumn(tlimit),
                    dataKey: LIMIT_DURATION_FORM + index,
                    tooltip: getToolTipColumn(tlimit),
                });
            });
        }

        return columnsDef;
    }, [intl, limits, getLabelColumn, getToolTipColumn]);

    return (
        <CustomVoltageLevelTable
            formName={LIMIT_REDUCTIONS_FORM}
            columnsDefinition={columnsDefinition}
            tableHeight={450}
            limits={limits}
        />
    );
}
