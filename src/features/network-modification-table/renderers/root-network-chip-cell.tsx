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
    NetworkModificationApplicabilities,
    RootNetworkRowInfo,
    snackWithFallback,
} from '../../../utils';

/**
 * A modification is applicable on a root network unless its applicability for that tag is explicitly false:
 * a tag without an entry is applicable.
 */
function isApplicableOn(applicabilities: NetworkModificationApplicabilities, modificationUuid: UUID, tag: string) {
    return applicabilities[modificationUuid]?.[tag] ?? true;
}

function getToggledApplicabilities(
    prev: NetworkModificationApplicabilities,
    modificationUuid: UUID,
    tag: string
): NetworkModificationApplicabilities {
    return {
        ...prev,
        [modificationUuid]: {
            ...prev[modificationUuid],
            [tag]: !isApplicableOn(prev, modificationUuid, tag),
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

    const isModificationActivated = useMemo(() => {
        if (rootNetwork.isCreating) {
            return true;
        }
        return isApplicableOn(applicabilities, modificationUuid, rootNetwork.tag);
    }, [modificationUuid, applicabilities, rootNetwork.tag, rootNetwork.isCreating]);

    const handleModificationActivationByRootNetwork = useCallback(() => {
        if (!studyUuid || !currentNodeId) {
            return;
        }

        setIsLoading(true);

        const newStatus = !isApplicableOn(applicabilities, modificationUuid, rootNetwork.tag);

        // Apply optimistic update
        setApplicabilities(getToggledApplicabilities(applicabilities, modificationUuid, rootNetwork.tag));

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
                setApplicabilities((prev) => getToggledApplicabilities(prev, modificationUuid, rootNetwork.tag));
                snackWithFallback(snackError, error, { headerId: 'modificationActivationByRootNetworkError' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        modificationUuid,
        studyUuid,
        currentNodeId,
        applicabilities,
        rootNetwork.rootNetworkUuid,
        rootNetwork.tag,
        setApplicabilities,
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
