/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectSchema } from 'yup';
import type { UUID } from 'node:crypto';
import yup from '../../../utils/yupConfig';
import { DESCRIPTION, NAME } from '../../inputs';
import {
    PARAM_CENTER_LABEL,
    PARAM_COMPONENT_LIBRARY,
    PARAM_DIAGONAL_LABEL,
    PARAM_LINE_FLOW_MODE,
    PARAM_LINE_FULL_PATH,
    PARAM_LINE_PARALLEL_PATH,
    PARAM_MAP_BASEMAP,
    PARAM_MAP_MANUAL_REFRESH,
    PARAM_SUBSTATION_LAYOUT,
    NetworkVisualizationTabValues as TabValues,
    PARAM_NAD_POSITIONS_GENERATION_MODE,
} from './constants';
import {
    getNetworkVisualizationsParameters,
    setStudyNetworkVisualizationParameters,
    updateParameter,
} from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType } from '../../../utils';
import { NetworkVisualizationParameters } from './network-visualizations.types';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { snackWithFallback } from '../../../utils/error';

export interface UseNetworkVisualizationParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    selectedTab: TabValues;
    handleTabChange: (event: SyntheticEvent, newValue: TabValues) => void;
    paramsLoading: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

// GridExplore versus GridStudy exclusive input params
type UseNetworkVisualizationParametersFormProps =
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
          parameters: NetworkVisualizationParameters | null;
      };

export const useNetworkVisualizationParametersForm = ({
    parametersUuid,
    name,
    description,
    studyUuid,
    parameters,
}: UseNetworkVisualizationParametersFormProps): UseNetworkVisualizationParametersFormReturn => {
    const [selectedTab, setSelectedTab] = useState(TabValues.MAP);
    const [paramsLoading, setParamsLoading] = useState<boolean>(false);
    const { snackError } = useSnackMessage();

    const handleTabChange = useCallback((event: SyntheticEvent, newValue: TabValues) => {
        setSelectedTab(newValue);
    }, []);

    const formSchema = useMemo(() => {
        return yup
            .object({
                [TabValues.MAP]: yup.object().shape({
                    [PARAM_LINE_FULL_PATH]: yup.boolean(),
                    [PARAM_LINE_PARALLEL_PATH]: yup.boolean(),
                    [PARAM_LINE_FLOW_MODE]: yup.string(),
                    [PARAM_MAP_MANUAL_REFRESH]: yup.boolean(),
                    [PARAM_MAP_BASEMAP]: yup.string(),
                }),
                [TabValues.SINGLE_LINE_DIAGRAM]: yup.object().shape({
                    [PARAM_DIAGONAL_LABEL]: yup.boolean(),
                    [PARAM_CENTER_LABEL]: yup.boolean(),
                    [PARAM_SUBSTATION_LAYOUT]: yup.string(),
                    [PARAM_COMPONENT_LIBRARY]: yup.string(),
                }),
                [TabValues.NETWORK_AREA_DIAGRAM]: yup.object().shape({
                    [PARAM_NAD_POSITIONS_GENERATION_MODE]: yup.string(),
                }),
            })
            .concat(getNameElementEditorSchema(name));
    }, [name]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [TabValues.MAP]: {
                [PARAM_LINE_FULL_PATH]: false,
                [PARAM_LINE_PARALLEL_PATH]: false,
                [PARAM_LINE_FLOW_MODE]: '',
                [PARAM_MAP_MANUAL_REFRESH]: false,
                [PARAM_MAP_BASEMAP]: '',
            },
            [TabValues.SINGLE_LINE_DIAGRAM]: {
                [PARAM_DIAGONAL_LABEL]: false,
                [PARAM_CENTER_LABEL]: false,
                [PARAM_SUBSTATION_LAYOUT]: '',
                [PARAM_COMPONENT_LIBRARY]: '',
            },
            [TabValues.NETWORK_AREA_DIAGRAM]: {
                [PARAM_NAD_POSITIONS_GENERATION_MODE]: '',
            },
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { reset } = formMethods;

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            if (studyUuid) {
                setStudyNetworkVisualizationParameters(studyUuid, formData).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateNetworkVisualizationsParametersError' });
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
                    formData,
                    formData[NAME],
                    ElementType.NETWORK_VISUALIZATIONS_PARAMETERS,
                    formData[DESCRIPTION] ?? ''
                ).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateNetworkVisualizationsParametersError' });
                });
            }
        },
        [parametersUuid, snackError]
    );

    // Gridexplore init case
    useEffect(() => {
        if (parametersUuid) {
            const timer = setTimeout(() => {
                setParamsLoading(true);
            }, 700);
            getNetworkVisualizationsParameters(parametersUuid)
                .then((params) => {
                    reset(params);
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'getNetworkVisualizationsParametersError' });
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
            reset(parameters);
        }
    }, [parameters, reset]);

    return {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        paramsLoading,
        onSaveInline,
        onSaveDialog,
    };
};
