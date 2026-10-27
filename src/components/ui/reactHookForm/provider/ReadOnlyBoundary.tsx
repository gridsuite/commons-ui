/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, SyntheticEvent, useCallback } from 'react';
import { Box } from '@mui/material';

export type ReadOnlyBoundaryProps = PropsWithChildren<{
    readOnly?: boolean;
}>;

/**
 * Makes an entire subtree "view only", regardless of what's inside it.
 */
export function ReadOnlyBoundary({ readOnly = false, children }: Readonly<ReadOnlyBoundaryProps>) {
    const blockInteraction = useCallback(
        (event: SyntheticEvent) => {
            if (readOnly) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        [readOnly]
    );

    return (
        <Box
            aria-disabled={readOnly}
            onClickCapture={blockInteraction}
            onMouseDownCapture={blockInteraction}
            onKeyDownCapture={blockInteraction}
            sx={
                readOnly
                    ? {
                          pointerEvents: 'none',
                          cursor: 'not-allowed',
                      }
                    : undefined
            }
        >
            {children}
        </Box>
    );
}
