/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, array, number, object, string } from 'yup';
import {
    addSelectedFieldToRows,
    DeepNullable,
    FieldConstants,
    ModificationType,
    NORMALIZED_PERCENTAGE,
    YUP_REQUIRED,
} from '../../../utils';
import { GenerationDispatchDto } from './generationDispatch.types';

const getGeneratorsFiltersSchema = () => {
    return array().of(
        object().shape({
            [FieldConstants.ID]: string().required(),
            [FieldConstants.NAME]: string().required(),
        })
    );
};

const getGeneratorsFrequencyReserveSchema = () => {
    return array().of(
        object().shape({
            [FieldConstants.GENERATORS_FILTERS]: array()
                .of(
                    object().shape({
                        [FieldConstants.ID]: string().required(),
                        [FieldConstants.NAME]: string().required(),
                    })
                )
                .min(1, YUP_REQUIRED)
                .required(),
            [FieldConstants.FREQUENCY_RESERVE]: number()
                .nullable()
                .min(0, NORMALIZED_PERCENTAGE)
                .max(100, NORMALIZED_PERCENTAGE)
                .required(),
        })
    );
};

const getSubstationsGeneratorsOrderingSchema = () => {
    return array().of(
        object().shape({
            [FieldConstants.SUBSTATION_IDS]: array().of(string().required()).min(1, YUP_REQUIRED).required(),
        })
    );
};

export const generationDispatchFormSchema = object()
    .shape({
        [FieldConstants.LOSS_COEFFICIENT]: number()
            .nullable()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE)
            .required(),
        [FieldConstants.DEFAULT_OUTAGE_RATE]: number()
            .nullable()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE)
            .required(),
        [FieldConstants.GENERATORS_WITHOUT_OUTAGE]: getGeneratorsFiltersSchema(),
        [FieldConstants.GENERATORS_WITH_FIXED_ACTIVE_POWER]: getGeneratorsFiltersSchema(),
        [FieldConstants.GENERATORS_FREQUENCY_RESERVES]: getGeneratorsFrequencyReserveSchema(),
        [FieldConstants.SUBSTATIONS_GENERATORS_ORDERING]: getSubstationsGeneratorsOrderingSchema(),
    })
    .required();

export type GenerationDispatchFormData = InferType<typeof generationDispatchFormSchema>;

export const generationDispatchEmptyFormData: DeepNullable<GenerationDispatchFormData> = {
    [FieldConstants.LOSS_COEFFICIENT]: null,
    [FieldConstants.DEFAULT_OUTAGE_RATE]: null,
    [FieldConstants.GENERATORS_WITHOUT_OUTAGE]: [],
    [FieldConstants.GENERATORS_WITH_FIXED_ACTIVE_POWER]: [],
    [FieldConstants.GENERATORS_FREQUENCY_RESERVES]: [],
    [FieldConstants.SUBSTATIONS_GENERATORS_ORDERING]: [],
};

export const generationDispatchDtoToForm = (dto: GenerationDispatchDto): GenerationDispatchFormData => {
    return {
        lossCoefficient: dto.lossCoefficient,
        defaultOutageRate: dto.defaultOutageRate,
        generatorsWithoutOutage: dto.generatorsWithoutOutage ?? undefined,
        generatorsWithFixedActivePower: dto.generatorsWithFixedSupply ?? undefined,
        generatorsFrequencyReserve: dto.generatorsFrequencyReserve
            ? addSelectedFieldToRows(dto.generatorsFrequencyReserve)
            : [],
        substationsGeneratorsOrdering: dto.substationsGeneratorsOrdering
            ? addSelectedFieldToRows(dto.substationsGeneratorsOrdering)
            : [],
    };
};

export const generationDispatchFormToDto = (form: GenerationDispatchFormData): GenerationDispatchDto => {
    return {
        type: ModificationType.GENERATION_DISPATCH,
        lossCoefficient: form.lossCoefficient,
        defaultOutageRate: form.defaultOutageRate,
        generatorsWithoutOutage: form.generatorsWithoutOutage ?? null,
        generatorsWithFixedSupply: form.generatorsWithFixedActivePower ?? null,
        generatorsFrequencyReserve: form.generatorsFrequencyReserve ?? null,
        substationsGeneratorsOrdering: form.substationsGeneratorsOrdering ?? null,
    };
};
