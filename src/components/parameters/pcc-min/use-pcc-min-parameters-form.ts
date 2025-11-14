/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectSchema } from 'yup';
import type { UUID } from 'node:crypto';
import yup from '../../../utils/yupConfig';
import {
    fromPccMinParametersFormToParamValues,
    fromPccMinParamsDataToFormValues,
    fromStudyPccMinParamsDataToFormValues,
} from './pcc-min-form-utils';
import { useSnackMessage } from '../../../hooks';
import { NAME } from '../../inputs';
import { FILTERS, ID } from '../../../utils/constants/filterConstant';
import { getPccMinStudyParameters, PccMinParameters, updatePccMinParameters } from '../../../services/pcc-min';

export interface UsePccMinParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    paramsLoading: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
}

type UsePccMinParametersFormProps = {
    parametersUuid: UUID | null;
    name: string | null;
    description: string | null;
    studyUuid: UUID | null;
    parameters: PccMinParameters | null;
};

export const UsePccMinParametersForm = ({
    parametersUuid,
    studyUuid,
    parameters,
}: UsePccMinParametersFormProps): UsePccMinParametersFormReturn => {
    const [paramsLoading, setParamsLoading] = useState<boolean>(false);
    const { snackError } = useSnackMessage();

    const formSchema = useMemo(() => {
        return yup.object({
            [FILTERS]: yup.array().of(
                yup.object().shape({
                    [ID]: yup.string().required(),
                    [NAME]: yup.string().required(),
                })
            ),
        });
    }, []);

    const formMethods = useForm({
        defaultValues: {
            [FILTERS]: [],
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { reset } = formMethods;

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            if (studyUuid) {
                updatePccMinParameters(studyUuid, fromPccMinParametersFormToParamValues(formData)).catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'updatePccMinParametersError',
                    });
                });
            }
        },
        [snackError, studyUuid]
    );

    // GridExplore init case
    useEffect(() => {
        if (parametersUuid) {
            const timer = setTimeout(() => {
                setParamsLoading(true);
            }, 700);
            getPccMinStudyParameters(parametersUuid)
                .then((params) => {
                    reset(fromPccMinParamsDataToFormValues(params));
                })
                .catch((error: Error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    });
                })
                .finally(() => {
                    clearTimeout(timer);
                    setParamsLoading(false);
                });
        }
    }, [parametersUuid, reset, snackError]);

    // GridStudy init case
    useEffect(() => {
        if (parameters) {
            reset(fromStudyPccMinParamsDataToFormValues(parameters));
        }
    }, [parameters, reset]);

    return {
        formMethods,
        formSchema,
        paramsLoading,
        onSaveInline,
    };
};
