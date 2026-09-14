/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack, Typography } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { CustomMenuItem } from '../../../../components';
import { Metadata } from '../../../../utils';
import { submenuFooterStyle } from '../common/submenu-footer.style';

interface OtherAppRedirectionProps {
    app: Metadata;
}

export function OtherAppRedirection({ app }: Readonly<OtherAppRedirectionProps>) {
    return (
        <CustomMenuItem sx={submenuFooterStyle.subMenuChildren}>
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
