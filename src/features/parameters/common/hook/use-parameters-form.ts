/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../name-element-editor';
import { UseComputationParametersFormReturn } from '../utils';

export type UseParametersFormProps<TParams> = {
    providers: Record<string, string>;
    params: TParams | null;
    name: string | null;
    description: string | null;
    formSchema: ObjectSchema<any>;
    emptyFormData: FieldValues;
    toFormValues: (params: TParams) => FieldValues;
};

export function useParametersForm<TParams>({
    providers,
    params,
    name: initialName,
    description: initialDescription,
    formSchema: baseFormSchema,
    emptyFormData,
    toFormValues,
}: Readonly<UseParametersFormProps<TParams>>): UseComputationParametersFormReturn {
    const paramsLoaded = useMemo(() => !!params, [params]);

    const formattedProviders = useMemo(
        () =>
            Object.entries(providers).map(([key, value]) => ({
                id: key,
                label: value,
            })),
        [providers]
    );

    const returnFormSchema = useMemo(() => {
        return initialName === null ? baseFormSchema : baseFormSchema.concat(getNameElementEditorSchema(initialName));
    }, [initialName, baseFormSchema]);

    const newEmptyFormData: any = useMemo(() => {
        return {
            ...(initialName === null ? {} : getNameElementEditorEmptyFormData(initialName, initialDescription)),
            ...emptyFormData,
        };
    }, [initialName, initialDescription, emptyFormData]);

    const returnFormMethods = useForm({
        defaultValues: newEmptyFormData,
        resolver: yupResolver(returnFormSchema),
    });

    const { reset } = returnFormMethods;

    useEffect(() => {
        if (params) {
            reset(toFormValues(params));
        }
    }, [params, paramsLoaded, reset, toFormValues]);

    return {
        formMethods: returnFormMethods,
        formSchema: returnFormSchema,
        paramsLoaded,
        formattedProviders,
    };
}
