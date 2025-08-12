/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    MAP_BASEMAP_CARTO,
    MAP_BASEMAP_CARTO_NOLABEL,
    MAP_BASEMAP_ETALAB,
    MAP_BASEMAP_MAPBOX,
    NadPositionsGenerationMode,
    SubstationLayout,
} from './network-visualizations.types';

// Defined in powsybl/network-viewer, duplicated here
export enum LineFlowMode {
    STATIC_ARROWS = 'staticArrows',
    ANIMATED_ARROWS = 'animatedArrows',
    FEEDERS = 'feeders',
}

export const PARAM_LINE_FULL_PATH = 'lineFullPath';
export const PARAM_LINE_PARALLEL_PATH = 'lineParallelPath';
export const PARAM_LINE_FLOW_MODE = 'lineFlowMode';
export const PARAM_MAP_MANUAL_REFRESH = 'mapManualRefresh';
export const PARAM_MAP_BASEMAP = 'mapBaseMap';
export const PARAM_CENTER_LABEL = 'centerLabel';
export const PARAM_COMPONENT_LIBRARY = 'componentLibrary';
export const PARAM_DIAGONAL_LABEL = 'diagonalLabel';
export const PARAM_SUBSTATION_LAYOUT = 'substationLayout';
export const PARAM_NAD_POSITIONS_GENERATION_MODE = 'nadPositionsGenerationMode';

export enum NetworkVisualizationTabValues {
    MAP = 'mapParameters',
    SINGLE_LINE_DIAGRAM = 'singleLineDiagramParameters',
    NETWORK_AREA_DIAGRAM = 'networkAreaDiagramParameters',
}
export const MAP_MANUAL_REFRESH = 'MapManualRefresh';
export const LINE_FLOW_MODE = 'LineFlowMode';
export const MAP_BASE_MAP = 'MapBaseMap';

export const DIAGONAL_LABEL = 'diagonalLabel';
export const CENTER_LABEL = 'centerLabel';
export const SUBSTATION_LAYOUT = 'SubstationLayout';
export const COMPONENT_LIBRARY = 'ComponentLibrary';
export const NAD_POSITIONS_GENERATION_MODE_LABEL = 'nadPositionsGenerationModeLabel';

export const INTL_LINE_FLOW_MODE_OPTIONS = [
    {
        id: LineFlowMode.STATIC_ARROWS,
        label: 'StaticArrows',
    },
    {
        id: LineFlowMode.ANIMATED_ARROWS,
        label: 'AnimatedArrows',
    },
    {
        id: LineFlowMode.FEEDERS,
        label: 'Feeders',
    },
];

export const INTL_MAP_BASE_MAP_OPTIONS = [
    {
        id: MAP_BASEMAP_MAPBOX,
        label: 'Mapbox',
    },
    {
        id: MAP_BASEMAP_CARTO,
        label: 'Carto',
    },
    {
        id: MAP_BASEMAP_CARTO_NOLABEL,
        label: 'CartoNoLabel',
    },
    {
        id: MAP_BASEMAP_ETALAB,
        label: 'Etalab',
    },
];

export const INTL_SUBSTATION_LAYOUT_OPTIONS = [
    {
        id: SubstationLayout.HORIZONTAL,
        label: 'HorizontalSubstationLayout',
    },
    {
        id: SubstationLayout.VERTICAL,
        label: 'VerticalSubstationLayout',
    },
];

export const NAD_POSITIONS_GENERATION_MODE = [
    {
        id: NadPositionsGenerationMode.CONFIGURED,
        label: 'ConfiguredPositions',
    },
    {
        id: NadPositionsGenerationMode.GEOGRAPHICAL_COORDINATES,
        label: 'GeographicalCoordinates',
    },
    {
        id: NadPositionsGenerationMode.AUTOMATIC,
        label: 'Automatic',
    },
];
