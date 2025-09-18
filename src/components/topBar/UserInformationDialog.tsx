/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { User } from 'oidc-client';
import { Fragment, useEffect, useState } from 'react';
import { CancelButton } from '../inputs/reactHookForm/utils/CancelButton';
import { fetchUserDetails } from '../../services/userAdmin';
import { UserDetail } from '../../utils/types/types';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    DialogTitle: { fontSize: '1.5rem' },
    DialogContent: { marginTop: '10px' },
    quotasBox: { marginTop: '60px' },
    quotasTopography: { marginTop: '30px', marginBottom: '25px', fontSize: '1.15rem' },
    usedTopography: { marginLeft: '15%' },
} as const satisfies MuiStyles;

interface UserInformationDialogProps {
    openDialog: boolean;
    onClose: () => void;
    user: User | undefined;
}

function UserInformationDialog({ openDialog, user, onClose }: UserInformationDialogProps) {
    const [userDetails, setUserDetails] = useState<UserDetail | undefined>(undefined);

    const getUserDetails = (userName: string) => {
        fetchUserDetails(userName)
            .then((response: UserDetail) => {
                setUserDetails(response);
            })
            .catch((error) => {
                console.warn(`Could not fetch user information for ${userName}`, error);
            });
    };

    useEffect(() => {
        if (openDialog && user?.profile.sub) {
            getUserDetails(user?.profile.sub);
        }
    }, [openDialog, user]);

    const rolesString = user?.profile?.profile ?? '';
    const rolesList = rolesString ? rolesString.split('|').map((role) => role.trim()) : [];

    return (
        <Dialog open={openDialog && !!user && !!userDetails} onClose={onClose}>
            <DialogTitle fontWeight="bold" sx={styles.DialogTitle}>
                <FormattedMessage id="user-information-dialog/title" />
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={styles.DialogContent}>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">
                            <FormattedMessage id="user-information-dialog/role" />
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        {rolesList.length > 0 ? (
                            <Typography>
                                {rolesList.map((role, index) => (
                                    <Fragment key={role}>
                                        {index > 0 && ' | '}
                                        <FormattedMessage
                                            id={`user-information-dialog/${role}`}
                                            defaultMessage={role}
                                        />
                                    </Fragment>
                                ))}
                            </Typography>
                        ) : (
                            <Typography>
                                <FormattedMessage id="user-information-dialog/no-roles" />
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        <Typography fontWeight="bold">
                            <FormattedMessage id="user-information-dialog/profile" />
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        {userDetails?.profileName === null ? (
                            <FormattedMessage id="user-information-dialog/no-profile" />
                        ) : (
                            <Typography>{userDetails?.profileName}</Typography>
                        )}
                    </Grid>
                </Grid>

                <Box mt={3} sx={styles.quotasBox}>
                    <Typography fontWeight="bold" sx={styles.quotasTopography}>
                        <FormattedMessage id="user-information-dialog/quotas" />
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-cases-or-studies" />
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                {userDetails?.maxAllowedCases}
                                <Box component="span" sx={styles.usedTopography}>
                                    ( <FormattedMessage id="user-information-dialog/used" />:
                                    {` ${userDetails?.numberCasesUsed}`} )
                                </Box>
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-builds-per-study" />
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>{userDetails?.maxAllowedBuilds}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <CancelButton color="primary" onClick={onClose} />
            </DialogActions>
        </Dialog>
    );
}

export default UserInformationDialog;
