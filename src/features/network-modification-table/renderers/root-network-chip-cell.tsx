/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback, useMemo, SetStateAction } from 'react';
import type { UUID } from 'node:crypto';
import { ActivableChip } from '../../../components/ui/inputs';
import { updateModificationStatusByRootNetwork } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import {
    ComposedModificationMetadata,
    ModificationType,
    NetworkModificationApplicabilities,
    RootNetworkRowInfo,
    snackWithFallback,
} from '../../../utils';

/**
 * A modification is applicable on a root network unless its applicability for it is explicitly false:
 * a root network without an entry is applicable.
 */
function isApplicableOn(
    applicabilities: NetworkModificationApplicabilities,
    modificationUuid: UUID,
    rootNetworkUuid: UUID
) {
    return applicabilities[modificationUuid]?.[rootNetworkUuid] ?? true;
}

function setApplicability(
    prevApplicabilities: NetworkModificationApplicabilities,
    modificationUuid: UUID,
    rootNetworkUuid: UUID,
    applicable: boolean
): NetworkModificationApplicabilities {
    return {
        ...prevApplicabilities,
        [modificationUuid]: {
            ...prevApplicabilities[modificationUuid],
            [rootNetworkUuid]: applicable,
        },
    };
}

export interface RootNetworkChipCellProps {
    data: ComposedModificationMetadata;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    rootNetwork: RootNetworkRowInfo;
    applicabilities: NetworkModificationApplicabilities;
    setApplicabilities: React.Dispatch<SetStateAction<NetworkModificationApplicabilities>>;
    isDisabled?: boolean;
}

export function RootNetworkChipCell(props: RootNetworkChipCellProps) {
    const {
        data,
        studyUuid,
        currentNodeId,
        rootNetwork,
        applicabilities,
        setApplicabilities,
        isDisabled = false,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();
    const modificationUuid = data.uuid;

    const isReferenceModificationOrInsideOne =
        data.type === ModificationType.MODIFICATION_REFERENCE || data.childFromShared;

    const isModificationApplicable = useMemo(() => {
        return isApplicableOn(applicabilities, modificationUuid, rootNetwork.rootNetworkUuid);
    }, [modificationUuid, applicabilities, rootNetwork.rootNetworkUuid]);

    const handleModificationActivationByRootNetwork = useCallback(() => {
        if (!studyUuid || !currentNodeId) {
            return;
        }

        setIsLoading(true);

        // toggle the current applicability
        const newApplicability = !isModificationApplicable;

        // Apply optimistic update
        setApplicabilities((prev) =>
            setApplicability(prev, modificationUuid, rootNetwork.rootNetworkUuid, newApplicability)
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
                // Rollback on failure to the value shown when the user clicked
                setApplicabilities((prev) =>
                    setApplicability(prev, modificationUuid, rootNetwork.rootNetworkUuid, isModificationApplicable)
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
        setApplicabilities,
        snackError,
    ]);

    return (
        <ActivableChip
            label={rootNetwork.tag}
            tooltipMessage={rootNetwork.name}
            isActivated={isModificationApplicable}
            isDisabled={isLoading || isDisabled || isReferenceModificationOrInsideOne || rootNetwork.isCreating}
            onClick={handleModificationActivationByRootNetwork}
        />
    );
}
