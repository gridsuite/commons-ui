/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { FilterIdentifier, FILTERS, FILTER_ID, FILTER_NAME } from '../../../utils/constants/filterConstant';
import {
    GENERATORS_SELECTION_TYPE,
    HIGH_VOLTAGE_LIMIT,
    LOW_VOLTAGE_LIMIT,
    REACTIVE_SLACKS_THRESHOLD,
    SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
    SHUNT_COMPENSATORS_SELECTION_TYPE,
    TRANSFORMERS_SELECTION_TYPE,
    UPDATE_BUS_VOLTAGE,
    VARIABLE_Q_GENERATORS,
    VARIABLE_SHUNT_COMPENSATORS,
    VARIABLE_TRANSFORMERS,
    VOLTAGE_LIMITS_DEFAULT,
    VOLTAGE_LIMITS_MODIFICATION,
} from './constants';
import { fetchElementNames } from '../../../services/directory';

export enum EquipmentsSelectionType {
    ALL_EXCEPT = 'ALL_EXCEPT',
    NONE_EXCEPT = 'NONE_EXCEPT',
}

type FilterInfos = UUID | FilterIdentifier;

type VoltageLimitParam<T extends FilterInfos> = {
    [FILTERS]: T[];
    [LOW_VOLTAGE_LIMIT]: number;
    [HIGH_VOLTAGE_LIMIT]: number;
};

interface VoltageInitParameters<T extends FilterInfos> {
    [UPDATE_BUS_VOLTAGE]: boolean;
    [REACTIVE_SLACKS_THRESHOLD]: number;
    [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]: number;
    [VOLTAGE_LIMITS_MODIFICATION]: VoltageLimitParam<T>[];
    [VOLTAGE_LIMITS_DEFAULT]: VoltageLimitParam<T>[];
    [GENERATORS_SELECTION_TYPE]: EquipmentsSelectionType;
    [VARIABLE_Q_GENERATORS]: T[];
    [TRANSFORMERS_SELECTION_TYPE]: EquipmentsSelectionType;
    [VARIABLE_TRANSFORMERS]: T[];
    [SHUNT_COMPENSATORS_SELECTION_TYPE]: EquipmentsSelectionType;
    [VARIABLE_SHUNT_COMPENSATORS]: T[];
}

// Dtos exchanged with voltage-init server
export type VoltageInitParametersInfosEnriched = VoltageInitParameters<FilterIdentifier>;
export type VoltageInitParametersInfos = VoltageInitParameters<UUID>;

// Dtos exchanged with study server, with study-specific 'applyModifications' parameter
export type VoltageInitStudyParameters = {
    applyModifications: boolean;
    computationParameters: VoltageInitParametersInfos | null;
};
export type VoltageInitStudyParametersEnriched = {
    applyModifications: boolean;
    computationParameters: VoltageInitParametersInfosEnriched | null;
};

export function mapVoltageInitParameters(parameters: VoltageInitParametersInfosEnriched): VoltageInitParametersInfos {
    const mapFilterIdentifierToIds = (filters: FilterIdentifier[] | undefined): UUID[] => {
        return filters ? filters.map((f) => f[FILTER_ID]) : [];
    };
    const mapVoltageLimitParams = (
        voltageLimitParams: VoltageLimitParam<FilterIdentifier>[] | undefined
    ): VoltageLimitParam<UUID>[] => {
        return voltageLimitParams
            ? voltageLimitParams.map((vlp) => {
                  return {
                      ...vlp,
                      [FILTERS]: mapFilterIdentifierToIds(vlp[FILTERS]),
                  };
              })
            : [];
    };
    return {
        ...parameters,
        [VOLTAGE_LIMITS_MODIFICATION]: mapVoltageLimitParams(parameters[VOLTAGE_LIMITS_MODIFICATION]),
        [VOLTAGE_LIMITS_DEFAULT]: mapVoltageLimitParams(parameters[VOLTAGE_LIMITS_DEFAULT]),
        [VARIABLE_Q_GENERATORS]: mapFilterIdentifierToIds(parameters[VARIABLE_Q_GENERATORS]),
        [VARIABLE_TRANSFORMERS]: mapFilterIdentifierToIds(parameters[VARIABLE_TRANSFORMERS]),
        [VARIABLE_SHUNT_COMPENSATORS]: mapFilterIdentifierToIds(parameters[VARIABLE_SHUNT_COMPENSATORS]),
    };
}

function getFilterIdentifierIds(parameters: VoltageInitParametersInfos): Set<string> {
    const allFilterIds = new Set<string>();

    parameters[VOLTAGE_LIMITS_MODIFICATION]?.forEach((vlm) => {
        vlm[FILTERS]?.forEach((id) => allFilterIds.add(id));
    });
    parameters[VOLTAGE_LIMITS_DEFAULT]?.forEach((vld) => {
        vld[FILTERS]?.forEach((id) => allFilterIds.add(id));
    });
    parameters[VARIABLE_Q_GENERATORS]?.forEach((id) => allFilterIds.add(id));
    parameters[VARIABLE_TRANSFORMERS]?.forEach((id) => allFilterIds.add(id));
    parameters[VARIABLE_SHUNT_COMPENSATORS]?.forEach((id) => allFilterIds.add(id));

    return allFilterIds;
}

export function enrichVoltageInitParameters(
    parameters: VoltageInitParametersInfos
): Promise<VoltageInitParametersInfosEnriched> {
    const allElementIds = getFilterIdentifierIds(parameters);

    return fetchElementNames(allElementIds).then((elementNames) => {
        const mapIdsToFilterIdentifiers = (ids: UUID[] | undefined): FilterIdentifier[] => {
            return ids
                ? ids.map((id) => ({
                      [FILTER_ID]: id,
                      [FILTER_NAME]: elementNames.get(id) ?? null,
                  }))
                : [];
        };
        const mapVoltageLimitParams = (
            voltageLimitParams: VoltageLimitParam<UUID>[] | undefined
        ): VoltageLimitParam<FilterIdentifier>[] => {
            return voltageLimitParams
                ? voltageLimitParams.map((vlp) => {
                      return {
                          ...vlp,
                          [FILTERS]: mapIdsToFilterIdentifiers(vlp[FILTERS]),
                      };
                  })
                : [];
        };
        return {
            ...parameters,
            [VOLTAGE_LIMITS_MODIFICATION]: mapVoltageLimitParams(parameters[VOLTAGE_LIMITS_MODIFICATION]),
            [VOLTAGE_LIMITS_DEFAULT]: mapVoltageLimitParams(parameters[VOLTAGE_LIMITS_DEFAULT]),
            [VARIABLE_Q_GENERATORS]: mapIdsToFilterIdentifiers(parameters[VARIABLE_Q_GENERATORS]),
            [VARIABLE_TRANSFORMERS]: mapIdsToFilterIdentifiers(parameters[VARIABLE_TRANSFORMERS]),
            [VARIABLE_SHUNT_COMPENSATORS]: mapIdsToFilterIdentifiers(parameters[VARIABLE_SHUNT_COMPENSATORS]),
        };
    });
}
