/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { CustomTooltip } from '../../../../components/ui/tooltip/CustomTooltip';
import { FloatInput } from '../../../../components/ui';

export interface ParameterFloatProps {
    name: string;
    label: string;
    style: any;
    adornment?: any;
    tooltip?: string;
    labelSize: number;
    inputSize: number;
}

export function ParameterFloat({
    name,
    label,
    style,
    adornment,
    tooltip,
    labelSize,
    inputSize,
}: Readonly<ParameterFloatProps>) {
    const content = (
        <Grid container direction="row" spacing={1} paddingTop={3}>
            <Grid size={labelSize} sx={style}>
                <FormattedMessage id={label} />
            </Grid>
            <Grid size={inputSize}>
                <FloatInput name={name} adornment={adornment} />
            </Grid>
        </Grid>
    );

    if (tooltip) {
        return <CustomTooltip title={<FormattedMessage id={tooltip} />}>{content}</CustomTooltip>;
    }
    return content;
}
