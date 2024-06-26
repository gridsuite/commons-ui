/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SxProps, Theme } from '@mui/material';

//TODO do we need to export this to clients (index.ts) ?

// like mui sx(slot)/class merging but simpler with less features
// TODO use their system ? But it's named unstable_composeClasses so not supported?
export const makeComposeClasses =
    (generateGlobalClass: (className: string) => string) =>
    (classes: Record<string, string>, ruleName: string) =>
        [generateGlobalClass(ruleName), classes[ruleName]]
            .filter((x) => x)
            .join(' ');

export const toNestedGlobalSelectors = (
    styles: object,
    generateGlobalClass: (className: string) => string
) =>
    Object.fromEntries(
        Object.entries(styles).map(([k, v]) => [
            `& .${generateGlobalClass(k)}`,
            v,
        ])
    );

const isSxProps = (sx: SxProps<Theme> | undefined): sx is SxProps => {
    return sx !== undefined;
};

// https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
// You cannot spread or concat directly because `SxProps` (typeof sx) can be an array. */
// same as [{}, ...(Array.isArray(sx) ? sx : [sx])]
export const mergeSx = (...allSx: (SxProps<Theme> | undefined)[]) =>
    allSx.filter(isSxProps).flat();
