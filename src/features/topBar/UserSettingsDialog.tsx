/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { type ChangeEvent, type SyntheticEvent, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch } from '@mui/material';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    parameterName: (theme) => ({
        fontWeight: 'bold',
        marginTop: theme.spacing(1),
        flexGrow: 1,
    }),
    parameterLine: {
        display: 'flex',
    },
} as const satisfies MuiStyles;

interface UserSettingsDialogProps {
    openDialog: boolean;
    onClose: () => void;
    developerMode?: boolean;
    onDeveloperModeClick?: (value: boolean) => void;
}

function UserSettingsDialog({ openDialog, onClose, developerMode, onDeveloperModeClick }: UserSettingsDialogProps) {
    const handleDeveloperModeClick = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onDeveloperModeClick?.(event.target.checked),
        [onDeveloperModeClick]
    );

    // TODO: there is no 2nd argument for button on-click
    const handleClose = useCallback(
        (_: SyntheticEvent, reason?: string) => {
            if (reason === 'backdropClick') {
                return;
            }
            onClose();
        },
        [onClose]
    );

    return (
        <Dialog fullWidth open={openDialog} onClose={handleClose}>
            <DialogTitle>
                <FormattedMessage id="user-settings-dialog/title" />
            </DialogTitle>
            <DialogContent>
                <Box sx={styles.parameterLine}>
                    <Box sx={styles.parameterName}>
                        <FormattedMessage id="user-settings-dialog/label-developer-mode" />
                    </Box>
                    <Box>
                        <Switch
                            checked={developerMode ?? false}
                            disabled={handleDeveloperModeClick === undefined}
                            onChange={handleDeveloperModeClick}
                            inputProps={{ 'aria-label': 'developer mode checkbox' }}
                        />
                    </Box>
                </Box>
                {developerMode && (
                    <Alert severity="warning">
                        <FormattedMessage id="user-settings-dialog/warning-developer-mode" />
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                    <FormattedMessage id="user-settings-dialog/close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserSettingsDialog;
