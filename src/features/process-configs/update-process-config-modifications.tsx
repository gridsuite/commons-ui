/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useFieldArray } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { DirectoryItemsInput, DndColumn, DndColumnType, DndTable } from '../../components';
import { ElementType } from '../../utils';

export function UpdateProcessConfigModifications({ name }: { name: string }) {
    const intl = useIntl();
    const useFieldArrayModifications = useFieldArray({
        name,
    });

    const modificationSelector = useCallback(
        (rowIndex: number) => (
            <DirectoryItemsInput
                name={`${name}[${rowIndex}].modification`}
                allowMultiSelect={false}
                elementType={ElementType.MODIFICATION}
                titleId="modifications"
                label={undefined}
            />
        ),
        [name]
    );

    const columnsDefinition = useMemo<DndColumn[]>(() => {
        return [
            {
                dataKey: name,
                type: DndColumnType.CUSTOM, // ColumnDirectoryItem does not allow allowMultiSelect to false
                editable: true,
                label: intl.formatMessage({ id: 'process_config/modifications' }),
                component: modificationSelector,
            },
        ];
    }, [modificationSelector, name, intl]);

    const createModification = () => [{ modification: [] }];

    return (
        <DndTable
            name={name}
            useFieldArrayOutput={useFieldArrayModifications}
            createRows={createModification}
            columnsDefinition={columnsDefinition}
            withAddRowsDialog={false}
        />
    );
}
