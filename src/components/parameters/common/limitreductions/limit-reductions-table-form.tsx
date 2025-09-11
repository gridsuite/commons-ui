/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    COLUMNS_DEFINITIONS_LIMIT_REDUCTIONS,
    ILimitReductionsByVoltageLevel,
    ITemporaryLimitReduction,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
} from './columns-definitions';
import { CustomVoltageLevelTable } from '../voltage-level-table';

const getLabelColumn = (limit: ITemporaryLimitReduction) => {
    const highBound = Math.trunc(limit.limitDuration.lowBound / 60);
    const lowBound = Math.trunc(limit.limitDuration.highBound / 60);

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
};

const getToolTipColumn = (limit: ITemporaryLimitReduction) => {
    const lowBound = `${Math.trunc(limit.limitDuration.lowBound / 60)} min`;
    const highBoundValue = Math.trunc(limit.limitDuration.highBound / 60);
    const highBound = highBoundValue === 0 ? '∞' : `${Math.trunc(limit.limitDuration.highBound / 60)} min`;
    const lowerBoundClosed = limit.limitDuration.lowClosed ? '[' : ']';
    const higherBoundClosed = limit.limitDuration.highClosed || null ? ']' : '[';
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
};

export function LimitReductionsTableForm({ limits }: Readonly<{ limits: ILimitReductionsByVoltageLevel[] }>) {
    const columnsDefinition = useMemo(() => {
        const columnsDef = COLUMNS_DEFINITIONS_LIMIT_REDUCTIONS.map((column) => ({
            ...column,
            label: column.label,
            tooltip: column.tooltip,
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
    }, [limits]);

    return (
        <CustomVoltageLevelTable
            formName={LIMIT_REDUCTIONS_FORM}
            columnsDefinition={columnsDefinition}
            tableHeight={450}
            limits={limits}
        />
    );
}
