/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { array, boolean, InferType, number, object, string } from 'yup';
import { FieldConstants, ModificationType, YUP_REQUIRED } from '../../../utils';
import { BalanceType, BalancesAdjustmentDto, ShiftEquipmentType, ShiftType } from './balancesAdjustment.types';

export const balancesAdjustmentFormSchema = (countryCodes: string[]) =>
    object()
        .shape({
            [FieldConstants.BALANCES_ADJUSTMENT]: object().shape({
                [FieldConstants.BALANCES_ADJUSTMENT_ZONES]: array()
                    .of(
                        object().shape({
                            [FieldConstants.SELECTED]: boolean().required(),
                            [FieldConstants.BALANCES_ADJUSTMENT_ZONE]: string().required(),
                            [FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES]: array()
                                .of(string().oneOf(countryCodes).required())
                                .min(1, YUP_REQUIRED)
                                .required(),
                            [FieldConstants.BALANCES_ADJUSTMENT_SHIFT_EQUIPMENT_TYPE]: string()
                                .oneOf(Object.values(ShiftEquipmentType))
                                .required(),
                            [FieldConstants.BALANCES_ADJUSTMENT_SHIFT_TYPE]: string()
                                .oneOf(Object.values(ShiftType))
                                .required(),
                            [FieldConstants.BALANCES_ADJUSTMENT_TARGET]: number().integer().required(),
                        })
                    )
                    .required(),
                [FieldConstants.BALANCES_ADJUSTMENT_ADVANCED]: object().shape({
                    [FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW]: boolean().required(),
                    [FieldConstants.BALANCES_ADJUSTMENT_WITH_RATIO_TAP_CHANGERS]: boolean().required(),
                    [FieldConstants.BALANCES_ADJUSTMENT_SUBTRACT_LOAD_FLOW_BALANCING]: boolean().required(),
                    [FieldConstants.BALANCES_ADJUSTMENT_MAX_NUMBER_ITERATIONS]: number()
                        .integer()
                        .positive()
                        .required(),
                    [FieldConstants.BALANCES_ADJUSTMENT_THRESHOLD_NET_POSITION]: number().positive().required(),
                    [FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES_TO_BALANCE]: array()
                        .of(string().oneOf(countryCodes).required())
                        .when(FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW, {
                            is: (withLoadFlow: boolean) => withLoadFlow,
                            then: (schema) => schema.min(1, YUP_REQUIRED),
                            otherwise: (schema) => schema.optional(),
                        })
                        .required(),
                    [FieldConstants.BALANCES_ADJUSTMENT_BALANCE_TYPE]: string()
                        .oneOf(Object.values(BalanceType))
                        .required(),
                }),
            }),
        })
        .required();

export type BalancesAdjustmentFormData = InferType<ReturnType<typeof balancesAdjustmentFormSchema>>;

export const balancesAdjustmentEmptyFormData: BalancesAdjustmentFormData = {
    [FieldConstants.BALANCES_ADJUSTMENT]: {
        [FieldConstants.BALANCES_ADJUSTMENT_ZONES]: [
            {
                [FieldConstants.SELECTED]: false,
                [FieldConstants.BALANCES_ADJUSTMENT_ZONE]: '',
                [FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES]: [],
                [FieldConstants.BALANCES_ADJUSTMENT_SHIFT_EQUIPMENT_TYPE]: ShiftEquipmentType.GENERATOR,
                [FieldConstants.BALANCES_ADJUSTMENT_SHIFT_TYPE]: ShiftType.PROPORTIONAL,
                [FieldConstants.BALANCES_ADJUSTMENT_TARGET]: 0,
            },
        ],
        [FieldConstants.BALANCES_ADJUSTMENT_ADVANCED]: {
            [FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW]: true,
            [FieldConstants.BALANCES_ADJUSTMENT_WITH_RATIO_TAP_CHANGERS]: false,
            [FieldConstants.BALANCES_ADJUSTMENT_SUBTRACT_LOAD_FLOW_BALANCING]: false,
            [FieldConstants.BALANCES_ADJUSTMENT_MAX_NUMBER_ITERATIONS]: 5,
            [FieldConstants.BALANCES_ADJUSTMENT_THRESHOLD_NET_POSITION]: 1,
            [FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES_TO_BALANCE]: ['FR'],
            [FieldConstants.BALANCES_ADJUSTMENT_BALANCE_TYPE]: BalanceType.PROPORTIONAL_TO_LOAD,
        },
    },
};

export const balancesAdjustmentDtoToForm = (dto: BalancesAdjustmentDto): BalancesAdjustmentFormData => ({
    [FieldConstants.BALANCES_ADJUSTMENT]: {
        [FieldConstants.BALANCES_ADJUSTMENT_ZONES]: (dto.areas ?? []).map((area) => ({
            [FieldConstants.SELECTED]: false,
            [FieldConstants.BALANCES_ADJUSTMENT_ZONE]: area.name,
            [FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES]: area.countries ?? [],
            [FieldConstants.BALANCES_ADJUSTMENT_SHIFT_EQUIPMENT_TYPE]: area.shiftEquipmentType,
            [FieldConstants.BALANCES_ADJUSTMENT_SHIFT_TYPE]: area.shiftType,
            [FieldConstants.BALANCES_ADJUSTMENT_TARGET]: area.netPosition,
        })),
        [FieldConstants.BALANCES_ADJUSTMENT_ADVANCED]: {
            [FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW]: dto.withLoadFlow,
            [FieldConstants.BALANCES_ADJUSTMENT_WITH_RATIO_TAP_CHANGERS]: dto.withRatioTapChangers,
            [FieldConstants.BALANCES_ADJUSTMENT_SUBTRACT_LOAD_FLOW_BALANCING]: dto.subtractLoadFlowBalancing,
            [FieldConstants.BALANCES_ADJUSTMENT_MAX_NUMBER_ITERATIONS]: dto.maxNumberIterations,
            [FieldConstants.BALANCES_ADJUSTMENT_THRESHOLD_NET_POSITION]: dto.thresholdNetPosition,
            [FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES_TO_BALANCE]: dto.countriesToBalance ?? [],
            [FieldConstants.BALANCES_ADJUSTMENT_BALANCE_TYPE]: dto.balanceType,
        },
    },
});

// loadFlowParametersId is a lookup against the study's OWN saved loadflow parameters: it cannot be derived
// from form data alone, so the caller supplies it (gridstudy fetches it, GridExplore just preserves the
// previous value since it has no study context to pick a new one from).
export const balancesAdjustmentFormToDto = (
    form: BalancesAdjustmentFormData,
    loadFlowParametersId: string | null
): BalancesAdjustmentDto => ({
    type: ModificationType.BALANCES_ADJUSTMENT,
    maxNumberIterations:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_MAX_NUMBER_ITERATIONS
        ],
    thresholdNetPosition:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_THRESHOLD_NET_POSITION
        ],
    countriesToBalance:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES_TO_BALANCE
        ],
    balanceType:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_BALANCE_TYPE
        ],
    withLoadFlow:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW
        ],
    withRatioTapChangers:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_WITH_RATIO_TAP_CHANGERS
        ],
    loadFlowParametersId,
    subtractLoadFlowBalancing:
        form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ADVANCED][
            FieldConstants.BALANCES_ADJUSTMENT_SUBTRACT_LOAD_FLOW_BALANCING
        ],
    areas: form[FieldConstants.BALANCES_ADJUSTMENT][FieldConstants.BALANCES_ADJUSTMENT_ZONES].map((zone) => ({
        name: zone[FieldConstants.BALANCES_ADJUSTMENT_ZONE],
        countries: zone[FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES],
        shiftEquipmentType: zone[FieldConstants.BALANCES_ADJUSTMENT_SHIFT_EQUIPMENT_TYPE],
        shiftType: zone[FieldConstants.BALANCES_ADJUSTMENT_SHIFT_TYPE],
        netPosition: zone[FieldConstants.BALANCES_ADJUSTMENT_TARGET],
    })),
});
