/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { ElementAttributes, ElementType, FieldConstants } from '../../../../utils';
import { getProcessConfigFormDefaultValues } from '../../common/process-config-form.constants';
import type { FetchProcessConfigHandler, ProcessConfigFormValues } from '../../common/process-config-form.types';

type UsePrefillSelectionParams = {
    form: UseFormReturn<ProcessConfigFormValues>;
    onFetchProcessConfig?: FetchProcessConfigHandler;
    selectedProcessType: string;
};

export function usePrefillSelection({ form, onFetchProcessConfig, selectedProcessType }: UsePrefillSelectionParams) {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const openSelector = useCallback(() => setIsSelectorOpen(true), []);
    const closeSelector = useCallback(() => setIsSelectorOpen(false), []);

    const itemFilter = useCallback(
        (item: ElementAttributes) =>
            item?.type === ElementType.PROCESS_CONFIG && item?.specificMetadata?.type === selectedProcessType,
        [selectedProcessType]
    );

    const handleSelect = useCallback(
        async (nodes: ReadonlyArray<{ id: string; name?: string; description?: string }>) => {
            closeSelector();

            const selectedElement = nodes?.[0];
            if (!selectedElement || !onFetchProcessConfig) {
                return;
            }

            const prefillValues = await onFetchProcessConfig(
                selectedElement.id,
                selectedElement.name,
                selectedElement.description
            );
            if (!prefillValues) {
                return;
            }

            const currentDirectory = form.getValues(FieldConstants.DIRECTORY);
            const currentName = form.getValues(FieldConstants.NAME);

            form.reset(
                {
                    ...getProcessConfigFormDefaultValues('create'),
                    ...prefillValues,
                    processType: selectedProcessType as ProcessConfigFormValues['processType'],
                    [FieldConstants.NAME]: currentName,
                    [FieldConstants.DIRECTORY]: currentDirectory,
                },
                { keepDefaultValues: true }
            );
        },
        [closeSelector, form, onFetchProcessConfig, selectedProcessType]
    );

    return { isSelectorOpen, openSelector, itemFilter, handleSelect };
}
