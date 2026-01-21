/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableCell, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
    LimitReductionIColumnsDef,
    LIMIT_REDUCTIONS_FORM,
    VOLTAGE_LEVELS_FORM,
    ILimitReductionsByVoltageLevel,
} from './columns-definitions';
import { FloatInput, RawReadOnlyInput } from '../../../inputs';

export function LimitReductionTableCell({
    rowIndex,
    column,
    limits,
}: Readonly<{
    rowIndex: number;
    column: LimitReductionIColumnsDef;
    limits: ILimitReductionsByVoltageLevel[];
}>) {
    return column.dataKey === VOLTAGE_LEVELS_FORM && limits[rowIndex] ? (
        <Tooltip
            title={
                <FormattedMessage
                    id="VoltageRangeInterval"
                    values={{
                        lowBound: `${limits[rowIndex].voltageLevel.lowBound}`,
                        highBound: `${limits[rowIndex].voltageLevel.highBound}`,
                    }}
                />
            }
        >
            <TableCell sx={{ fontWeight: 'bold' }}>
                <RawReadOnlyInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
            </TableCell>
        </Tooltip>
    ) : (
        <TableCell sx={{ fontWeight: 'bold' }}>
            {column.dataKey === VOLTAGE_LEVELS_FORM ? (
                <RawReadOnlyInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
            ) : (
                <FloatInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
            )}
        </TableCell>
    );
}
