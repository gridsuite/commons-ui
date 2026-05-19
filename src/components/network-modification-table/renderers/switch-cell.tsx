/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Switch, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { UUID } from 'node:crypto';
import { setModificationMetadata } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ComposedModificationMetadata, snackWithFallback } from '../../../utils';

export interface SwitchCellProps {
    data: ComposedModificationMetadata;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    isDisabled?: boolean;
}

export const SwitchCell: FunctionComponent<SwitchCellProps> = ({
    data,
    studyUuid,
    currentNodeId,
    isDisabled = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    const modificationUuid = data?.uuid;
    const [modificationActivated, setModificationActivated] = useState(data?.activated);

    // Re-sync the local checked state when the row data is refreshed (e.g. after a server notification).
    useEffect(() => {
        setModificationActivated(data?.activated);
    }, [data?.activated]);

    const toggleModificationActive = useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (!modificationUuid) {
                return;
            }

            setIsLoading(true);
            setModificationActivated(checked);

            setModificationMetadata(studyUuid, currentNodeId, modificationUuid, {
                activated: checked,
                type: data?.type,
            })
                .catch((error) => {
                    setModificationActivated(data?.activated); // rollback
                    snackWithFallback(snackError, error, { headerId: 'networkModificationActivationError' });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [modificationUuid, studyUuid, currentNodeId, data?.type, data?.activated, snackError]
    );

    return (
        <Tooltip
            title={<FormattedMessage id={modificationActivated ? 'deactivateModification' : 'activateModification'} />}
            arrow
            enterDelay={250}
        >
            <span>
                <Switch
                    size="small"
                    disabled={isLoading || isDisabled}
                    checked={modificationActivated}
                    onChange={toggleModificationActive}
                />
            </span>
        </Tooltip>
    );
};
