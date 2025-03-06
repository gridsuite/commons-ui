/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { FormHelperText, Stack, Tooltip, Typography } from '@mui/material';
import { InfoOutlined, WarningAmberRounded } from '@mui/icons-material';

export function HelperPreviousValue(
    previousValue: number | string,
    isNodeBuilt?: boolean,
    disabledTooltip?: boolean,
    adornmentText?: string
) {
    const intl = useIntl();
    if (previousValue || previousValue === 0) {
        return !disabledTooltip ? (
            <FormHelperText error={false}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {isNodeBuilt ? (
                        <InfoOutlined color="info" fontSize="small" />
                    ) : (
                        <WarningAmberRounded color="warning" fontSize="small" />
                    )}
                    <Tooltip
                        title={intl.formatMessage({ id: isNodeBuilt ? 'builtNodeTooltip' : 'notBuiltNodeTooltip' })}
                        placement="bottom-start"
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
                        <Typography noWrap fontSize={11} align="center">
                            {previousValue + (adornmentText ? ` ${adornmentText}` : '')}
                        </Typography>
                    </Tooltip>
                </Stack>
            </FormHelperText>
        ) : (
            <FormHelperText error={false}>{previousValue + (adornmentText ? ` ${adornmentText}` : '')}</FormHelperText>
        );
    }
    return undefined;
}
