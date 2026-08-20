/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SxProps, Typography } from '@mui/material';
import { mergeSx, MuiStyles } from '../../../utils';

const styles = {
    separator: (theme) => ({
        fontWeight: 'bold',
        fontSize: '1rem',
        width: '100%',
        marginTop: theme.spacing(1),
    }),
} as const satisfies MuiStyles;

type SeparatorCellRendererProps = {
    value: string;
    sx?: SxProps;
};

export function SeparatorCellRenderer({ value, sx }: Readonly<SeparatorCellRendererProps>) {
    return (
        <Typography variant="subtitle1" color="primary" sx={mergeSx(styles.separator, sx)}>
            {value}
        </Typography>
    );
}
