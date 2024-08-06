/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const filterExpertFr = {
    id: 'ID',
    name: 'Nom',
    energySource: "Source d'énergie",
    country: 'Pays',
    voltageRegulatorOn: 'Réglage de tension',
    PlannedActivePowerSetPoint: 'Puissance imposée (MW)',
    minP: 'Puissance active min (MW)',
    maxP: 'Puissance active max (MW)',
    targetP: 'Consigne puissance active (MW)',
    targetV: 'Consigne tension (kV)',
    targetQ: 'Consigne puissance réactive (MVar)',
    connected: 'Connecté',
    maximumSectionCount: 'Nombre de gradins',
    sectionCount: 'Gradin courant',
    shuntCompensatorType: 'Type',
    Capacitor: 'Condensateur',
    Reactor: 'Réactance',
    maxQAtNominalV: 'Q installée à tension nominale (MVar)',
    SwitchedOnMaxQAtNominalV: 'Q enclenchée à tension nominale (MVar)',
    maxSusceptance: 'Susceptance installée (S)',
    SwitchedOnMaxSusceptance: 'Susceptance enclenchée (S)',
    ratedS: 'Puissance nominale (MVA)',
    ratedS1: 'Puissance nominale côté 1 (MVA)',
    ratedS2: 'Puissance nominale côté 2 (MVA)',
    ratedS3: 'Puissance nominale côté 3 (MVA)',
    marginalCost: 'Coût',
    plannedOutageRate: 'Indisponibilité programmée',
    forcedOutageRate: 'Indisponibilité fortuite',
    vlId: 'ID de poste',
    p0: 'P constant (MW)',
    q0: 'Q constant (MVar)',
    loadTapChangingCapabilities: 'Régleur en charge',
    loadTapChangingCapabilities1: 'Régleur 1 en charge',
    loadTapChangingCapabilities2: 'Régleur 2 en charge',
    loadTapChangingCapabilities3: 'Régleur 3 en charge',
    ratioTargetV: 'Tension de consigne du régleur (kV)',
    ratioTargetV1: 'Tension de consigne du régleur 1 (kV)',
    ratioTargetV2: 'Tension de consigne du régleur 2 (kV)',
    ratioTargetV3: 'Tension de consigne du régleur 3 (kV)',
    magnetizingConductance: 'Conductance magnétisante (μS)',
    magnetizingConductance1: 'Conductance magnétisante côté 1 (μS)',
    magnetizingConductance2: 'Conductance magnétisante côté 2 (μS)',
    magnetizingConductance3: 'Conductance magnétisante côté 3 (μS)',
    magnetizingSusceptance: 'Susceptance magnétisante (μS)',
    magnetizingSusceptance1: 'Susceptance magnétisante côté 1 (μS)',
    magnetizingSusceptance2: 'Susceptance magnétisante côté 2 (μS)',
    magnetizingSusceptance3: 'Susceptance magnétisante côté 3 (μS)',
    vlNominalVoltage: 'Tension nominale poste (kV)',
    lowVoltageLimit: 'Limite tension basse (kV)',
    highVoltageLimit: 'Limite tension haute (kV)',
    selectFilterDialogTitle: 'Choisir un filtre',
    filter: 'Filtre',
    loadType: 'Type',
    Undefined: 'Non défini',
    Auxiliary: 'Auxiliaire',
    Fictitious: 'Fictif',
    hasRatioTapChanger: 'Régleur existe',
    hasRatioTapChanger1: 'Régleur 1 existe',
    hasRatioTapChanger2: 'Régleur 2 existe',
    hasRatioTapChanger3: 'Régleur 3 existe',
    hasPhaseTapChanger: 'Déphaseur existe',
    hasPhaseTapChanger1: 'Déphaseur 1 existe',
    hasPhaseTapChanger2: 'Déphaseur 2 existe',
    hasPhaseTapChanger3: 'Déphaseur 3 existe',
    Voltage: 'Tension',
    ReactivePower: 'Puissance réactive',
    VoltageRegulation: 'Réglage tension',
    FixedRatio: 'Rapport fixe',
    CurrentLimiter: 'Limitation de courant',
    ActivePowerControl: 'Suivi de transit',
    FixedTap: 'Déphasage constant',
    ratioRegulationMode: 'Mode de réglage du régleur',
    ratioRegulationMode1: 'Mode de réglage du régleur 1',
    ratioRegulationMode2: 'Mode de réglage du régleur 2',
    ratioRegulationMode3: 'Mode de réglage du régleur 3',
    phaseRegulationMode: 'Mode de réglage du déphaseur',
    phaseRegulationMode1: 'Mode de réglage du déphaseur 1',
    phaseRegulationMode2: 'Mode de réglage du déphaseur 2',
    phaseRegulationMode3: 'Mode de réglage du déphaseur 3',
    phaseRegulationValue: 'Consigne de transit ou du courant du déphaseur',
    phaseRegulationValue1: 'Consigne de transit ou du courant du déphaseur 1',
    phaseRegulationValue2: 'Consigne de transit ou du courant du déphaseur 2',
    phaseRegulationValue3: 'Consigne de transit ou du courant du déphaseur 3',
    property: 'Propriété',
    substationProperty: 'Propriété site',
    substationProperty1: 'Propriété site 1',
    substationProperty2: 'Propriété site 2',
    substationProperty1Twt: 'Propriété site 1',
    substationProperty2Twt: 'Propriété site 2',
    substationProperty3Twt: 'Propriété site 3',
    ratedVoltage1KV: "Tension d'enroulement 1 (kV)",
    ratedVoltage2KV: "Tension d'enroulement 2 (kV)",
    ratedVoltage0KVTwt: "Tension d'enroulement 0 (kV)",
    ratedVoltage1KVTwt: "Tension d'enroulement 1 (kV)",
    ratedVoltage2KVTwt: "Tension d'enroulement 2 (kV)",
    ratedVoltage3KVTwt: "Tension d'enroulement 3 (kV)",
    nominalVoltage1: 'Tension nominale 1',
    nominalVoltage2: 'Tension nominale 2',
    nominalVoltage3: 'Tension nominale 3',
    voltageLevelId1: 'ID Poste 1',
    voltageLevelId2: 'ID Poste 2',
    voltageLevelId1Twt: 'ID Poste 1',
    voltageLevelId2Twt: 'ID Poste 2',
    voltageLevelId3Twt: 'ID Poste 3',
    terminal1Connected: 'Connecté 1',
    terminal2Connected: 'Connecté 2',
    terminal1ConnectedTwt: 'Connecté 1',
    terminal2ConnectedTwt: 'Connecté 2',
    terminal3ConnectedTwt: 'Connecté 3',
    nominalVoltage1KV: 'Tension nominale 1 (kV)',
    nominalVoltage2KV: 'Tension nominale 2 (kV)',
    nominalVoltage1KVTwt: 'Tension nominale 1 (kV)',
    nominalVoltage2KVTwt: 'Tension nominale 2 (kV)',
    nominalVoltage3KVTwt: 'Tension nominale 3 (kV)',
    voltageLevelProperty: 'Propriété poste',
    voltageLevelProperty1: 'Propriété poste 1',
    voltageLevelProperty2: 'Propriété poste 2',
    voltageLevelProperty1Twt: 'Propriété poste 1',
    voltageLevelProperty2Twt: 'Propriété poste 2',
    voltageLevelProperty3Twt: 'Propriété poste 3',
    'maxQAtNominalV.svar': 'Q max à tension nominale (MVar)',
    'minQAtNominalV.svar': 'Q min à tension nominale (MVar)',
    'fixQAtNominalV.svar': 'Q fixe à tension nominale (MVar)',
    'maxSusceptance.svar': 'Susceptance max (S)',
    'minSusceptance.svar': 'Susceptance min (S)',
    regulationMode: 'Mode de réglage',
    'regulationMode.off': 'Arrêt',
    'regulationMode.voltage': 'Réglage de tension',
    'regulationMode.reactivePower': 'Réglage du réactif',
    voltageSetPoint: 'Tension',
    activePowerSetPoint: 'Consigne de puissance active (MW)',
    reactivePowerSetPoint: 'Consigne de puissance réactive (MVar)',
    remoteRegulatedTerminal: 'Terminal distant réglé',
    regulatingTerminalVLId: 'ID de poste',
    regulatingTerminalConnectableId: "ID d'ouvrage",
    regulationType: 'Type de réglage',
    'regulationType.distant': 'Réglage distant',
    'regulationType.local': 'Réglage local',
    automate: 'Automate',
    lowVoltageSetPoint: 'U consigne bas',
    highVoltageSetPoint: 'U consigne haut',
    lowVoltageThreshold: 'U activation bas',
    highVoltageThreshold: 'U activation haut',
    susceptanceFix: 'Susceptance fixe',
    paired: 'Appareillé',
    converterStationId1: 'ID de la station de conversion 1',
    converterStationId2: 'ID de la station de conversion 2',
    convertersMode: 'Mode de conversion',
    side1RectifierSide2Inverter: 'Coté 1 redresseur côté 2 onduleur',
    side1InverterSide2Rectifier: 'Côté 1 onduleur côté 2 redresseur',
    dcNominalVoltage: 'Tension nominale DC (kV)',
    converterStationNominalVoltage1:
        'Tension nominale de la station de conversion 1 (kV)',
    converterStationNominalVoltage2:
        'Tension nominale de la station de conversion 2 (kV)',
    country1: 'Pays 1',
    country2: 'Pays 2',
    seriesResistance: 'Résistance série (Ω)',
    seriesResistance1: 'Résistance série 1 (Ω)',
    seriesResistance2: 'Résistance série 2 (Ω)',
    seriesResistance3: 'Résistance série 3 (Ω)',
    seriesReactance: 'Réactance série (Ω)',
    seriesReactance1: 'Réactance série 1 (Ω)',
    seriesReactance2: 'Réactance série 2 (Ω)',
    seriesReactance3: 'Réactance série 3 (Ω)',
    shuntConductance: 'Conductance parallèle (μS)',
    shuntSusceptance: 'Susceptance parallèle (μS)',
    shuntConductance1: 'Conductance parallèle 1 (μS)',
    shuntSusceptance1: 'Susceptance parallèle 1 (μS)',
    shuntConductance2: 'Conductance parallèle 2 (μS)',
    shuntSusceptance2: 'Susceptance parallèle 2 (μS)',
    pairingKey: "Xnode",
    tieLineId: "ID de l'interconnexion",
};

export default filterExpertFr;
