/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableCell } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { CustomTooltip } from '../../../../components/ui/tooltip/CustomTooltip';
import {
    LimitReductionIColumnsDef,
    LIMIT_REDUCTIONS_FORM,
    VOLTAGE_LEVELS_FORM,
    ILimitReductionsByVoltageLevel,
} from './columns-definitions';
import { FloatInput, RawReadOnlyInput } from '../../../../components/ui';

const stickyFirstColBodySx = {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: 'background.paper',
};

export function LimitReductionTableCell({
    rowIndex,
    column,
    limits,
}: Readonly<{
    rowIndex: number;
    column: LimitReductionIColumnsDef;
    limits: ILimitReductionsByVoltageLevel[];
}>) {
    const isVoltageCol = column.dataKey === VOLTAGE_LEVELS_FORM;

    return isVoltageCol && limits[rowIndex] ? (
        <CustomTooltip
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
            <TableCell sx={{ fontWeight: 'bold', ...stickyFirstColBodySx }}>
                <RawReadOnlyInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
            </TableCell>
        </CustomTooltip>
    ) : (
        <TableCell sx={{ fontWeight: 'bold', p: 0.75, ...(isVoltageCol ? stickyFirstColBodySx : {}) }}>
            {isVoltageCol ? (
                <RawReadOnlyInput name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`} />
            ) : (
                <FloatInput
                    formProps={{
                        sx: {
                            '& .MuiInputBase-root': {
                                padding: 0,
                            },
                            '& .MuiInputBase-input': {
                                textAlign: 'right',
                            },
                        },
                    }}
                    name={`${LIMIT_REDUCTIONS_FORM}[${rowIndex}].${column.dataKey}`}
                />
            )}
        </TableCell>
    );
}
