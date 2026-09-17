/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback, useMemo, SetStateAction } from 'react';
import { Row } from '@tanstack/react-table';
import type { UUID } from 'node:crypto';
import { ActivableChip } from '../../../components/ui/inputs';
import { updateModificationStatusByRootNetwork } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import {
    ComposedModificationMetadata,
    ModificationType,
    NetworkModificationActivations,
    NetworkModificationApplicabilities,
    RootNetworkRowInfo,
    snackWithFallback,
} from '../../../utils';
import { isAppliedOn, isApplicableOn, isDeactivatedItselfOrByAncestor } from '../utils';

function addPendingApplicability(
    pendingApplicabilities: NetworkModificationApplicabilities,
    modificationUuid: UUID,
    rootNetworkUuid: UUID,
    applicable: boolean
): NetworkModificationApplicabilities {
    return {
        ...pendingApplicabilities,
        [modificationUuid]: {
            ...pendingApplicabilities[modificationUuid],
            [rootNetworkUuid]: applicable,
        },
    };
}

// for rollback
function removePendingApplicability(
    pendingApplicabilities: NetworkModificationApplicabilities,
    modificationUuid: UUID,
    rootNetworkUuid: UUID
): NetworkModificationApplicabilities {
    const byRootNetwork = { ...pendingApplicabilities[modificationUuid] };
    delete byRootNetwork[rootNetworkUuid];
    const rolledBack = { ...pendingApplicabilities };
    if (Object.keys(byRootNetwork).length === 0) {
        delete rolledBack[modificationUuid];
    } else {
        rolledBack[modificationUuid] = byRootNetwork;
    }
    return rolledBack;
}

export interface RootNetworkChipCellProps {
    row: Row<ComposedModificationMetadata>;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    rootNetwork: RootNetworkRowInfo;
    activations: NetworkModificationActivations;
    applicabilities: NetworkModificationApplicabilities;
    setPendingApplicabilities: React.Dispatch<SetStateAction<NetworkModificationApplicabilities>>;
    isDisabled?: boolean;
}

export function RootNetworkChipCell(props: Readonly<RootNetworkChipCellProps>) {
    const {
        row,
        studyUuid,
        currentNodeId,
        rootNetwork,
        activations,
        applicabilities,
        setPendingApplicabilities,
        isDisabled = false,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();
    const data = row.original;
    const modificationUuid = data.uuid;

    const isReferenceModificationOrInsideOne =
        data.type === ModificationType.MODIFICATION_REFERENCE || data.childFromShared;

    const isModificationApplicable = useMemo(() => {
        return isApplicableOn(applicabilities, modificationUuid, rootNetwork.rootNetworkUuid);
    }, [modificationUuid, applicabilities, rootNetwork.rootNetworkUuid]);

    // What the modification wants is not necessarily what it gets: it also depends on the composites it is nested in
    const isModificationApplied = isAppliedOn(row, activations, applicabilities, rootNetwork.rootNetworkUuid);

    const handleModificationActivationByRootNetwork = useCallback(() => {
        if (!studyUuid || !currentNodeId) {
            return;
        }

        setIsLoading(true);

        // toggle the current applicability
        const newApplicability = !isModificationApplicable;

        // Apply optimistic update, dropped once the modifications are fetched back with the new applicability
        setPendingApplicabilities((prev) =>
            addPendingApplicability(prev, modificationUuid, rootNetwork.rootNetworkUuid, newApplicability)
        );

        // Perform backend call
        updateModificationStatusByRootNetwork(
            studyUuid,
            currentNodeId,
            rootNetwork.rootNetworkUuid,
            modificationUuid,
            newApplicability
        )
            .catch((error) => {
                setPendingApplicabilities((prev) =>
                    removePendingApplicability(prev, modificationUuid, rootNetwork.rootNetworkUuid)
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
        isModificationApplicable,
        rootNetwork.rootNetworkUuid,
        setPendingApplicabilities,
        snackError,
    ]);

    return (
        <ActivableChip
            label={rootNetwork.tag}
            tooltipMessage={rootNetwork.name}
            isActivationRequested={isModificationApplicable}
            isActivationEffective={isModificationApplied}
            isDisabled={
                isLoading ||
                isDisabled ||
                isReferenceModificationOrInsideOne ||
                rootNetwork.isCreating ||
                isDeactivatedItselfOrByAncestor(row, activations)
            }
            onClick={handleModificationActivationByRootNetwork}
        />
    );
}
