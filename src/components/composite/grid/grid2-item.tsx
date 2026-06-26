/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, ReactNode } from 'react';
import { Grid2 as Grid, Grid2Props } from '@mui/material';
import { CustomTooltip } from '../../ui/tooltip';
import { mergeSx } from '../../../utils';

export interface Grid2ItemProps extends PropsWithChildren {
    size?: Grid2Props['size'];
    alignItem?: string;
    tooltip?: ReactNode;
    sx?: Grid2Props['sx'];
}

export function Grid2Item({ children, size = 6, alignItem = 'flex-start', tooltip, sx }: Readonly<Grid2ItemProps>) {
    return (
        <Grid size={size} sx={mergeSx({ alignItems: alignItem }, sx)}>
            {children &&
                (tooltip ? (
                    <CustomTooltip title={tooltip}>
                        <div>{children}</div>
                    </CustomTooltip>
                ) : (
                    children
                ))}
        </Grid>
    );
}
