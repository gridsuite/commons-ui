import { Box, Divider, MenuItem } from '@mui/material';
import { Person } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';

export function ProfileInfos({ userProfile }: Readonly<{ userProfile?: UserProfile }>) {
    return (
        <>
            <MenuItem
                sx={{
                    px: 1.5,
                    '&.Mui-disabled': {
                        opacity: 1,
                    },
                }}
                disabled
            >
                <Person />
                <Box component="span" px={1}>
                    {userProfile?.name} <br />
                    <Box component="span">{userProfile?.email}</Box>
                </Box>
            </MenuItem>
            <Divider />
        </>
    );
}
