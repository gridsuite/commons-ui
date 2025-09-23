/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';

export const MAP_BASEMAP_MAPBOX = 'mapbox';
export const MAP_BASEMAP_CARTO = 'carto';
export const MAP_BASEMAP_CARTO_NOLABEL = 'cartonolabel';
export const MAP_BASEMAP_ETALAB = 'etalab';

export enum SubstationLayout {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
    SMART = 'smart',
    SMARTHORIZONTALCOMPACTION = 'smartHorizontalCompaction',
    SMARTVERTICALCOMPACTION = 'smartVerticalCompaction',
}

export enum NadPositionsGenerationMode {
    GEOGRAPHICAL_COORDINATES = 'GEOGRAPHICAL_COORDINATES',
    AUTOMATIC = 'AUTOMATIC',
    CONFIGURED = 'CONFIGURED',
}

type MapParameters = {
    lineFullPath: boolean;
    lineParallelPath: boolean;
    lineFlowMode: string;
    mapManualRefresh: boolean;
    mapBaseMap:
        | typeof MAP_BASEMAP_MAPBOX
        | typeof MAP_BASEMAP_CARTO
        | typeof MAP_BASEMAP_CARTO_NOLABEL
        | typeof MAP_BASEMAP_ETALAB;
};

type SingleLineDiagramParameters = {
    diagonalLabel: boolean;
    centerLabel: boolean;
    substationLayout: string;
    componentLibrary: string;
};

type NetworkAreaDiagramParameters = {
    nadPositionsGenerationMode: string;
};

export type NetworkVisualizationParameters = {
    id: UUID;
    mapParameters: MapParameters;
    singleLineDiagramParameters: SingleLineDiagramParameters;
    networkAreaDiagramParameters: NetworkAreaDiagramParameters;
};
