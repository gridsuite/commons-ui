/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const NETWORK = 'network';

export enum Network {
    // Capacitor related
    CAPACITOR_NO_RECLOSING_DELAY = 'capacitorNoReclosingDelay',

    // Line related
    BOUNDARY_LINE_CURRENT_LIMIT_MAX_TIME_OPERATION = 'boundaryLineCurrentLimitMaxTimeOperation',
    LINE_CURRENT_LIMIT_MAX_TIME_OPERATION = 'lineCurrentLimitMaxTimeOperation',

    // Load related
    LOAD_TP = 'loadTp',
    LOAD_TQ = 'loadTq',
    LOAD_ALPHA = 'loadAlpha',
    LOAD_ALPHA_LONG = 'loadAlphaLong',
    LOAD_BETA = 'loadBeta',
    LOAD_BETA_LONG = 'loadBetaLong',
    LOAD_IS_CONTROLLABLE = 'loadIsControllable',
    LOAD_IS_RESTORATIVE = 'loadIsRestorative',
    LOAD_Z_PMAX = 'loadZPMax',
    LOAD_Z_QMAX = 'loadZQMax',

    // Reactance related
    REACTANCE_NO_RECLOSING_DELAY = 'reactanceNoReclosingDelay',

    // Transformer related
    TRANSFORMER_CURRENT_LIMIT_MAX_TIME_OPERATION = 'transformerCurrentLimitMaxTimeOperation',
    TRANSFORMER_T1_ST_HT = 'transformerT1StHT',
    TRANSFORMER_T1_ST_THT = 'transformerT1StTHT',
    TRANSFORMER_T_NEXT_HT = 'transformerTNextHT',
    TRANSFORMER_T_NEXT_THT = 'transformerTNextTHT',
    TRANSFORMER_TO_LV = 'transformerTolV',
}
