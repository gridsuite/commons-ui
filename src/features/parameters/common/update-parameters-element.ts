/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { updateElement, updateParameter } from '../../../services';
import { ElementType, isOnlyNameOrDescriptionModified } from '../../../utils';

export function updateParametersElement<TFieldValues extends FieldValues>(
    formMethods: UseFormReturn<TFieldValues>,
    id: UUID,
    getParameters: () => unknown,
    name: string,
    parametersType: ElementType,
    description: string
) {
    if (isOnlyNameOrDescriptionModified(formMethods.getValues(), formMethods.formState.defaultValues)) {
        return updateElement(id, { elementName: name, description });
    }
    return updateParameter(id, getParameters(), name, parametersType, description);
}
