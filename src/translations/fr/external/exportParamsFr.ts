import { defineMessages } from '../../utils';

/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const exportParamsFr = defineMessages({
    'iidm.export.cgmes.base-name': { defaultMessage: 'Nom des fichiers' },
    'iidm.export.cgmes.base-name.desc': { defaultMessage: "Nom des fichiers d'export" },
    'iidm.export.cgmes.cim-version': { defaultMessage: 'Version CIM' },
    'iidm.export.cgmes.cim-version.desc': { defaultMessage: 'Version du CIM à exporter' },
    'iidm.export.cgmes.cim-version.14': { defaultMessage: '14' },
    'iidm.export.cgmes.cim-version.16': { defaultMessage: '16' },
    'iidm.export.cgmes.cim-version.100': { defaultMessage: '100' },
    'iidm.export.cgmes.export-boundary-power-flows': { defaultMessage: 'Exporter les flux des terminaux frontières' },
    'iidm.export.cgmes.export-boundary-power-flows.desc': {
        defaultMessage: 'Exporter les flux des terminaux frontières dans le fichier SV',
    },
    'iidm.export.cgmes.export-power-flows-for-switches': { defaultMessage: 'Exporter les flux au niveau des OCs' },
    'iidm.export.cgmes.export-power-flows-for-switches.desc': {
        defaultMessage: 'Exporter les flux au niveau des organes de coupures dans le fichier SV',
    },
    'iidm.export.cgmes.naming-strategy': {
        defaultMessage: 'Type de conversion utilisé pour créer les identifiants CGMES',
    },
    'iidm.export.cgmes.naming-strategy.desc': {
        defaultMessage: 'Type de conversion utilisé pour créer les identifiants CGMES',
    },
    'iidm.export.cgmes.naming-strategy.identity': { defaultMessage: 'identity' },
    'iidm.export.cgmes.naming-strategy.cgmes': { defaultMessage: 'cgmes' },
    'iidm.export.cgmes.naming-strategy.cgmes-fix-all-invalid-ids': { defaultMessage: 'cgmes-fix-all-invalid-ids' },
    'iidm.export.cgmes.profiles': { defaultMessage: 'Profils' },
    'iidm.export.cgmes.profiles.desc': { defaultMessage: 'Profils à exporter' },
    'iidm.export.cgmes.profiles.EQ': { defaultMessage: 'EQ' },
    'iidm.export.cgmes.profiles.TP': { defaultMessage: 'TP' },
    'iidm.export.cgmes.profiles.SSH': { defaultMessage: 'SSH' },
    'iidm.export.cgmes.profiles.SV': { defaultMessage: 'SV' },
    'iidm.export.cgmes.boundary-EQ-identifier': { defaultMessage: 'Identifiant du fichier de boundary EQ' },
    'iidm.export.cgmes.boundary-EQ-identifier.desc': {
        defaultMessage: 'Identifiant du fichier EQ décrivant les terminaux frontières',
    },
    'iidm.export.cgmes.boundary-TP-identifier': { defaultMessage: 'Identifiant du fichier de boundary TP' },
    'iidm.export.cgmes.boundary-TP-identifier.desc': {
        defaultMessage: 'Identifiant du fichier TP décrivant la topologie des terminaux frontières',
    },
    'iidm.export.cgmes.modeling-authority-set': { defaultMessage: 'Définition du ModelingAuthority' },
    'iidm.export.cgmes.modeling-authority-set.desc': { defaultMessage: 'Définition du ModelingAuthority' },
    'ucte.export.naming-strategy': { defaultMessage: 'Type de conversion utilisé pour créer les identifiants UCTE' },
    'ucte.export.naming-strategy.desc': {
        defaultMessage: 'Type de conversion utilisé pour créer les identifiants UCTE',
    },
    'ucte.export.combine-phase-angle-regulation': { defaultMessage: 'Combiner les lois de réglage et de déphasage' },
    'ucte.export.combine-phase-angle-regulation.desc': {
        defaultMessage: 'Combiner les lois de réglage et de déphasage',
    },
    'iidm.export.xml.indent': { defaultMessage: 'Indentation du fichier exporté' },
    'iidm.export.xml.indent.desc': { defaultMessage: 'Indentation du fichier exporté' },
    'iidm.export.xml.with-branch-state-variables': { defaultMessage: 'Exporter les flux au niveau des quadripôles' },
    'iidm.export.xml.with-branch-state-variables.desc': {
        defaultMessage: 'Exporter les flux au niveau des quadripôles',
    },
    'iidm.export.xml.only-main-cc': { defaultMessage: 'Exporter seulement la CC principale' },
    'iidm.export.xml.only-main-cc.desc': { defaultMessage: 'Exporter seulement la composante connexe principale' },
    'iidm.export.xml.anonymised': { defaultMessage: 'Anonymisation du réseau exporté' },
    'iidm.export.xml.anonymised.desc': { defaultMessage: 'Anonymisation du réseau exporté' },
    'iidm.export.xml.iidm-version-incompatibility-behavior': {
        defaultMessage: "Comportement en cas d'incompatibilité de version IIDM",
    },
    'iidm.export.xml.iidm-version-incompatibility-behavior.desc': {
        defaultMessage: "Comportement en cas d'incompatibilité de version IIDM",
    },
    'iidm.export.xml.iidm-version-incompatibility-behavior.THROW_EXCEPTION': { defaultMessage: 'Exception' },
    'iidm.export.xml.iidm-version-incompatibility-behavior.LOG_ERROR': { defaultMessage: 'Logs' },
    'iidm.export.xml.topology-level': { defaultMessage: 'Niveau de détail de la topologie' },
    'iidm.export.xml.topology-level.desc': { defaultMessage: 'Niveau de détail de la topologie' },
    'iidm.export.xml.topology-level.BUS_BRANCH': { defaultMessage: 'BUS_BRANCH' },
    'iidm.export.xml.topology-level.BUS_BREAKER': { defaultMessage: 'BUS_BREAKER' },
    'iidm.export.xml.topology-level.NODE_BREAKER': { defaultMessage: 'NODE_BREAKER' },
    'iidm.export.xml.throw-exception-if-extension-not-found': {
        defaultMessage: "Exception si une extension n'est pas connue",
    },
    'iidm.export.xml.throw-exception-if-extension-not-found.desc': {
        defaultMessage: "Lever une exception si on essaie d'exporter une extension inconnue",
    },
    'iidm.export.xml.extensions': { defaultMessage: 'Extensions' },
    'iidm.export.xml.extensions.selectionDialog.name': { defaultMessage: 'Sélection des extensions' },
    'iidm.export.xml.extensions.desc': { defaultMessage: 'Exporter avec ces extensions' },
    'iidm.export.xml.extensions.activePowerControl': { defaultMessage: 'Compensation' },
    'iidm.export.xml.extensions.baseVoltageMapping': { defaultMessage: 'Tension nominale' },
    'iidm.export.xml.extensions.branchObservability': { defaultMessage: 'Observabilité des quadripôles' },
    'iidm.export.xml.extensions.busbarSectionPosition': { defaultMessage: 'Position des SJBs' },
    'iidm.export.xml.extensions.branchStatus': {
        defaultMessage: 'Statut de consignation et de déclenchement (Version IIDM < 1.12)',
    },
    'iidm.export.xml.extensions.cgmesControlAreas': { defaultMessage: 'Cgmes - zone géographique' },
    'iidm.export.xml.extensions.cgmesDanglingLineBoundaryNode': {
        defaultMessage: 'Code EIC des lignes frontières (ligne non mergée)',
    },
    'iidm.export.xml.extensions.cgmesLineBoundaryNode': {
        defaultMessage: 'Code EIC des lignes frontières (ligne complète)',
    },
    'iidm.export.xml.extensions.cgmesMetadataModels': { defaultMessage: 'Cgmes - Métadonnées des modèles' },
    'iidm.export.xml.extensions.cgmesSshMetadata': { defaultMessage: 'Cgmes - ssh métadonnées' },
    'iidm.export.xml.extensions.cgmesSvMetadata': { defaultMessage: 'Cgmes - sv métadonnées' },
    'iidm.export.xml.extensions.cgmesTapChangers': { defaultMessage: 'Cgmes - lois de réglage et déphasage' },
    'iidm.export.xml.extensions.cimCharacteristics': { defaultMessage: 'Cgmes - caractéristiques' },
    'iidm.export.xml.extensions.coordinatedReactiveControl': { defaultMessage: 'Contrôle coordonné du réactif' },
    'iidm.export.xml.extensions.detail': { defaultMessage: 'Données détaillées des consommations (fixe | affine)' },
    'iidm.export.xml.extensions.discreteMeasurements': { defaultMessage: 'Télémesures (Régleurs et Déphaseurs)' },
    'iidm.export.xml.extensions.entsoeArea': { defaultMessage: 'Zone Entsoe' },
    'iidm.export.xml.extensions.entsoeCategory': { defaultMessage: 'Catégorie Entsoe des groupes' },
    'iidm.export.xml.extensions.generatorActivePowerControl': { defaultMessage: 'Compensation (Groupes)' },
    'iidm.export.xml.extensions.generatorFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des groupes',
    },
    'iidm.export.xml.extensions.generatorAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des groupes',
    },
    'iidm.export.xml.extensions.generatorRemoteReactivePowerControl': {
        defaultMessage: 'Régulation à distance de la puissance réactive des groupes',
    },
    'iidm.export.xml.extensions.generatorShortCircuit': { defaultMessage: 'Données de court-circuit des groupes' },
    'iidm.export.xml.extensions.generatorShortCircuits': {
        defaultMessage: 'Données de court-circuit des groupes (Version IIDM 1.0)',
    },
    'iidm.export.xml.extensions.hvdcAngleDroopActivePowerControl': { defaultMessage: 'Emulation AC pour les HVDCs' },
    'iidm.export.xml.extensions.hvdcOperatorActivePowerRange': { defaultMessage: 'Limites de transits des HVDCs' },
    'iidm.export.xml.extensions.identifiableShortCircuit': { defaultMessage: 'Données de court-circuit des postes' },
    'iidm.export.xml.extensions.injectionObservability': { defaultMessage: 'Observabilité des injections' },
    'iidm.export.xml.extensions.lineFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des lignes',
    },
    'iidm.export.xml.extensions.lineAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des lignes',
    },
    'iidm.export.xml.extensions.linePosition': { defaultMessage: 'Coordonnées géographiques de lignes' },
    'iidm.export.xml.extensions.loadFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des consommations',
    },
    'iidm.export.xml.extensions.loadAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des consommations',
    },
    'iidm.export.xml.extensions.measurements': { defaultMessage: 'Télémesures' },
    'iidm.export.xml.extensions.mergedXnode': { defaultMessage: 'Xnode mergé' },
    'iidm.export.xml.extensions.operatingStatus': { defaultMessage: 'Statut de consignation et de déclenchement' },
    'iidm.export.xml.extensions.position': { defaultMessage: 'Position des départs' },
    'iidm.export.xml.extensions.referencePriorities': {
        defaultMessage: 'Indice de priorité des noeuds de référence (Calcul de répartition)',
    },
    'iidm.export.xml.extensions.referenceTerminals': {
        defaultMessage: 'Terminaux référence de phase (Calcul de répartition)',
    },
    'iidm.export.xml.extensions.secondaryVoltageControl': { defaultMessage: 'Réglage secondaire de tension' },
    'iidm.export.xml.extensions.slackTerminal': { defaultMessage: 'Nœud bilan' },
    'iidm.export.xml.extensions.standbyAutomaton': { defaultMessage: 'Automate des CSPRs' },
    'iidm.export.xml.extensions.startup': { defaultMessage: 'Coût de démarrage des groupes' },
    'iidm.export.xml.extensions.substationPosition': { defaultMessage: 'Coordonnées géographiques des sites' },
    'iidm.export.xml.extensions.threeWindingsTransformerFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    },
    'iidm.export.xml.extensions.threeWindingsTransformerAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    },
    'iidm.export.xml.extensions.threeWindingsTransformerPhaseAngleClock': {
        defaultMessage:
            "Angles de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à trois enroulements",
    },
    'iidm.export.xml.extensions.threeWindingsTransformerToBeEstimated': {
        defaultMessage: 'Estimation des prises des régleurs et des déphaseurs des transformateurs à trois enroulements',
    },
    'iidm.export.xml.extensions.twoWindingsTransformerFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    },
    'iidm.export.xml.extensions.twoWindingsTransformerAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    },
    'iidm.export.xml.extensions.twoWindingsTransformerPhaseAngleClock': {
        defaultMessage:
            "Angle de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à deux enroulements",
    },
    'iidm.export.xml.extensions.twoWindingsTransformerToBeEstimated': {
        defaultMessage: 'Estimation des prises des régleurs et des déphaseurs des transformateurs à deux enroulements',
    },
    'iidm.export.xml.extensions.voltageLevelShortCircuits': {
        defaultMessage: 'Données de court-circuit des postes (Version IIDM 1.0)',
    },
    'iidm.export.xml.extensions.voltagePerReactivePowerControl': {
        defaultMessage: 'Lien entre la tension de consigne et la puissance réactive en mode réglage de tension (CSPRs)',
    },
    'iidm.export.xml.extensions.voltageRegulation': { defaultMessage: 'Réglage de tension' },
    'iidm.export.xml.sorted': { defaultMessage: 'Trier les ouvrages dans le fichier' },
    'iidm.export.xml.sorted.desc': { defaultMessage: 'Trier les ouvrages dans le fichier' },
    'iidm.export.xml.version': { defaultMessage: 'Version IIDM' },
    'iidm.export.xml.version.desc': { defaultMessage: 'Version IIDM utilisée pour générer le fichier' },
    'iidm.export.xml.version.1.0': { defaultMessage: '1.0' },
    'iidm.export.xml.version.1.1': { defaultMessage: '1.1' },
    'iidm.export.xml.version.1.2': { defaultMessage: '1.2' },
    'iidm.export.xml.version.1.3': { defaultMessage: '1.3' },
    'iidm.export.xml.version.1.4': { defaultMessage: '1.4' },
    'iidm.export.xml.version.1.5': { defaultMessage: '1.5' },
    'iidm.export.xml.version.1.6': { defaultMessage: '1.6' },
    'iidm.export.xml.version.1.7': { defaultMessage: '1.7' },
    'iidm.export.xml.version.1.8': { defaultMessage: '1.8' },
    'iidm.export.xml.version.1.9': { defaultMessage: '1.9' },
    'iidm.export.xml.version.1.10': { defaultMessage: '1.10' },
});
