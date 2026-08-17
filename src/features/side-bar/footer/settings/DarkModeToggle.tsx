import { CustomMenuItem, DARK_THEME, LIGHT_THEME } from '@gridsuite/commons-ui';
import { Stack, Switch, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { GsTheme } from '../../../../utils';

interface DarkModeToggleProps {
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => Promise<void>;
}

export function DarkModeToggle({ currentTheme, setTheme }: Readonly<DarkModeToggleProps>) {
    const isDarkMode = currentTheme === DARK_THEME;

    const toggleMode = (event: ChangeEvent<HTMLInputElement>) => {
        const targetModeValue = event.target.checked ? DARK_THEME : LIGHT_THEME;
        setTheme(targetModeValue) // TODO: improve error handling
            .catch((err) => console.error(err));
    };
    return (
        <CustomMenuItem sx={{ px: 2 }}>
            <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography>Mode sombre</Typography>
                <Switch checked={isDarkMode} onChange={toggleMode} />
            </Stack>
        </CustomMenuItem>
    );
}
