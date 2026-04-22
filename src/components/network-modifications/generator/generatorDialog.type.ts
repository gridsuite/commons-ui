/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants } from '../../../utils';
import { ActivePowerControlInfos } from '../common/activePowerControl';
import {
    MinMaxReactiveLimitsFormInfos,
    ReactiveCapabilityCurvePoints,
} from '../common/reactiveLimits/reactiveLimits.type';
import { ShortCircuitInfos } from '../common/shortCircuit/shortCircuitForm.type';
import { Property } from '../common/properties/properties.type';
import { ConnectablePositionFormInfos } from '../common/connectivity/connectivity.type';

export type GeneratorDialogSchemaBaseForm = {
    [FieldConstants.EQUIPMENT_NAME]?: string;
    [FieldConstants.ENERGY_SOURCE]: string | null;
    [FieldConstants.MAXIMUM_ACTIVE_POWER]: number | null;
    [FieldConstants.MINIMUM_ACTIVE_POWER]: number | null;
    [FieldConstants.RATED_NOMINAL_POWER]?: number | null;
    [FieldConstants.TRANSFORMER_REACTANCE]?: number | null;
    [FieldConstants.TRANSIENT_REACTANCE]?: number | null;
    [FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT]?: number | null;
    [FieldConstants.MARGINAL_COST]?: number | null;
    [FieldConstants.PLANNED_OUTAGE_RATE]?: number | null;
    [FieldConstants.FORCED_OUTAGE_RATE]?: number | null;

    [FieldConstants.CONNECTIVITY]: {
        [FieldConstants.VOLTAGE_LEVEL]: { [FieldConstants.ID]?: string };
        [FieldConstants.BUS_OR_BUSBAR_SECTION]: { [FieldConstants.ID]?: string };
        [FieldConstants.CONNECTION_DIRECTION]?: string;
        [FieldConstants.CONNECTION_NAME]?: string;
        [FieldConstants.CONNECTION_POSITION]?: number;
        [FieldConstants.CONNECTED]?: boolean;
    };

    [FieldConstants.VOLTAGE_REGULATION]?: boolean | null;
    [FieldConstants.ACTIVE_POWER_SET_POINT]?: number;
    [FieldConstants.REACTIVE_POWER_SET_POINT]?: number | null;
    [FieldConstants.VOLTAGE_REGULATION_TYPE]?: string | null;
    [FieldConstants.VOLTAGE_SET_POINT]?: number | null;
    [FieldConstants.Q_PERCENT]?: number | null;

    [FieldConstants.VOLTAGE_LEVEL]?: {
        [FieldConstants.ID]?: string;
        [FieldConstants.NAME]?: string;
        [FieldConstants.SUBSTATION_ID]?: string;
        [FieldConstants.NOMINAL_VOLTAGE]?: string;
        [FieldConstants.TOPOLOGY_KIND]?: string | null;
    };

    [FieldConstants.EQUIPMENT]?: {
        [FieldConstants.ID]?: string;
        [FieldConstants.NAME]?: string | null;
        [FieldConstants.TYPE]?: string;
    };
    [FieldConstants.FREQUENCY_REGULATION]?: boolean | null;
    [FieldConstants.DROOP]?: number | null;
    [FieldConstants.REACTIVE_LIMITS]: {
        [FieldConstants.MINIMUM_REACTIVE_POWER]?: number | null;
        [FieldConstants.MAXIMUM_REACTIVE_POWER]?: number | null;
        [FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE]: string | null;
        [FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE]?: ReactiveCapabilityCurvePoints[];
    };
    // Properties
    [FieldConstants.ADDITIONAL_PROPERTIES]?: Property[];
};

export type GeneratorCreationDialogSchemaForm = {
    [FieldConstants.EQUIPMENT_ID]: string;
} & GeneratorDialogSchemaBaseForm;

export type GeneratorModificationDialogSchemaForm = Partial<GeneratorDialogSchemaBaseForm>;

export interface GeneratorFormInfos {
    id: string;
    name: string;
    energySource?: string;
    maxP: number;
    minP: number;
    ratedS: number;
    targetP: number;
    voltageRegulatorOn: boolean;
    targetV: number;
    targetQ: number;
    generatorStartup: GeneratorStartUpFormInfos;
    connectablePosition: ConnectablePositionFormInfos;
    activePowerControl: ActivePowerControlInfos;
    generatorShortCircuit: ShortCircuitInfos;
    regulatingTerminalId: string;
    regulatingTerminalVlId: string;
    regulatingTerminalConnectableId: string;
    regulatingTerminalConnectableType: string;
    coordinatedReactiveControl: CoordinatedReactiveControlInfos;
    minMaxReactiveLimits: MinMaxReactiveLimitsFormInfos;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[];
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: string | null;
    terminalConnected?: boolean | null;
    properties: Record<string, string> | undefined;
}

interface CoordinatedReactiveControlInfos {
    qPercent?: number | null;
}

interface GeneratorStartUpFormInfos {
    plannedActivePowerSetPoint: number | null;
    marginalCost?: number | null;
    plannedOutageRate?: number | null;
    forcedOutageRate?: number | null;
}
