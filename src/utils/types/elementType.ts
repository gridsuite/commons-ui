/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * All the elements we can find in the GridSuite storage system.
 */
export enum ElementType {
    DIRECTORY = 'DIRECTORY',
    STUDY = 'STUDY',
    CASE = 'CASE',
    FILTER = 'FILTER',
    MODIFICATION = 'MODIFICATION',
    CONTINGENCY_LIST = 'CONTINGENCY_LIST',
    VOLTAGE_INIT_PARAMETERS = 'VOLTAGE_INIT_PARAMETERS',
    SECURITY_ANALYSIS_PARAMETERS = 'SECURITY_ANALYSIS_PARAMETERS',
    LOADFLOW_PARAMETERS = 'LOADFLOW_PARAMETERS',
    SENSITIVITY_PARAMETERS = 'SENSITIVITY_PARAMETERS',
    SHORT_CIRCUIT_PARAMETERS = 'SHORT_CIRCUIT_PARAMETERS',
    NETWORK_VISUALIZATIONS_PARAMETERS = 'NETWORK_VISUALIZATIONS_PARAMETERS',
    SPREADSHEET_CONFIG = 'SPREADSHEET_CONFIG',
    SPREADSHEET_CONFIG_COLLECTION = 'SPREADSHEET_CONFIG_COLLECTION',
    DIAGRAM_CONFIG = 'DIAGRAM_CONFIG',
}
