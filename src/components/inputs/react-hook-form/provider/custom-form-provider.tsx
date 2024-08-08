/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { createContext, PropsWithChildren } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { getSystemLanguage, GsLangUser } from '../../../../utils/language';

type CustomFormContextProps = {
    removeOptional?: boolean;
    validationSchema: yup.AnySchema;
    language?: GsLangUser;
};

export type MergedFormContextProps = UseFormReturn<any> & CustomFormContextProps;

type CustomFormProviderProps = PropsWithChildren<MergedFormContextProps>;

export const CustomFormContext = createContext<CustomFormContextProps>({
    removeOptional: false,
    validationSchema: yup.object(),
    language: getSystemLanguage(),
});

function CustomFormProvider(props: CustomFormProviderProps) {
    const { validationSchema, removeOptional, language, children, ...formMethods } = props;

    return (
        <FormProvider {...formMethods}>
            <CustomFormContext.Provider
                value={React.useMemo(
                    () => ({
                        validationSchema,
                        removeOptional,
                        language,
                    }),
                    [validationSchema, removeOptional, language]
                )}
            >
                {children}
            </CustomFormContext.Provider>
        </FormProvider>
    );
}

export default CustomFormProvider;
