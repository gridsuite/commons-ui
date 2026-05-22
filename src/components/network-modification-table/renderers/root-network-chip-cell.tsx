/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback, useMemo, SetStateAction } from 'react';
import type { UUID } from 'node:crypto';
import { ActivableChip } from '../../inputs';
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
    modificationUuid: UUID
): { nextExcluded: ExcludedNetworkModifications[]; newStatus: boolean } {
    const exists = prev.some((item) => item.rootNetworkUuid === rootNetworkUuid);

    if (exists) {
        let newStatus = false;
        const nextExcluded = prev.map((modif) => {
            if (modif.rootNetworkUuid !== rootNetworkUuid) {
                return modif;
            }

            const isExcluded = modif.modificationUuidsToExclude.includes(modificationUuid);
            const newModificationUuidsToExclude = isExcluded
                ? modif.modificationUuidsToExclude.filter((id) => id !== modificationUuid)
                : [...modif.modificationUuidsToExclude, modificationUuid];

            // If previously excluded, now it is activated (true), else deactivated (false)
            newStatus = isExcluded;

            return {
                ...modif,
                modificationUuidsToExclude: newModificationUuidsToExclude,
            };
        });

        return { nextExcluded, newStatus };
    }
    return {
        nextExcluded: [
            ...prev,
            {
                rootNetworkUuid,
                modificationUuidsToExclude: [modificationUuid],
            },
        ],
        newStatus: false,
    };
}

export interface RootNetworkChipCellProps {
    data: ComposedModificationMetadata;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    rootNetwork: RootNetworkRowInfo;
    modificationsToExclude: ExcludedNetworkModifications[];
    setModificationsToExclude: React.Dispatch<SetStateAction<ExcludedNetworkModifications[]>>;
    isDisabled?: boolean;
}

export function RootNetworkChipCell(props: RootNetworkChipCellProps) {
    const {
        data,
        studyUuid,
        currentNodeId,
        rootNetwork,
        modificationsToExclude,
        setModificationsToExclude,
        isDisabled = false,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();
    const modificationUuid = data.uuid;

    const isModificationActivated = useMemo(() => {
        if (rootNetwork.isCreating) {
            return true;
        }

        const excludedSet = new Set(
            modificationsToExclude.find((item) => item.rootNetworkUuid === rootNetwork.rootNetworkUuid)
                ?.modificationUuidsToExclude || []
        );

        return !excludedSet.has(modificationUuid);
    }, [modificationUuid, modificationsToExclude, rootNetwork.rootNetworkUuid, rootNetwork.isCreating]);

    const handleModificationActivationByRootNetwork = useCallback(() => {
        if (!studyUuid || !currentNodeId) {
            return;
        }

        setIsLoading(true);

        // Compute next state (pure, no side effects)
        const { nextExcluded, newStatus } = getUpdatedExcludedModifications(
            modificationsToExclude,
            rootNetwork.rootNetworkUuid,
            modificationUuid
        );

        // Apply optimistic update
        setModificationsToExclude(nextExcluded);

        // Perform backend call
        updateModificationStatusByRootNetwork(
            studyUuid,
            currentNodeId,
            rootNetwork.rootNetworkUuid,
            modificationUuid,
            newStatus
        )
            .catch((error) => {
                // Rollback on failure by toggling back
                setModificationsToExclude(
                    (prev) =>
                        getUpdatedExcludedModifications(prev, rootNetwork.rootNetworkUuid, modificationUuid)
                            .nextExcluded
                );
                snackWithFallback(snackError, error, { headerId: 'modificationActivationByRootNetworkError' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        modificationUuid,
        studyUuid,
        currentNodeId,
        modificationsToExclude,
        rootNetwork.rootNetworkUuid,
        setModificationsToExclude,
        snackError,
    ]);

    return (
        <ActivableChip
            label={rootNetwork.tag}
            tooltipMessage={rootNetwork.name}
            isActivated={isModificationActivated}
            isDisabled={isLoading || isDisabled}
            onClick={handleModificationActivationByRootNetwork}
        />
    );
}
