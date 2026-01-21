/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable import-x/no-extraneous-dependencies */

import { useState } from 'react';
import { MoreVert as ResizePanelHandleIcon } from '@mui/icons-material';
import { ResizableBox } from 'react-resizable';
import { useWindowWidth } from '@react-hook/window-size';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/material';
import { mergeSx } from '../../src/utils/styles';

const styles = {
    panel: {
        position: 'relative',
        boxSizing: 'border-box',
    },
    innerResizablePanel: {
        flex: 'auto',
        height: '100%',
    },
    resizePanelHandle: (theme) => ({
        // This panel's right border looks like the panel's handle but is only a decoy.
        // The true handle is wider than it seems, to be easier to grip, and is invisible.
        borderRightColor: theme.palette.action.disabled,
        borderRightStyle: 'solid',
        borderRightWidth: theme.spacing(0.5),
        '& .react-resizable-handle': {
            position: 'absolute',
            width: theme.spacing(1),
            height: '100%',
            top: 0,
            right: `-${theme.spacing(0.75)}`,
            cursor: 'col-resize',
            backgroundColor: 'rgba(0, 0, 0, 0)', // The handle is invisible (alpha = 0)
            zIndex: 5,
        },
    }),
    resizePanelHandleIcon: (theme) => ({
        bottom: '50%',
        right: theme.spacing(-1.75),
        position: 'absolute',
        color: theme.palette.text.disabled,
        transform: 'scale(0.5, 1.5)',
    }),
};

// TODO can we avoid to define a component just to add sx support ?
const ResizableBoxSx = styled(ResizableBox)({});

function RightResizableBox(props) {
    const { children, disableResize = false, fullscreen = false, hide = false } = props;
    const windowWidth = useWindowWidth();

    const [resizedTreePercentage, setResizedTreePercentage] = useState(0.5);

    const updateResizedTreePercentage = (treePanelWidth, totalWidth) => {
        if (totalWidth > 0) {
            const newPercentage = treePanelWidth / totalWidth;
            setResizedTreePercentage(newPercentage);
        }
    };

    const onResize = (event, { size }) => {
        updateResizedTreePercentage(size.width, windowWidth);
    };

    return (
        <ResizableBoxSx
            style={{ display: hide ? 'none' : undefined }}
            width={fullscreen ? windowWidth : windowWidth * resizedTreePercentage}
            sx={mergeSx(styles.panel, !disableResize && styles.resizePanelHandle)}
            resizeHandles={['e']}
            axis={disableResize ? 'none' : 'x'}
            onResize={onResize}
        >
            <Box sx={styles.innerResizablePanel}>
                {children}
                <ResizePanelHandleIcon sx={styles.resizePanelHandleIcon} />
            </Box>
        </ResizableBoxSx>
    );
}

RightResizableBox.propTypes = {
    children: PropTypes.node,
    disableResize: PropTypes.bool,
    fullscreen: PropTypes.bool,
    hide: PropTypes.bool,
};

export default RightResizableBox;
