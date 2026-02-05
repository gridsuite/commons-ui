/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { UUID } from 'node:crypto';
import { ElementType, FieldConstants } from '../utils';
import { useDebounce } from './useDebounce';
import { elementAlreadyExists } from '../services';

interface UseUniqueNameValidationParams {
    name: string;
    currentName?: string;
    elementType: ElementType;
    activeDirectory?: string;
    elementExists?: (directory: UUID, name: string, type: ElementType) => Promise<boolean>;
    isPrefilled?: boolean;
}

export function useUniqueNameValidation({
    name,
    currentName = '',
    elementType,
    activeDirectory,
    elementExists = elementAlreadyExists,
    isPrefilled = false,
}: UseUniqueNameValidationParams) {
    const {
        setError,
        clearErrors,
        trigger,
        formState: { errors, defaultValues, isDirty: formIsDirty },
    } = useFormContext();

    const {
        field: { value },
        fieldState: { isDirty: fieldIsDirty },
    } = useController({ name });

    const {
        field: { value: selectedDirectory },
    } = useController({
        name: FieldConstants.DIRECTORY,
    });

    const defaultFieldValue = defaultValues?.[name];
    const directory = selectedDirectory || activeDirectory;

    // This is a trick to share the custom validation state among the form : while this error is present, we can't validate the form
    const isValidating = errors.root?.isValidating;

    const handleCheckName = useCallback(
        (nameValue: string) => {
            if (nameValue !== currentName && directory) {
                elementExists(directory, nameValue, elementType)
                    .then((alreadyExist) => {
                        if (alreadyExist) {
                            setError(name, {
                                type: 'validate',
                                message: 'use-unique-name-validation/nameAlreadyUsed',
                            });
                        }
                    })
                    .catch(() => {
                        setError(name, {
                            type: 'validate',
                            message: 'use-unique-name-validation/nameValidityCheckErrorMsg',
                        });
                    })
                    .finally(() => {
                        clearErrors('root.isValidating');
                        /* force form to validate, otherwise form
                        will remain invalid (setError('root.isValidating') invalid form and clearErrors does not affect form isValid state :
                        see documentation : https://react-hook-form.com/docs/useform/clearerrors) */
                        trigger('root.isValidating');
                    });
            } else {
                trigger('root.isValidating');
            }
        },
        [currentName, directory, elementType, name, setError, clearErrors, trigger, elementExists]
    );

    const debouncedHandleCheckName = useDebounce(handleCheckName, 700);

    // We have to use an useEffect because the name can change from outside of this component (when we upload a case file for instance)
    useEffect(() => {
        const trimmedValue = value.trim();

        if (selectedDirectory) {
            debouncedHandleCheckName(trimmedValue);
        }

        // if the name is unchanged, we don't do custom validation
        if (!isPrefilled && !fieldIsDirty) {
            clearErrors(name);
            return;
        }
        if (isPrefilled && !formIsDirty) {
            clearErrors(name);
            return;
        }

        if (isPrefilled && trimmedValue === defaultFieldValue && trimmedValue.length > 0) {
            return;
        }

        if (trimmedValue) {
            clearErrors(name);
            setError('root.isValidating', {
                type: 'validate',
                message: 'use-unique-name-validation/cantSubmitWhileValidating',
            });
            debouncedHandleCheckName(trimmedValue);
        } else {
            clearErrors('root.isValidating');
            setError(name, {
                type: 'validate',
                message: 'use-unique-name-validation/nameEmpty',
            });
        }
    }, [
        value,
        debouncedHandleCheckName,
        setError,
        clearErrors,
        name,
        fieldIsDirty,
        formIsDirty,
        isPrefilled,
        defaultFieldValue,
        directory,
        selectedDirectory,
    ]);

    return {
        isValidating,
    };
}
