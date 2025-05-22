/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createContext, PropsWithChildren, useMemo } from 'react';
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import type { ObjectSchema } from 'yup';
import { getSystemLanguage } from '../../../../hooks';

type CustomFormContextProps<TFieldValues extends FieldValues = FieldValues> = {
    removeOptional?: boolean;
    validationSchema: ObjectSchema<TFieldValues>;
    language?: string;
    isNodeBuilt?: boolean;
    isUpdate?: boolean;
};

export type MergedFormContextProps<TFieldValues extends FieldValues = FieldValues> = UseFormReturn<TFieldValues> &
    CustomFormContextProps<TFieldValues>;

// TODO found how to manage generic type
export const CustomFormContext = createContext<CustomFormContextProps>({
    removeOptional: false,
    validationSchema: yup.object(),
    language: getSystemLanguage(),
    isNodeBuilt: false,
    isUpdate: false,
});

export function CustomFormProvider<TFieldValues extends FieldValues = FieldValues>(
    props: PropsWithChildren<MergedFormContextProps<TFieldValues>>
) {
    // TODO found how to manage generic type
    const { validationSchema, removeOptional, language, isNodeBuilt, isUpdate, children, ...formMethods } =
        props as PropsWithChildren<MergedFormContextProps<FieldValues>>;

    return (
        <FormProvider {...formMethods}>
            <CustomFormContext.Provider
                value={useMemo(
                    () => ({ validationSchema, removeOptional, language, isNodeBuilt, isUpdate }),
                    [validationSchema, removeOptional, language, isNodeBuilt, isUpdate]
                )}
            >
                {children}
            </CustomFormContext.Provider>
        </FormProvider>
    );
}
