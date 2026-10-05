/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { CustomTooltip } from '../tooltip/CustomTooltip';

export interface ActivableChipProps {
    /** What the element wants: carried by the icon */
    isActivationRequested: boolean;
    /** Whether it takes effect: carried by the background */
    isActivationEffective: boolean;
    label: string;
    tooltipMessage: string;
    onClick: () => void;
    isDisabled?: boolean;
}

export function ActivableChip(props: Readonly<ActivableChipProps>) {
    const { isActivationRequested, isActivationEffective, label, tooltipMessage, onClick, isDisabled } = props;

    return (
        <CustomTooltip title={tooltipMessage}>
            <Chip
                label={label}
                deleteIcon={isActivationRequested ? <CheckCircle /> : <RadioButtonUnchecked />}
                color="primary"
                size="small"
                variant={isActivationEffective ? 'filled' : 'outlined'}
                onDelete={onClick}
                onClick={onClick}
                disabled={isDisabled}
                sx={{
                    // the delete icon is a status, not an actionable element: no hover highlight
                    '& .MuiChip-deleteIcon, & .MuiChip-deleteIcon:hover': {
                        color: 'inherit',
                    },
                }}
            />
        </CustomTooltip>
    );
}
