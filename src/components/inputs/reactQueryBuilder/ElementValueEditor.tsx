/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { validate as uuidValidate } from 'uuid';
import { useEffect } from 'react';
import { useCustomFormContext } from '../reactHookForm/provider/useCustomFormContext';
import { fetchElementsInfos } from '../../../services';
import { DirectoryItemsInput } from '../reactHookForm/DirectoryItemsInput';
import { type ElementAttributes, ElementType } from '../../../utils';

interface ElementValueEditorProps {
    name: string;
    elementType: ElementType;
    equipmentTypes?: string[];
    titleId: string;
    hideErrorMessage: boolean;
    onChange?: (e: any) => void;
    itemFilter?: (val: ElementAttributes) => boolean;
    defaultValue?: any;
}

export function ElementValueEditor({
    defaultValue,
    name,
    elementType,
    equipmentTypes,
    titleId,
    hideErrorMessage,
    itemFilter,
    onChange,
}: Readonly<ElementValueEditorProps>) {
    const { setValue } = useCustomFormContext();

    useEffect(() => {
        if (
            defaultValue &&
            Array.isArray(defaultValue) &&
            defaultValue.length > 0 &&
            defaultValue[0].length > 0 &&
            uuidValidate(defaultValue[0])
        ) {
            fetchElementsInfos(defaultValue).then((childrenWithMetadata) => {
                setValue(
                    name,
                    childrenWithMetadata.map((v: ElementAttributes) => {
                        return {
                            id: v.elementUuid,
                            name: v.elementName,
                            specificMetadata: v.specificMetadata,
                        };
                    })
                );
            });
        }
    }, [name, defaultValue, elementType, setValue]);

    return (
        <DirectoryItemsInput
            name={name}
            elementType={elementType}
            equipmentTypes={equipmentTypes}
            titleId={titleId}
            hideErrorMessage={hideErrorMessage}
            label="filter"
            itemFilter={itemFilter}
            onChange={onChange}
            labelRequiredFromContext={false}
        />
    );
}
