/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */ import { FieldErrors } from 'react-hook-form';
import { FieldConstants } from './constants';

// when UniqueNameInput is used in a form, we need to disable the validation button while the name is being validated
export function isDisabledValidationButton(formErrors: FieldErrors, fieldName?: string): boolean {
    return Boolean(formErrors[fieldName ?? FieldConstants.NAME] || formErrors.root?.isValidating);
}
