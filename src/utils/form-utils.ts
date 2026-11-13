/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldErrors, FieldValues } from 'react-hook-form';
import { FieldConstants } from './constants';
import { deepEqual } from './algos';

// when UniqueNameInput is used in a form, we need to disable the validation button while the name is being validated
export function isDisabledValidationButton(formErrors: FieldErrors, fieldName?: string): boolean {
    return Boolean(formErrors[fieldName ?? FieldConstants.NAME] || formErrors.root?.isValidating);
}

export function isOnlyNameOrDescriptionModified(values: FieldValues, defaultValues: FieldValues | undefined): boolean {
    if (!defaultValues) {
        return false;
    }
    const contentFields = new Set([...Object.keys(values), ...Object.keys(defaultValues)]);
    contentFields.delete(FieldConstants.NAME);
    contentFields.delete(FieldConstants.DESCRIPTION);
    return [...contentFields].every((field) => deepEqual(values[field], defaultValues[field]));
}
