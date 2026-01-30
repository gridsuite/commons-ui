/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { ReactNode, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip, IconButton } from '@mui/material';
import { dialogStyles } from '../components/dialogs/dialog-utils';
import { TOOLTIP_DELAY } from '../utils';

interface UseButtonWithTooltipProps {
    handleClick: React.MouseEventHandler<HTMLButtonElement>;
    label: string;
    icon: ReactNode;
}

export const useButtonWithTooltip = ({ handleClick, label, icon }: UseButtonWithTooltipProps) => {
    return useMemo(() => {
        return (
            <Tooltip
                title={<FormattedMessage id={label} />}
                placement="top"
                arrow
                enterDelay={TOOLTIP_DELAY}
                enterNextDelay={TOOLTIP_DELAY}
                slotProps={{
                    popper: {
                        sx: {
                            '& .MuiTooltip-tooltip': dialogStyles.tooltip,
                        },
                    },
                }}
            >
                <IconButton style={{ padding: '2px' }} onClick={handleClick}>
                    {icon}
                </IconButton>
            </Tooltip>
        );
    }, [label, handleClick, icon]);
};
