/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert, Dialog, Switch, Button, DialogActions, DialogContent, DialogTitle, Box, Theme } from '@mui/material';

const styles = {
    parameterName: (theme: Theme) => ({
        fontWeight: 'bold',
        marginTop: theme.spacing(1),
        flexGrow: 1,
    }),
    parameterLine: {
        display: 'flex',
    },
    switchLabel: (theme: Theme) => ({
        marginTop: theme.spacing(1),
        color: 'rgba(170, 170, 170, 0.87)',
    }),
};

interface UserSettingsDialogProps {
    openDialog: boolean;
    onClose: () => void;
    developerMode: boolean;
    onDeveloperModeClick?: (value: boolean) => void;
}

function UserSettingsDialog({ openDialog, onClose, developerMode, onDeveloperModeClick }: UserSettingsDialogProps) {
    const handleDeveloperModeClick = (value: boolean) => {
        if (onDeveloperModeClick) {
            onDeveloperModeClick(value);
        }
    };

    const handleClose = (_: SyntheticEvent, reason?: string) => {
        if (reason === 'backdropClick') {
            return;
        }
        onClose();
    };

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
                            checked={developerMode}
                            onChange={(_event, isChecked) => handleDeveloperModeClick(isChecked)}
                            value={developerMode}
                            inputProps={{ 'aria-label': 'developer mode checkbox' }}
                        />
                    </Box>
                    <Box sx={styles.switchLabel}>
                        {developerMode ? (
                            <FormattedMessage id="user-settings-dialog/active" />
                        ) : (
                            <FormattedMessage id="user-settings-dialog/inactive" />
                        )}
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
