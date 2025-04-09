/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip, Tooltip } from '@mui/material';
import { CheckCircleOutline, Cancel } from '@mui/icons-material';

export interface ActivableChipProps {
    isActivated: boolean;
    label: string;
    tooltipMessage: string;
    onClick: () => void;
    isDisabled?: boolean;
}

export function ActivableChip(props: Readonly<ActivableChipProps>) {
    const { isActivated, label, tooltipMessage, onClick, isDisabled } = props;

    return (
        <Tooltip title={tooltipMessage} arrow>
            <Chip
                label={label}
                deleteIcon={isActivated ? <CheckCircleOutline /> : <Cancel />}
                color="primary"
                size="small"
                variant={isActivated ? 'filled' : 'outlined'}
                onDelete={onClick}
                onClick={onClick}
                disabled={isDisabled}
            />
        </Tooltip>
    );
}
