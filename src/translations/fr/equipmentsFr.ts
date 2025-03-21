/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const equipmentsFr = defineMessages({
    Substations: { defaultMessage: 'Sites' },
    VoltageLevels: { defaultMessage: 'Postes' },
    Lines: { defaultMessage: 'Lignes' },
    TwoWindingsTransformers: { defaultMessage: 'Transfos à 2 enroulements' },
    ThreeWindingsTransformers: { defaultMessage: 'Transfos à 3 enroulements' },
    Generators: { defaultMessage: 'Groupes' },
    Loads: { defaultMessage: 'Consommations' },
    Batteries: { defaultMessage: 'Batteries' },
    ShuntCompensators: { defaultMessage: 'Moyens de compensation' },
    Hydro: { defaultMessage: 'Hydraulique' },
    Nuclear: { defaultMessage: 'Nucléaire' },
    Wind: { defaultMessage: 'Éolien' },
    Thermal: { defaultMessage: 'Thermique' },
    Solar: { defaultMessage: 'Solaire' },
    Other: { defaultMessage: 'Autre' },
    LccConverterStations: { defaultMessage: 'Stations de conversion LCC' },
    VscConverterStations: { defaultMessage: 'Stations de conversion VSC' },
    StaticVarCompensators: { defaultMessage: 'CSPR' },
});
