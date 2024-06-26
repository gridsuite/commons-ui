/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const filter_expert_fr = {
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
    marginalCost: 'Coût',
    plannedOutageRate: 'Indisponibilité programmée',
    forcedOutageRate: 'Indisponibilité fortuite',
    vlId: 'ID de poste',
    p0: 'P constant (MW)',
    q0: 'Q constant (MVar)',
    loadTapChangingCapabilities: 'Régleur en charge',
    ratioTargetV: 'Tension de consigne du régleur (kV)',
    magnetizingConductance: 'Conductance magnétisante (μS)',
    magnetizingSusceptance: 'Susceptance magnétisante (μS)',
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
    hasPhaseTapChanger: 'Déphaseur existe',
    Voltage: 'Tension',
    ReactivePower: 'Puissance réactive',
    VoltageRegulation: 'Réglage tension',
    FixedRatio: 'Rapport fixe',
    CurrentLimiter: 'Limitation de courant',
    ActivePowerControl: 'Suivi de transit',
    FixedTap: 'Déphasage constant',
    ratioRegulationMode: 'Mode de réglage régleur',
    phaseRegulationMode: 'Mode de réglage déphaseur',
    phaseRegulationValue: 'Consigne de transit ou du courant du déphaseur',
    property: 'Propriété',
    substationProperty: 'Propriété site',
    substationProperty1: 'Propriété site 1',
    substationProperty2: 'Propriété site 2',
    ratedVoltage1KV: "Tension d'enroulement 1 (kV)",
    ratedVoltage2KV: "Tension d'enroulement 2 (kV)",
    nominalVoltage1KV: 'Tension nominale 1 (kV)',
    nominalVoltage2KV: 'Tension nominale 2 (kV)',
    voltageLevelProperty: 'Propriété poste',
    voltageLevelProperty1: 'Propriété poste 1',
    voltageLevelProperty2: 'Propriété poste 2',
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
    reactivePowerSetPoint: 'Puissance réactive',
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
};

export default filter_expert_fr;
