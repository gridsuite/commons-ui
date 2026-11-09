/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    COLUMNS_DEFINITIONS_LIMIT_SCALINGS,
    ILimitScalingsByVoltageLevel,
    LIMIT_DURATION_FORM,
    LIMIT_SCALINGS_FORM,
} from './columns-definitions';
import { CustomVoltageLevelTable } from '../voltage-level-table';
import { LimitScalingsToolTipColumn } from './limit-scalings-tooltip-column';
import { LimitScalingsLabelColumn } from './limit-scalings-label-column';

export function LimitScalingsTableForm({ limits }: Readonly<{ limits: ILimitScalingsByVoltageLevel[] }>) {
    const columnsDefinition = useMemo(() => {
        const columnsDef = COLUMNS_DEFINITIONS_LIMIT_SCALINGS.map((column) => ({
            ...column,
            label: <FormattedMessage id={column.label as string} />,
            tooltip: <FormattedMessage id={column.tooltip as string} />,
        }));

        if (limits !== null && limits.length > 0) {
            limits[0].temporaryLimitReductions.forEach((tlimit, index) => {
                columnsDef.push({
                    label: <LimitScalingsLabelColumn limits={tlimit} />,
                    dataKey: LIMIT_DURATION_FORM + index,
                    tooltip: <LimitScalingsToolTipColumn limits={tlimit} />,
                });
            });
        }

        return columnsDef;
    }, [limits]);

    return (
        <CustomVoltageLevelTable
            formName={LIMIT_SCALINGS_FORM}
            columnsDefinition={columnsDefinition}
            tableHeight={450}
            tableMinWidth={600}
            limits={limits}
        />
    );
}
