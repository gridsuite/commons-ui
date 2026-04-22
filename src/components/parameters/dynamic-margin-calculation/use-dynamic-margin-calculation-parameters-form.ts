/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldValues } from 'react-hook-form';
import yup from '../../../utils/yupConfig';
import { DynamicMarginCalculationParametersInfos } from '../../../utils/types/dynamic-margin-calculation.type';
import { emptyFormData as timeDelayEmptyFormData, formSchema as timeDelayFormSchema } from './time-delay-parameters';
import {
    emptyFormData as loadsVariationsEmptyFormData,
    formSchema as loadsVariationsFormSchema,
} from './loads-variations-parameters';
import { ID } from '../../../utils';
import { PROVIDER } from '../common';
import { useParametersForm } from '../common/hook/use-parameters-form';
import {
    ACCURACY,
    CALCULATION_TYPE,
    LOAD_INCREASE_START_TIME,
    LOAD_INCREASE_STOP_TIME,
    LOAD_MODELS_RULE,
    LOADS_VARIATIONS,
    MARGIN_CALCULATION_START_TIME,
    START_TIME,
    STOP_TIME,
} from './constants';
import { TabValues } from './dynamic-margin-calculation.type';
import { UseComputationParametersFormReturn } from '../common/utils';

const formSchema = yup.object().shape({
    [PROVIDER]: yup.string().required(),
    [TabValues.TAB_TIME_DELAY]: timeDelayFormSchema,
    [TabValues.TAB_LOADS_VARIATIONS]: loadsVariationsFormSchema,
});

const emptyFormData = {
    [PROVIDER]: '',
    [TabValues.TAB_TIME_DELAY]: timeDelayEmptyFormData,
    [TabValues.TAB_LOADS_VARIATIONS]: loadsVariationsEmptyFormData,
};

export const toFormValues = (_params: DynamicMarginCalculationParametersInfos): FieldValues => ({
    [ID]: _params.id, // not shown in form
    [PROVIDER]: _params.provider,
    [TabValues.TAB_TIME_DELAY]: {
        [START_TIME]: _params.startTime,
        [STOP_TIME]: _params.stopTime,
        [MARGIN_CALCULATION_START_TIME]: _params.marginCalculationStartTime,
        [LOAD_INCREASE_START_TIME]: _params.loadIncreaseStartTime,
        [LOAD_INCREASE_STOP_TIME]: _params.loadIncreaseStopTime,
    },
    [TabValues.TAB_LOADS_VARIATIONS]: {
        [CALCULATION_TYPE]: _params.calculationType,
        [ACCURACY]: _params.accuracy,
        [LOAD_MODELS_RULE]: _params.loadModelsRule,
        [LOADS_VARIATIONS]: _params.loadsVariations,
    },
});

export const toParamsInfos = (_formData: FieldValues): DynamicMarginCalculationParametersInfos => ({
    id: _formData[ID],
    provider: _formData[PROVIDER],
    startTime: _formData[TabValues.TAB_TIME_DELAY][START_TIME],
    stopTime: _formData[TabValues.TAB_TIME_DELAY][STOP_TIME],
    marginCalculationStartTime: _formData[TabValues.TAB_TIME_DELAY][MARGIN_CALCULATION_START_TIME],
    loadIncreaseStartTime: _formData[TabValues.TAB_TIME_DELAY][LOAD_INCREASE_START_TIME],
    loadIncreaseStopTime: _formData[TabValues.TAB_TIME_DELAY][LOAD_INCREASE_STOP_TIME],
    calculationType: _formData[TabValues.TAB_LOADS_VARIATIONS][CALCULATION_TYPE],
    accuracy: _formData[TabValues.TAB_LOADS_VARIATIONS][ACCURACY],
    loadModelsRule: _formData[TabValues.TAB_LOADS_VARIATIONS][LOAD_MODELS_RULE],
    loadsVariations: _formData[TabValues.TAB_LOADS_VARIATIONS][LOADS_VARIATIONS],
});

export type UseParametersFormProps = {
    providers: Record<string, string>;
    params: DynamicMarginCalculationParametersInfos | null;
    // default values fields managed in grid-explore via directory server
    name: string | null;
    description: string | null;
};

export function useDynamicMarginCalculationParametersForm(
    props: Readonly<UseParametersFormProps>
): UseComputationParametersFormReturn {
    return useParametersForm({
        ...props,
        formSchema,
        emptyFormData,
        toFormValues,
    });
}
