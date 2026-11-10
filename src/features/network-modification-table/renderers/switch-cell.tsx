/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Switch, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Row } from '@tanstack/react-table';
import { useSnackMessage } from '../../../hooks';
import { ComposedModificationMetadata, NetworkModificationActivations, snackWithFallback } from '../../../utils';
import { isActivated, isDeactivatedByAncestor } from '../utils';
import type { SaveModificationActivation } from '../network-modifications-table';

export interface SwitchCellProps {
    row: Row<ComposedModificationMetadata>;
    saveActivation: SaveModificationActivation;
    activations: NetworkModificationActivations;
    setPendingActivations: Dispatch<SetStateAction<NetworkModificationActivations>>;
    isDisabled?: boolean;
}

export function SwitchCell(props: Readonly<SwitchCellProps>) {
    const { row, saveActivation, activations, setPendingActivations, isDisabled = false } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    const data = row.original;
    const modificationUuid = data.uuid;
    const modificationActivated = isActivated(activations, modificationUuid);

    const toggleModificationActive = useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (!modificationUuid) {
                return;
            }

            setIsLoading(true);
            // Apply optimistic update, dropped once the modifications are fetched back with the new value
            setPendingActivations((prev) => ({ ...prev, [modificationUuid]: checked }));

            saveActivation(data, checked)
                .catch((error) => {
                    // Rollback on failure: with nothing pending the switch reads the modification again
                    setPendingActivations((prev) => {
                        const rolledBack = { ...prev };
                        delete rolledBack[modificationUuid];
                        return rolledBack;
                    });
                    snackWithFallback(snackError, error, { headerId: 'networkModificationActivationError' });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [modificationUuid, data, saveActivation, setPendingActivations, snackError]
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
                    disabled={isLoading || isDisabled || isDeactivatedByAncestor(row, activations)}
                    checked={modificationActivated}
                    onChange={toggleModificationActive}
                />
            </span>
        </Tooltip>
    );
}
