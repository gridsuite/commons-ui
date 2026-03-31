/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Identifiable } from '../../../../utils';

export interface ConnectablePositionFormInfos {
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
}

export interface ConnectablePositionInfos {
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
}

export interface Connectivity {
    voltageLevel: { id?: string };
    busOrBusbarSection: { id?: string };
    connectionDirection?: string;
    connectionName?: string;
    connectionPosition?: number;
    terminalConnected?: boolean;
}

type PositionDiagramPaneType = React.ComponentType<{
    open: boolean;
    onClose: () => void;
    voltageLevelId: string;
}>;

interface NewVoltageLevelOption extends Identifiable {
    exist: false;
    busbarCount: number;
    sectionCount: number;
    switchKinds: string[];
}

interface ExistingVoltageLevelOption extends Identifiable {
    exist?: true;
}

export type VoltageLevelOption = NewVoltageLevelOption | ExistingVoltageLevelOption;

export interface ConnectivityNetworkProps {
    voltageLevelOptions: VoltageLevelOption[];
    PositionDiagramPane?: PositionDiagramPaneType;
    fetchBusesOrBusbarSections: (voltageLevelId: string) => Promise<Identifiable[]>;
}
