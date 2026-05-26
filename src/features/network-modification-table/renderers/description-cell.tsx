/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { UUID } from 'node:crypto';
import { DescriptionModificationDialog } from '../../../components/ui/dialogs';
import { EditNoteIcon } from '../../../components/ui/icons';
import { setModificationMetadata } from '../../../services';
import { ComposedModificationMetadata } from '../../../utils';
import { createEditDescriptionStyle } from '../network-modification-table-styles';

export interface DescriptionCellProps {
    data: ComposedModificationMetadata;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    isDisabled?: boolean;
}

export function DescriptionCell(props: DescriptionCellProps) {
    const { data, studyUuid, currentNodeId, isDisabled = false } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [openDescModificationDialog, setOpenDescModificationDialog] = useState(false);

    const modificationUuid = data.uuid;
    const { description } = data;
    const empty = !description;

    const updateModification = useCallback(
        async (descriptionRecord: Record<string, string>) => {
            setIsLoading(true);
            return setModificationMetadata(studyUuid, currentNodeId, modificationUuid, {
                description: descriptionRecord.description,
                type: data.type,
            }).finally(() => {
                setIsLoading(false);
            });
        },
        [studyUuid, currentNodeId, modificationUuid, data.type]
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
                    description={description ?? ''}
                    onClose={handleDescDialogClose}
                    updateElement={updateModification}
                />
            )}
            <Tooltip title={description ?? <FormattedMessage id="addDescription" />} arrow enterDelay={250}>
                <span>
                    <IconButton
                        onClick={handleModifyDescription}
                        disabled={isLoading || isDisabled}
                        sx={createEditDescriptionStyle(data.description)}
                    >
                        <EditNoteIcon empty={empty} />
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );
}
