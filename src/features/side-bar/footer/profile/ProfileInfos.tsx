import { Box, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Person } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';

export function ProfileInfos({ userProfile }: Readonly<{ userProfile?: UserProfile }>) {
    return (
        <>
            <MenuItem
                sx={{
                    px: 2,
                    '&.Mui-disabled': {
                        opacity: 1,
                    },
                }}
                disabled
            >
                <Person fontSize="small" />
                <Box component="span">
                    {userProfile?.name} <br />
                    <Box component="span">{userProfile?.email}</Box>
                </Box>
            </MenuItem>
            <Divider />
        </>
    );
}
