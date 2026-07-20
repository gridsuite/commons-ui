/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, Tooltip } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { LinkRounded as LinkRoundedIcon } from '@mui/icons-material';
import { useSnackMessage } from '../../../hooks';
import { fetchAppsMetadata, fetchNetworkModification, isExploreMetadata } from '../../../services';
import { ComposedModificationMetadata, snackWithFallback } from '../../../utils';
import { CustomMenuItem } from '../../../components';
import { ReferenceModificationInfos } from '../utils';
import { DatasetLinkedIcon } from '../../../components/ui/icons/DatasetLinkedIcon';

export interface ReferenceLinkCellProps {
    data: ComposedModificationMetadata;
    disabled?: boolean;
}

export function ReferenceLinkCell({ data, disabled = false }: Readonly<ReferenceLinkCellProps>) {
    const intl = useIntl();
    const { snackInfo, snackError } = useSnackMessage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const open = Boolean(anchorEl);

    const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        // prevent the row click handler (edit dialog) from firing
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleCopyLink = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchorEl(null);
            setIsLoading(true);
            // Resolve the referenceId (the GridExplore element id) and the GridExplore base URL
            // (from the apps metadata) in parallel, then copy "<exploreUrl>/elements/<referenceId>".
            // referenceId is resolved from the detail because the list/metadata path may not carry it.
            Promise.all([
                fetchNetworkModification(data.uuid).then((res) => res.json()) as Promise<ReferenceModificationInfos>,
                fetchAppsMetadata(),
            ])
                .then(([referenceInfos, metadata]) => {
                    const referenceId = referenceInfos?.referenceId;
                    const exploreUrl = metadata?.find(isExploreMetadata)?.url;

                    if (!referenceId || !exploreUrl) {
                        throw new Error(
                            `Cannot build reference link: ${!referenceId ? 'referenceId' : 'exploreUrl'} is missing`
                        );
                    }

                    const link = `${exploreUrl}/elements/${referenceId}`;
                    return navigator.clipboard
                        .writeText(link)
                        .then(() => snackInfo({ headerId: 'modification/linkCopied' }));
                })
                .catch((error) => snackWithFallback(snackError, error, { headerId: 'modification/linkCopyError' }))
                .finally(() => setIsLoading(false));
        },
        [data.uuid, snackInfo, snackError]
    );

    return (
        <>
            <Tooltip title={<FormattedMessage id="importComposites.shared" />} arrow enterDelay={250}>
                <span>
                    <IconButton size="small" disabled={disabled || isLoading} onClick={handleOpen}>
                        <DatasetLinkedIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                slotProps={{
                    paper: {
                        sx: {
                            maxWidth: 220,
                        },
                    },
                    list: {
                        dense: true,
                        sx: { py: 0.25 },
                    },
                }}
            >
                <CustomMenuItem onClick={handleCopyLink} sx={{ minHeight: 0, py: 0.25, px: 1 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                        <LinkRoundedIcon sx={{ fontSize: 18, transform: 'rotate(-50deg)' }} />
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage({ id: 'modification/copyLink' })} />
                </CustomMenuItem>
            </Menu>
        </>
    );
}
