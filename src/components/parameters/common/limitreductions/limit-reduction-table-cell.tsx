/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableCell } from '@mui/material';
import { useIntl } from 'react-intl';
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
    const intl = useIntl();
    return column.dataKey === VOLTAGE_LEVELS_FORM ? (
        <TableCell
            sx={{ fontWeight: 'bold' }}
            title={intl.formatMessage(
                { id: 'VoltageRangeInterval' },
                {
                    lowBound: `${limits[rowIndex].voltageLevel.lowBound}`,
                    highBound: `${limits[rowIndex].voltageLevel.highBound}`,
                }
            )}
        >
            <RawReadOnlyInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
        </TableCell>
    ) : (
        <TableCell sx={{ fontWeight: 'bold' }}>
            <FloatInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
        </TableCell>
    );
}
