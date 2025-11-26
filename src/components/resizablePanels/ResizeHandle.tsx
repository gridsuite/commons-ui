/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PanelResizeHandle } from 'react-resizable-panels';
import { DragIndicator } from '@mui/icons-material';
import { Theme, useTheme } from '@mui/material';

interface ResizeHandleProps {
    visible?: boolean;
    rotated?: boolean;
    style?: (theme: Theme) => React.CSSProperties;
}

const getStyles = (
    theme: Theme,
    visible: boolean,
    rotated: boolean,
    customStyle?: (theme: Theme) => React.CSSProperties
) => ({
    handle: {
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        borderLeft: rotated ? 'none' : `1px solid ${theme.palette.divider}`,
        borderRight: rotated ? 'none' : `1px solid ${theme.palette.divider}`,
        borderBottom: rotated ? `1px solid ${theme.palette.divider}` : 'none',
        borderTop: rotated ? `1px solid ${theme.palette.divider}` : 'none',
        justifyContent: 'center',
        ...(customStyle ? customStyle(theme) : {}),
    },
    icon: {
        transform: rotated ? 'rotate(90deg)' : 'none',
        transition: 'transform 0.2s',
        color: 'inherit',
        cursor: 'ns-resize',
    },
});

export function ResizeHandle({ visible = true, rotated = false, style }: Readonly<ResizeHandleProps>) {
    const theme = useTheme();
    const styles = getStyles(theme, visible, rotated, style);

    return (
        <PanelResizeHandle style={styles.handle}>
            <DragIndicator fontSize="small" style={styles.icon} />
        </PanelResizeHandle>
    );
}

export default ResizeHandle;
