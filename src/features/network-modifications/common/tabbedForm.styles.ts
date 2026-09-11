/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { MuiStyles } from '../../../utils/styles';

/**
 * Layout of a modification form made of a fixed header, a fixed tabs bar and a scrollable content:
 *
 * <Stack spacing={2} sx={tabbedFormStyles.container}>
 *     <SomeDialogHeader />
 *     <SomeDialogTabs />
 *     <Box sx={tabbedFormStyles.scrollableContent}>
 *         <SomeDialogTabsContent />
 *     </Box>
 * </Stack>
 *
 * The container fills its parent only when the host dialog gives it a determinate height
 * (`unscrollableFullHeight` on `CustomMuiDialog`, or a fixed paper height). Otherwise `height: 100%`
 * resolves to `auto` and the form keeps growing with its content.
 */
export const tabbedFormStyles = {
    container: {
        height: '100%',
    },
    scrollableContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 3,
    },
} as const satisfies MuiStyles;
