/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Divider, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import type { UUID } from 'node:crypto';
import { ProcessTypeSelect } from './components/ProcessTypeSelect';
import { ProcessTypeChangeDialog } from './components/ProcessTypeChangeDialog';
import { usePrefillSelection } from './hooks/usePrefillSelection';
import { useProcessTypeGuard } from './hooks/useProcessTypeGuard';
import { GeneralInformationSection, SpecificInformationSection } from '../common';
import type { ProcessConfigFormProps } from '../common/process-config-form.types';
import { DirectoryItemSelector, type DirectoryItemSchema } from '../../../components';
import { ElementType, FieldConstants } from '../../../utils';

export function ProcessConfigForm({
    form,
    mode,
    initialElementName,
    activeDirectory,
    onFetchProcessConfig,
}: Readonly<ProcessConfigFormProps>) {
    const { control } = form;
    const isCreate = mode === 'create';

    const {
        selectedProcessType,
        pendingProcessType,
        checkProcessTypeChange,
        confirmProcessTypeChange,
        cancelProcessTypeChange,
    } = useProcessTypeGuard(form);

    const selectedDirectory = useWatch({ control, name: FieldConstants.DIRECTORY }) as
        DirectoryItemSchema | null | undefined;

    const { isSelectorOpen, openSelector, itemFilter, handleSelect } = usePrefillSelection({
        form,
        onFetchProcessConfig,
        selectedProcessType,
    });

    return (
        <Stack spacing={3} sx={{ paddingTop: 1 }}>
            {isCreate && <ProcessTypeSelect onCheckNewValue={checkProcessTypeChange} />}

            {selectedProcessType !== '' && (
                <>
                    <Divider />
                    <GeneralInformationSection
                        activeDirectory={
                            isCreate ? ((selectedDirectory?.directoryItemId ?? '') as UUID) : activeDirectory
                        }
                        initialElementName={initialElementName}
                        withFolderField={isCreate}
                    />
                    <SpecificInformationSection
                        control={control}
                        onPrefill={isCreate && onFetchProcessConfig ? openSelector : undefined}
                    />
                </>
            )}

            {isCreate && isSelectorOpen && (
                <DirectoryItemSelector
                    open
                    onClose={handleSelect}
                    types={[ElementType.PROCESS_CONFIG]}
                    equipmentTypes={[selectedProcessType]}
                    itemFilter={itemFilter}
                    title="processConfigPrefill"
                    onlyLeaves
                    multiSelect={false}
                    validationButtonText="validate"
                />
            )}

            {isCreate && (
                <ProcessTypeChangeDialog
                    open={pendingProcessType !== null}
                    onCancel={cancelProcessTypeChange}
                    onConfirm={confirmProcessTypeChange}
                />
            )}
        </Stack>
    );
}
