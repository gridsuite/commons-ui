/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// used to customize mui theme
// https://mui.com/material-ui/customization/theming/#typescript
declare module '@mui/material/styles/createTheme' {
    interface Theme {
        aggrid: {
            theme: string;
            highlightColor: string;
            valueChangeHighlightBackgroundColor: string;
            overlay: {
                background: string;
            };
        };
    }
}
