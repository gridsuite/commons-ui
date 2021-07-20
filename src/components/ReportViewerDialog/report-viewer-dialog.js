/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogContent } from '@material-ui/core';
import ReportViewer from '../ReportViewer';

const useStyles = makeStyles({
    fullScreenIcon: {
        cursor: 'pointer',
    },
    paperFullWidth: {
        height: '100%',
    },
});

export default function ReportViewerDialog(props) {
    const classes = useStyles();
    const { title, open, onClose, jsonReport } = props;

    const [fullScreen, setFullScreen] = useState(false);

    const showFullScreen = () => {
        setFullScreen(true);
    };

    const hideFullScreen = () => {
        setFullScreen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            aria-labelledby="dialog-title-report"
            fullWidth={true}
            maxWidth="lg"
            classes={{
                paperFullWidth: classes.paperFullWidth,
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers={true}>
                <ReportViewer jsonReport={jsonReport} />
            </DialogContent>
            <DialogActions>
                {fullScreen ? (
                    <FullscreenExitIcon
                        onClick={hideFullScreen}
                        className={classes.fullScreenIcon}
                    />
                ) : (
                    <FullscreenIcon
                        onClick={showFullScreen}
                        className={classes.fullScreenIcon}
                    />
                )}
                <Button onClick={() => onClose()} variant="text">
                    <FormattedMessage id="report_viewer/close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
