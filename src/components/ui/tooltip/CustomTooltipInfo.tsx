/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SvgIconOwnProps, TooltipProps } from '@mui/material';
import { Info } from '@mui/icons-material';
import { CustomTooltip } from './CustomTooltip';

export type CustomTooltipInfoProps = {
    tooltipProps: Omit<TooltipProps, 'children'>;
    infoProps?: SvgIconOwnProps;
    dataTestId?: string;
};

export function CustomTooltipInfo({ tooltipProps, infoProps, dataTestId }: Readonly<CustomTooltipInfoProps>) {
    return (
        <CustomTooltip placement="right" {...tooltipProps}>
            <Info fontSize="small" color="info" {...infoProps} data-testid={dataTestId} />
        </CustomTooltip>
    );
}
