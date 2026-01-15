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
import { DESCRIPTION, NAME } from '../../inputs';
import { FILTERS, ID } from '../../../utils/constants/filterConstant';
import { fetchPccMinParameters, PccMinParameters, updatePccMinParameters } from '../../../services/pcc-min';
import { updateParameter } from '../../../services';
import { ElementType, snackWithFallback } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';

export interface UsePccMinParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    paramsLoading: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

type UsePccMinParametersFormProps =
    | {
          parametersUuid: UUID;
          name: string;
          description: string | null;
          studyUuid: null;
          parameters: null;
      }
    | {
          parametersUuid: null;
          name: null;
          description: null;
          studyUuid: UUID | null;
          parameters: PccMinParameters | null;
      };

export const UsePccMinParametersForm = ({
    name,
    description,
    parametersUuid,
    studyUuid,
    parameters,
}: UsePccMinParametersFormProps): UsePccMinParametersFormReturn => {
    const [paramsLoading, setParamsLoading] = useState<boolean>(false);
    const { snackError } = useSnackMessage();

    const formSchema = useMemo(() => {
        return yup
            .object({
                [FILTERS]: yup.array().of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                ),
            })
            .concat(getNameElementEditorSchema(name));
    }, [name]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),

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

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid) {
                updateParameter(
                    parametersUuid,
                    fromPccMinParametersFormToParamValues(formData),
                    formData[NAME],
                    ElementType.PCC_MIN_PARAMETERS,
                    formData[DESCRIPTION] ?? ''
                ).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updatePccMinParametersError' });
                });
            }
        },
        [parametersUuid, snackError]
    );
    // GridExplore init case
    useEffect(() => {
        if (parametersUuid) {
            const timer = setTimeout(() => {
                setParamsLoading(true);
            }, 700);
            fetchPccMinParameters(parametersUuid)
                .then((params) => {
                    reset({
                        ...getNameElementEditorEmptyFormData(name, description),
                        ...fromPccMinParamsDataToFormValues(params),
                    });
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
    }, [description, name, parametersUuid, reset, snackError]);

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
        onSaveDialog,
    };
};
