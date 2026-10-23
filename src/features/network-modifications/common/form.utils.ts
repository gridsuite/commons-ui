/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FilledTextFieldProps, StandardTextFieldProps } from '@mui/material';

export const filledTextField = {
    variant: 'filled',
} satisfies FilledTextFieldProps;

export const standardTextField = {
    variant: 'standard',
} satisfies StandardTextFieldProps;

export const italicFontTextField = {
    style: { fontStyle: 'italic' },
};
