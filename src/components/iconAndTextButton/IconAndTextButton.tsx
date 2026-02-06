/*
 * Copyright © 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Button, ButtonProps } from '@mui/material';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import { mergeSx } from '../../utils';

const styles = {
    button: {
        textTransform: 'none',
    },
} as const;

export function IconAndTextButton(props: Readonly<ButtonProps>) {
    const { children, sx, startIcon, ...others } = props;
    return (
        <Button
            component="label"
            variant="contained"
            // to point out to the client to use an icon here defining startIcon prop
            startIcon={startIcon ?? <NotListedLocationIcon />}
            sx={mergeSx(styles.button, sx)}
            {...others}
        >
            {children}
        </Button>
    );
}
