/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback, useMemo, SetStateAction, FunctionComponent } from 'react';
import type { UUID } from 'node:crypto';
import { ActivableChip } from '../../inputs/ActivableChip';
import { updateModificationStatusByRootNetwork } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import {
    ComposedModificationMetadata,
    ExcludedNetworkModifications,
    RootNetworkRowInfo,
    snackWithFallback,
} from '../../../utils';

function getUpdatedExcludedModifications(
    prev: ExcludedNetworkModifications[],
    rootNetworkUuid: UUID,
    modificationUuid: UUID,
    updateStatus: (isExcluded: boolean) => void
): ExcludedNetworkModifications[] {
    const exists = prev.some((item) => item.rootNetworkUuid === rootNetworkUuid);

    if (exists) {
        return prev.map((modif) => {
            if (modif.rootNetworkUuid !== rootNetworkUuid) {
                return modif;
            }

            const isExcluded = modif.modificationUuidsToExclude.includes(modificationUuid);
            const newModificationUuidsToExclude = isExcluded
                ? modif.modificationUuidsToExclude.filter((id) => id !== modificationUuid)
                : [...modif.modificationUuidsToExclude, modificationUuid];

            // If previously excluded, now it is activated (true), else deactivated (false)
            updateStatus(isExcluded);

            return {
                ...modif,
                modificationUuidsToExclude: newModificationUuidsToExclude,
            };
        });
    } else {
        updateStatus(false);
        return [
            ...prev,
            {
                rootNetworkUuid,
                modificationUuidsToExclude: [modificationUuid],
            },
        ];
    }
}

export interface RootNetworkChipCellProps {
    data?: ComposedModificationMetadata;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    rootNetwork: RootNetworkRowInfo;
    modificationsToExclude: ExcludedNetworkModifications[];
    setModificationsToExclude: React.Dispatch<SetStateAction<ExcludedNetworkModifications[]>>;
    isDisabled?: boolean;
}

export const RootNetworkChipCell: FunctionComponent<RootNetworkChipCellProps> = ({
    data,
    studyUuid,
    currentNodeId,
    rootNetwork,
    modificationsToExclude,
    setModificationsToExclude,
    isDisabled = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();
    const modificationUuid = data?.uuid;

    const isModificationActivated = useMemo(() => {
        if (!modificationUuid) {
            return false;
        }
        if (rootNetwork.isCreating) {
            return true;
        }

        const excludedSet = new Set(
            modificationsToExclude.find((item) => item.rootNetworkUuid === rootNetwork.rootNetworkUuid)
                ?.modificationUuidsToExclude || []
        );

        return !excludedSet.has(modificationUuid);
    }, [modificationUuid, modificationsToExclude, rootNetwork.rootNetworkUuid, rootNetwork.isCreating]);

    const updateStatus = useCallback(
        (newStatus: boolean) => {
            if (!studyUuid || !modificationUuid || !currentNodeId) {
                setIsLoading(false);
                return;
            }

            updateModificationStatusByRootNetwork(
                studyUuid,
                currentNodeId,
                rootNetwork.rootNetworkUuid,
                modificationUuid,
                newStatus
            )
                .catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'modificationActivationByRootNetworkError' });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [studyUuid, currentNodeId, modificationUuid, rootNetwork.rootNetworkUuid, snackError]
    );

    const handleModificationActivationByRootNetwork = useCallback(() => {
        if (!modificationUuid) {
            return;
        }

        setIsLoading(true);

        setModificationsToExclude((prev) =>
            getUpdatedExcludedModifications(prev, rootNetwork.rootNetworkUuid, modificationUuid, updateStatus)
        );
    }, [modificationUuid, rootNetwork.rootNetworkUuid, setModificationsToExclude, updateStatus]);

    return (
        <ActivableChip
            label={rootNetwork.tag}
            tooltipMessage={rootNetwork.name}
            isActivated={isModificationActivated}
            isDisabled={isLoading || isDisabled}
            onClick={handleModificationActivationByRootNetwork}
        />
    );
};
