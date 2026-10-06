/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Row } from '@tanstack/react-table';
import { DescriptionModificationDialog } from '../../../components/ui/dialogs';
import { EditNoteIcon } from '../../../components/ui/icons';
import { setModificationNameAndDescription } from '../../../services';
import { ComposedModificationMetadata, snackWithFallback } from '../../../utils';
import { createEditDescriptionStyle } from '../network-modification-table-styles';
import { useSnackMessage } from '../../../hooks';

export interface DescriptionCellProps {
    row: Row<ComposedModificationMetadata>;
    isDisabled?: boolean;
}

export function DescriptionCell(props: DescriptionCellProps) {
    const { row, isDisabled = false } = props;
    const { snackError } = useSnackMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [openDescModificationDialog, setOpenDescModificationDialog] = useState(false);

    const data = row.original;
    const modificationUuid = data.uuid;
    const { description } = data;
    const [descriptionState, setDescriptionState] = useState(description);
    const empty = useMemo(() => !descriptionState, [descriptionState]);

    const savedDescription = useMemo(() => {
        return description;
    }, [description]);

    useEffect(() => {
        setDescriptionState(savedDescription);
    }, [savedDescription]);

    const updateModification = useCallback(
        async (descriptionRecord: Record<string, string>) => {
            setIsLoading(true);
            setDescriptionState(descriptionRecord.description);
            data.description = descriptionRecord.description;
            return setModificationNameAndDescription(modificationUuid, {
                description: descriptionRecord.description,
                type: data.type,
            })
                .catch((error) => {
                    // rollback
                    setDescriptionState(savedDescription);
                    data.description = savedDescription;
                    snackWithFallback(snackError, error, {
                        headerId: `setModificationNameAndDescriptionError`,
                    });
                    throw error;
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [modificationUuid, data, savedDescription, snackError]
    );

    const handleDescDialogClose = useCallback(() => {
        setOpenDescModificationDialog(false);
    }, []);

    const handleModifyDescription = useCallback(() => {
        setOpenDescModificationDialog(true);
    }, []);

    return (
        <>
            {openDescModificationDialog && modificationUuid && (
                <DescriptionModificationDialog
                    open
                    description={descriptionState ?? ''}
                    onClose={handleDescDialogClose}
                    updateElement={updateModification}
                />
            )}
            <Tooltip title={descriptionState ?? <FormattedMessage id="addDescription" />} arrow enterDelay={250}>
                <span>
                    <IconButton
                        onClick={handleModifyDescription}
                        disabled={isLoading || isDisabled}
                        sx={createEditDescriptionStyle(descriptionState)}
                    >
                        <EditNoteIcon empty={empty} />
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );
}
