/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { ReactElement } from 'react';
import { Chip } from '@mui/material';
import { useIntl } from 'react-intl';
import { mergeSx, SxStyle } from '../../utils';
import { BuildStatus } from './constant';

function getBuildStatusSx(isRootNode: boolean, buildStatus?: BuildStatus): SxStyle {
    return (theme) => {
        // @ts-ignore
        const bs = theme.node.buildStatus;
        // pick background based on status
        let bg: string;

        switch (buildStatus) {
            case BuildStatus.BUILT:
                bg = bs.success;
                break;
            case BuildStatus.BUILT_WITH_WARNING:
                bg = bs.warning;
                break;
            case BuildStatus.BUILT_WITH_ERROR:
                bg = bs.error;
                break;
            default:
                bg = bs.notBuilt;
                break;
        }
        if (isRootNode) {
            bg = bs.warning;
        }
        return {
            background: bg,
            // only set explicit contrast color when it's the "notBuilt" background
            ...(bg === bs.notBuilt ? { color: theme.palette.getContrastText(bg) } : {}),
            '&:hover': {
                backgroundColor: bg,
            },
        };
    };
}

const baseStyle: SxStyle = (theme) =>
    ({
        padding: theme.spacing(1, 0.5),
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '100%',
    }) as const;

type BuildStatusChipProps = {
    buildStatus?: BuildStatus;
    sx?: SxStyle;
    icon?: ReactElement;
    onClick?: (e: React.MouseEvent) => void;
    isRootNode?: boolean;
    overrideLabel?: boolean;
};

export function BuildStatusChip({
    buildStatus = BuildStatus.NOT_BUILT,
    sx,
    icon,
    onClick,
    isRootNode = false,
    overrideLabel = false,
}: Readonly<BuildStatusChipProps>) {
    const intl = useIntl();
    let labelId = buildStatus?.toString();
    let localNodeStatus = buildStatus;
    if (overrideLabel) {
        if (isRootNode) {
            labelId = 'ROOT_NODE';
            localNodeStatus = BuildStatus.NOT_BUILT;
        } else if (
            labelId === BuildStatus.BUILT ||
            labelId === BuildStatus.BUILT_WITH_WARNING ||
            labelId === BuildStatus.BUILT_WITH_ERROR
        ) {
            labelId = 'NODE_BUILT';
            localNodeStatus = BuildStatus.BUILT;
        } else if (labelId === BuildStatus.NOT_BUILT) {
            labelId = 'NODE_NOT_BUILT';
            localNodeStatus = BuildStatus.NOT_BUILT;
        }
    }
    const label = intl.formatMessage({ id: labelId });

    return (
        <Chip
            label={label}
            size="small"
            icon={icon}
            onClick={onClick}
            sx={mergeSx(getBuildStatusSx(isRootNode, localNodeStatus), sx, baseStyle)}
        />
    );
}

export default BuildStatusChip;
