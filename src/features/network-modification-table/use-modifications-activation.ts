/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import {
    ComposedModificationMetadata,
    NetworkModificationActivations,
    NetworkModificationApplicabilities,
    RootNetworkRowInfo,
} from '../../utils';
import {
    collectActivations,
    collectApplicabilities,
    keepStillPendingActivations,
    keepStillPendingApplicabilities,
    mergeActivations,
    mergeApplicabilities,
} from './utils';

interface UseModificationsActivationParams {
    modifications: ComposedModificationMetadata[];
    rootNetworks?: RootNetworkRowInfo[];
}

interface UseModificationsActivationResult {
    activations: NetworkModificationActivations;
    setPendingActivations: Dispatch<SetStateAction<NetworkModificationActivations>>;
    applicabilities: NetworkModificationApplicabilities;
    setPendingApplicabilities: Dispatch<SetStateAction<NetworkModificationApplicabilities>>;
}

/**
 * Holds the activation of the modifications, globally and per root network, as the table shows it: what the
 * fetched modifications carry, with the changes still on their way to the server laid over.
 *
 * A change is held here rather than in the switch or chip that made it, so that toggling a composite greys out
 * what it holds right away, and it is kept until the fetched modifications carry it: dropping it on any refresh
 * would flick the control back to its previous state until the change makes it back.
 */
export function useModificationsActivation({
    modifications,
    rootNetworks,
}: UseModificationsActivationParams): UseModificationsActivationResult {
    const serverActivations = useMemo(() => collectActivations(modifications), [modifications]);

    const [pendingActivations, setPendingActivations] = useState<NetworkModificationActivations>({});
    useEffect(() => {
        setPendingActivations((pending) => keepStillPendingActivations(pending, serverActivations));
    }, [serverActivations]);

    const activations = useMemo(
        () => mergeActivations(serverActivations, pendingActivations),
        [serverActivations, pendingActivations]
    );

    // The tags are read from a ref on purpose: renaming a root network must not retrigger the collect, or the
    // modifications in hand, still carrying the previous tag, would resolve to no root network at all and read
    // back as applicable. The next fetch of the modifications brings both sides in step again.
    const rootNetworksRef = useRef(rootNetworks);
    useEffect(() => {
        rootNetworksRef.current = rootNetworks;
    }, [rootNetworks]);

    const serverApplicabilities = useMemo(
        () => collectApplicabilities(modifications, rootNetworksRef.current),
        [modifications]
    );

    const [pendingApplicabilities, setPendingApplicabilities] = useState<NetworkModificationApplicabilities>({});
    useEffect(() => {
        setPendingApplicabilities((pending) => keepStillPendingApplicabilities(pending, serverApplicabilities));
    }, [serverApplicabilities]);

    const applicabilities = useMemo(
        () => mergeApplicabilities(serverApplicabilities, pendingApplicabilities),
        [serverApplicabilities, pendingApplicabilities]
    );

    return { activations, setPendingActivations, applicabilities, setPendingApplicabilities };
}
