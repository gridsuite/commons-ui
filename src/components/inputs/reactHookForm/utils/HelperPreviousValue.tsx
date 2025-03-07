/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { FormHelperText, Stack, Tooltip, Typography } from '@mui/material';
import { InfoOutlined, WarningAmberRounded } from '@mui/icons-material';

export interface HelperPreviousValueProps {
    previousValue?: number | string;
    isNodeBuilt?: boolean;
    disabledTooltip?: boolean;
    adornmentText?: string;
}

export function HelperPreviousValue({
    previousValue,
    isNodeBuilt,
    disabledTooltip,
    adornmentText,
}: Readonly<HelperPreviousValueProps>) {
    const intl = useIntl();
    if (previousValue || previousValue === 0) {
        return (
            <FormHelperText error={false} sx={{ marginLeft: 0 }}>
                {!disabledTooltip ? (
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Tooltip
                            title={intl.formatMessage({ id: isNodeBuilt ? 'builtNodeTooltip' : 'notBuiltNodeTooltip' })}
                            placement="right"
                            arrow
                            PopperProps={{
                                modifiers: [
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, -10],
                                        },
                                    },
                                ],
                            }}
                        >
                            {isNodeBuilt ? (
                                <InfoOutlined color="info" fontSize="small" />
                            ) : (
                                <WarningAmberRounded color="warning" fontSize="small" />
                            )}
                        </Tooltip>
                        <Typography noWrap fontSize={11} align="center">
                            {previousValue + (adornmentText ? ` ${adornmentText}` : '')}
                        </Typography>
                    </Stack>
                ) : (
                    previousValue + (adornmentText ? ` ${adornmentText}` : '')
                )}
            </FormHelperText>
        );
    }
    return undefined;
}
