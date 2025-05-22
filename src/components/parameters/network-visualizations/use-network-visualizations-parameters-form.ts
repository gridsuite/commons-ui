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
import { UUID } from 'crypto';
import yup from '../../../utils/yupConfig';
import { DESCRIPTION_INPUT, NAME } from '../../inputs';
import {
    PARAM_CENTER_LABEL,
    PARAM_COMPONENT_LIBRARY,
    PARAM_DIAGONAL_LABEL,
    PARAM_INIT_NAD_WITH_GEO_DATA,
    PARAM_LINE_FLOW_MODE,
    PARAM_LINE_FULL_PATH,
    PARAM_LINE_PARALLEL_PATH,
    PARAM_MAP_BASEMAP,
    PARAM_MAP_MANUAL_REFRESH,
    PARAM_SUBSTATION_LAYOUT,
    NetworkVisualizationTabValues as TabValues,
} from './constants';
import {
    getNetworkVisualizationsParameters,
    setStudyNetworkVisualizationParameters,
    updateParameter,
} from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType } from '../../../utils';
import { NetworkVisualizationParameters } from './network-visualizations.types';

export interface UseNetworkVisualizationParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    selectedTab: TabValues;
    handleTabChange: (event: SyntheticEvent, newValue: TabValues) => void;
    paramsLoaded: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

export const useNetworkVisualizationParametersForm = (
    parametersUuid: UUID | null,
    studyUuid: UUID | null,
    parameters: NetworkVisualizationParameters | null,
    name: string | null,
    description: string | null
): UseNetworkVisualizationParametersFormReturn => {
    const [selectedTab, setSelectedTab] = useState(TabValues.MAP);
    const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
    const { snackError } = useSnackMessage();

    const handleTabChange = useCallback((event: SyntheticEvent, newValue: TabValues) => {
        setSelectedTab(newValue);
    }, []);

    // TODO DBR mutualiser getDialogLoadFlowParametersFormSchema + composant unique/desc ?
    const formSchema = useMemo(() => {
        return yup.object({
            [NAME]: yup.string().required(),
            [DESCRIPTION_INPUT]: yup.string(),
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
                [PARAM_INIT_NAD_WITH_GEO_DATA]: yup.boolean(),
            }),
        });
    }, []);

    // TODO DBR mutualiser dft name/descr
    const formMethods = useForm({
        defaultValues: {
            [NAME]: name,
            [DESCRIPTION_INPUT]: description,
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
                [PARAM_INIT_NAD_WITH_GEO_DATA]: false,
            },
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { reset } = formMethods;

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            console.log('DBG DBR saveinline', formData);
            if (studyUuid) {
                setStudyNetworkVisualizationParameters(studyUuid, formData).catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'updateNetworkVisualizationsParametersError',
                    });
                });
            }
        },
        [snackError, studyUuid]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            console.log('DBG DBR saveDialog', formData);
            if (parametersUuid) {
                updateParameter(
                    parametersUuid,
                    formData,
                    formData[NAME],
                    ElementType.NETWORK_VISUALIZATIONS_PARAMETERS,
                    formData[DESCRIPTION_INPUT] ?? ''
                ).catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'updateNetworkVisualizationsParametersError',
                    });
                });
            }
        },
        [parametersUuid, snackError]
    );

    // Gridexplore init case
    useEffect(() => {
        if (parametersUuid) {
            setParamsLoaded(false);
            getNetworkVisualizationsParameters(parametersUuid)
                .then((params) => {
                    reset(params);
                    setParamsLoaded(true);
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'getNetworkVisualizationsParametersError',
                    });
                });
        }
    }, [parametersUuid, reset, snackError]);

    // GridStudy init case
    useEffect(() => {
        if (parameters) {
            reset(parameters);
            setParamsLoaded(true);
        }
    }, [parameters, reset]);

    return {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        paramsLoaded,
        onSaveInline,
        onSaveDialog,
    };
};
