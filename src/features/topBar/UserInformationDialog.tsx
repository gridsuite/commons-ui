/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { UserProfile } from 'oidc-client-ts';
import { Fragment, useEffect, useState } from 'react';
import { fetchUserDetails } from '../../services/userAdmin';
import { UserDetail } from '../../utils/types/types';
import type { MuiStyles } from '../../utils/styles';
import { CloseButton } from '../../components/ui/reactHookForm/utils/CloseButton';

const styles = {
    DialogTitle: { fontSize: '1.5rem' },
    DialogContent: { marginTop: '10px' },
    quotasBox: { marginTop: '60px' },
    quotasTypography: { marginTop: '30px', marginBottom: '25px', fontSize: '1.15rem' },
    usedTopography: { marginLeft: '15%' },
} as const satisfies MuiStyles;

interface UserInformationDialogProps {
    openDialog: boolean;
    onClose: () => void;
    userProfile: UserProfile | undefined;
}

function UserInformationDialog({ openDialog, userProfile, onClose }: UserInformationDialogProps) {
    const [userDetails, setUserDetails] = useState<UserDetail | undefined>(undefined);

    const getUserDetails = (userName: string) => {
        setUserDetails(undefined);
        fetchUserDetails(userName)
            .then((response: UserDetail) => {
                setUserDetails(response);
            })
            .catch((error) => {
                console.warn(`Could not fetch user information for ${userName}`, error);
            });
    };

    useEffect(() => {
        if (!openDialog || !userProfile?.sub) {
            setUserDetails(undefined);
            return;
        }
        getUserDetails(userProfile.sub);
    }, [openDialog, userProfile?.sub]);

    const rolesString = userProfile?.profile ?? '';
    const rolesList = rolesString ? rolesString.split('|').map((role) => role.trim()) : [];

    return (
        <Dialog open={openDialog && !!userProfile && !!userDetails} onClose={onClose}>
            <DialogTitle fontWeight="bold" sx={styles.DialogTitle}>
                <FormattedMessage id="user-information-dialog/title" />
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={styles.DialogContent}>
                    <Grid size={6}>
                        <Typography fontWeight="bold">
                            <FormattedMessage id="user-information-dialog/role" />
                        </Typography>
                    </Grid>
                    <Grid size={6}>
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

                    <Grid size={6}>
                        <Typography fontWeight="bold">
                            <FormattedMessage id="user-information-dialog/profile" />
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        {userDetails?.profileName === null ? (
                            <FormattedMessage id="user-information-dialog/no-profile" />
                        ) : (
                            <Typography>{userDetails?.profileName}</Typography>
                        )}
                    </Grid>
                </Grid>

                <Box mt={3} sx={styles.quotasBox}>
                    <Typography fontWeight="bold" sx={styles.quotasTypography}>
                        <FormattedMessage id="user-information-dialog/quotas" />
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-cases-or-studies" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>
                                {userDetails?.maxAllowedCases}
                                <Box component="span" sx={styles.usedTopography}>
                                    ( <FormattedMessage id="user-information-dialog/used" />:
                                    {` ${userDetails?.numberCasesUsed}`} )
                                </Box>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography fontWeight="bold" sx={styles.quotasTypography}>
                        <FormattedMessage id="user-information-dialog/quotas-per-study" />
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-builds-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedBuilds}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-loadflow-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedLoadflow}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-security-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedSecurity}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-sensitivity-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedSensitivity}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-shortCircuit-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedShortCircuit}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-voltageInit-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedVoltageInit}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-pccMin-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedPccMin}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-stateEstimation-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedStateEstimation}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-balanceAdjustement-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedBalanceAdjustement}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-dynamicSimulation-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedDynamicSimulation}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-dynamicSecurity-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedDynamicSecurity}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight="bold">
                                <FormattedMessage id="user-information-dialog/number-of-dynamicMargin-per-study" />
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>{userDetails?.maxAllowedDynamicMargin}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <CloseButton color="primary" onClick={onClose} autoFocus />
            </DialogActions>
        </Dialog>
    );
}

export default UserInformationDialog;
