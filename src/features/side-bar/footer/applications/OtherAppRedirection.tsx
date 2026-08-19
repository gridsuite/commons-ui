import { Box, Stack, Typography } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { CustomMenuItem } from '../../../../components';
import { Metadata } from '../../../../utils';

interface OtherAppRedirectionProps {
    app: Metadata;
}

export function OtherAppRedirection({ app }: Readonly<OtherAppRedirectionProps>) {
    return (
        <CustomMenuItem sx={{ px: 2 }}>
            <Box
                sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                }}
                component="a"
                href={app.url.toString()}
                target="_blank"
                rel="noopener noreferrer"
                width="100%"
            >
                <Stack
                    spacing={2}
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography>
                        Grid
                        <Box
                            component="span"
                            style={{
                                color: app.appColor ?? 'grey',
                                fontWeight: 'bold',
                            }}
                        >
                            {app.name}
                        </Box>
                    </Typography>
                    <OpenInNew sx={{ display: 'block' }} />
                </Stack>
            </Box>
        </CustomMenuItem>
    );
}
