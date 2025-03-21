/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineMessages } from '../../utils';

export const importParamsFr = defineMessages({
    'iidm.import.cgmes.allow-unsupported-tap-changers': {
        defaultMessage: "Autoriser n'importe quel type de régleur ou déphaseur",
    },
    'iidm.import.cgmes.allow-unsupported-tap-changers.desc': {
        defaultMessage: "Autoriser n'importe quel type de régleur ou déphaseur",
    },
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state': {
        defaultMessage: "Changement du signe des flux des MCS de l'état initial",
    },
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state.desc': {
        defaultMessage: "Changement du signe des flux des MCS de l'état initial",
    },
    'iidm.import.cgmes.convert-boundary': { defaultMessage: 'Importer les XNodes en tant que site/poste' },
    'iidm.import.cgmes.convert-boundary.desc': { defaultMessage: 'Importer les XNodes en tant que site/poste' },
    'iidm.import.cgmes.convert-sv-injections': { defaultMessage: 'Convertir les injections du fichier SV en conso' },
    'iidm.import.cgmes.convert-sv-injections.desc': {
        defaultMessage: 'Convertir les injections du fichier SV en conso',
    },
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node': {
        defaultMessage: 'Créer un SJB pour chaque noeud',
    },
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node.desc': {
        defaultMessage: 'Créer un SJB pour chaque noeud',
    },
    'iidm.import.cgmes.ensure-id-alias-unicity': { defaultMessage: "Assurer l'unicité des identifiants et des alias" },
    'iidm.import.cgmes.ensure-id-alias-unicity.desc': {
        defaultMessage: "Assurer l'unicité des identifiants et des alias",
    },
    'iidm.import.cgmes.naming-strategy': {
        defaultMessage: 'Type de nommage utilisé par le fichier de mapping des identifiants',
    },
    'iidm.import.cgmes.naming-strategy.desc': {
        defaultMessage: 'Type de nommage utilisé par le fichier de mapping des identifiants',
    },
    'iidm.import.cgmes.naming-strategy.identity': { defaultMessage: 'identity' },
    'iidm.import.cgmes.naming-strategy.cgmes': { defaultMessage: 'cgmes' },
    'iidm.import.cgmes.naming-strategy.cgmes-fix-all-invalid-id': { defaultMessage: 'cgmes-fix-all-invalid-id' },
    'iidm.import.cgmes.import-control-areas': { defaultMessage: 'Importer les zones géographiques' },
    'iidm.import.cgmes.import-control-areas.desc': {
        defaultMessage: 'Importer les zones géographiques (Control areas)',
    },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions': {
        defaultMessage:
            'Profil utilisé pour initialiser les valeurs des sections enclenchés des MCS et les prises courantes des régleurs et déphaseurs',
    },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.desc': {
        defaultMessage:
            'Profil utilisé pour initialiser les valeurs des sections enclenchés des MCS et les prises courantes des régleurs et déphaseurs',
    },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SV': { defaultMessage: 'SV' },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SSH': { defaultMessage: 'SSH' },
    'iidm.import.cgmes.source-for-iidm-id': {
        defaultMessage: 'Identifiants CGMES utilisés pour créer les identifiants IIDM',
    },
    'iidm.import.cgmes.source-for-iidm-id.desc': {
        defaultMessage: 'Identifiants CGMES utilisés pour créer les identifiants IIDM',
    },
    'iidm.import.cgmes.source-for-iidm-id.mRID': { defaultMessage: 'mrID' },
    'iidm.import.cgmes.source-for-iidm-id.rdfID': { defaultMessage: 'rdfID' },
    'iidm.import.cgmes.store-cgmes-model-as-network-extension': {
        defaultMessage: "Stocker le CGMES initial en tant qu'extension",
    },
    'iidm.import.cgmes.store-cgmes-model-as-network-extension.desc': {
        defaultMessage: "Stocker le CGMES initial en tant qu'extension",
    },
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension': {
        defaultMessage: "Stocker le mapping des terminaux CGMES en IIDM en tant qu'extension",
    },
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension.desc': {
        defaultMessage: "Stocker le mapping des terminaux CGMES en IIDM en tant qu'extension",
    },
    'iidm.import.cgmes.create-active-power-control-extension': {
        defaultMessage: 'Créer une extension pour la compensation',
    },
    'iidm.import.cgmes.create-active-power-control-extension.desc': {
        defaultMessage: 'Créer une extension pour la compensation',
    },
    'iidm.import.cgmes.decode-escaped-identifiers': {
        defaultMessage: 'Décoder les caractères spéciaux échappés dans les identifiants',
    },
    'iidm.import.cgmes.decode-escaped-identifiers.desc': {
        defaultMessage: 'Décoder les caractères spéciaux échappés dans les identifiants',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode': {
        defaultMessage: 'Créer des interrupteurs fictifs pour les terminaux déconnectés',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.desc': {
        defaultMessage:
            'Définir dans quel cas des interrupteurs fictifs sont créés pour les terminaux déconnectés (uniquement en node-breaker) : toujours, toujours sauf pour les organes de coupure ou jamais',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS': {
        defaultMessage: 'Toujours',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS_EXCEPT_SWITCHES': {
        defaultMessage: 'Toujours sauf pour les organes de coupure',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.NEVER': { defaultMessage: 'Jamais' },
    'iidm.import.cgmes.post-processors': { defaultMessage: 'Post-traitements' },
    'iidm.import.cgmes.post-processors.desc': { defaultMessage: 'Post-traitements' },
    'iidm.import.cgmes.post-processors.EntsoeCategory': { defaultMessage: 'EntsoeCategory' },
    'iidm.import.cgmes.post-processors.PhaseAngleClock': { defaultMessage: 'PhaseAngleClock' },
    'ucte.import.combine-phase-angle-regulation': { defaultMessage: 'Combiner les lois de réglage et de déphasage' },
    'ucte.import.combine-phase-angle-regulation.desc': {
        defaultMessage: 'Combiner les lois de réglage et de déphasage',
    },

    // IIDM
    'iidm.import.xml.throw-exception-if-extension-not-found': {
        defaultMessage: "Exception si une extension n'est pas connue",
    },
    'iidm.import.xml.throw-exception-if-extension-not-found.desc': {
        defaultMessage: "Lever une exception si on essaie d'importer une extension inconnue",
    },
    'iidm.import.xml.extensions': { defaultMessage: 'Extensions' },
    'iidm.import.xml.extensions.selectionDialog.name': { defaultMessage: 'Sélection des extensions' },
    'iidm.import.xml.extensions.desc': { defaultMessage: 'Importer avec ces extensions' },
    'iidm.import.xml.extensions.activePowerControl': { defaultMessage: 'Compensation' },
    'iidm.import.xml.extensions.baseVoltageMapping': { defaultMessage: 'Tension nominale' },
    'iidm.import.xml.extensions.branchObservability': { defaultMessage: 'Observabilité des quadripôles' },
    'iidm.import.xml.extensions.busbarSectionPosition': { defaultMessage: 'Position des SJBs' },
    'iidm.import.xml.extensions.branchStatus': {
        defaultMessage: 'Statut de consignation et de déclenchement (Version IIDM < 1.12)',
    },
    'iidm.import.xml.extensions.cgmesControlAreas': { defaultMessage: 'Cgmes - zone géographique' },
    'iidm.import.xml.extensions.cgmesDanglingLineBoundaryNode': {
        defaultMessage: 'Code EIC des lignes frontières (ligne non mergée)',
    },
    'iidm.import.xml.extensions.cgmesLineBoundaryNode': {
        defaultMessage: 'Code EIC des lignes frontières (ligne complète)',
    },
    'iidm.import.xml.extensions.cgmesMetadataModels': { defaultMessage: 'Cgmes - Métadonnées des modèles' },
    'iidm.import.xml.extensions.cgmesSshMetadata': { defaultMessage: 'Cgmes - ssh métadonnées' },
    'iidm.import.xml.extensions.cgmesSvMetadata': { defaultMessage: 'Cgmes - sv métadonnées' },
    'iidm.import.xml.extensions.cgmesTapChangers': { defaultMessage: 'Cgmes - lois de réglage et déphasage' },
    'iidm.import.xml.extensions.cimCharacteristics': { defaultMessage: 'Cgmes - caractéristiques' },
    'iidm.import.xml.extensions.coordinatedReactiveControl': { defaultMessage: 'Contrôle coordonné du réactif' },
    'iidm.import.xml.extensions.detail': { defaultMessage: 'Données détaillées des consommations (fixe | affine)' },
    'iidm.import.xml.extensions.discreteMeasurements': { defaultMessage: 'Télémesures (Régleurs et Déphaseurs)' },
    'iidm.import.xml.extensions.entsoeArea': { defaultMessage: 'Zone Entsoe' },
    'iidm.import.xml.extensions.entsoeCategory': { defaultMessage: 'Catégorie Entsoe des groupes' },
    'iidm.import.xml.extensions.generatorActivePowerControl': { defaultMessage: 'Compensation (Groupes)' },
    'iidm.import.xml.extensions.generatorAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des groupes',
    },
    'iidm.import.xml.extensions.generatorRemoteReactivePowerControl': {
        defaultMessage: 'Régulation à distance de la puissance réactive des groupes',
    },
    'iidm.import.xml.extensions.generatorShortCircuit': { defaultMessage: 'Données de court-circuit des groupes' },
    'iidm.import.xml.extensions.generatorShortCircuits': {
        defaultMessage: 'Données de court-circuit des groupes (Version IIDM 1.0)',
    },
    'iidm.import.xml.extensions.hvdcAngleDroopActivePowerControl': { defaultMessage: 'Emulation AC pour les HVDCs' },
    'iidm.import.xml.extensions.hvdcOperatorActivePowerRange': { defaultMessage: 'Limites de transits des HVDCs' },
    'iidm.import.xml.extensions.identifiableShortCircuit': { defaultMessage: 'Données de court-circuit des postes' },
    'iidm.import.xml.extensions.injectionObservability': { defaultMessage: 'Observabilité des injections' },
    'iidm.import.xml.extensions.lineAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des lignes',
    },
    'iidm.import.xml.extensions.linePosition': { defaultMessage: 'Coordonnées géographiques de lignes' },
    'iidm.import.xml.extensions.loadAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des consommations',
    },
    'iidm.import.xml.extensions.measurements': { defaultMessage: 'Télémesures' },
    'iidm.import.xml.extensions.mergedXnode': { defaultMessage: 'Xnode mergé' },
    'iidm.import.xml.extensions.operatingStatus': { defaultMessage: 'Statut de consignation et de déclenchement' },
    'iidm.import.xml.extensions.position': { defaultMessage: 'Position des départs' },
    'iidm.import.xml.extensions.referencePriorities': {
        defaultMessage: 'Indice de priorité des noeuds de référence (Calcul de répartition)',
    },
    'iidm.import.xml.extensions.referenceTerminals': {
        defaultMessage: 'Terminaux référence de phase (Calcul de répartition)',
    },
    'iidm.import.xml.extensions.secondaryVoltageControl': { defaultMessage: 'Réglage secondaire de tension' },
    'iidm.import.xml.extensions.slackTerminal': { defaultMessage: 'Noeud bilan' },
    'iidm.import.xml.extensions.standbyAutomaton': { defaultMessage: 'Automate des CSPRs' },
    'iidm.import.xml.extensions.startup': { defaultMessage: 'Coût de démarrage des groupes' },
    'iidm.import.xml.extensions.substationPosition': { defaultMessage: 'Coordonnées géographiques des sites' },
    'iidm.import.xml.extensions.threeWindingsTransformerAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    },
    'iidm.import.xml.extensions.threeWindingsTransformerPhaseAngleClock': {
        defaultMessage:
            "Angles de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à trois enroulements",
    },
    'iidm.import.xml.extensions.threeWindingsTransformerToBeEstimated': {
        defaultMessage: 'Estimation des prises des régleurs et des déphaseurs des transformateurs à trois enroulements',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerAsymmetrical': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerPhaseAngleClock': {
        defaultMessage:
            "Angle de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à deux enroulements",
    },
    'iidm.import.xml.extensions.twoWindingsTransformerToBeEstimated': {
        defaultMessage: 'Estimation des prises des régleurs et des déphaseurs des transformateurs à deux enroulements',
    },
    'iidm.import.xml.extensions.voltageLevelShortCircuits': {
        defaultMessage: 'Données de court-circuit des postes (Version IIDM 1.0)',
    },
    'iidm.import.xml.extensions.voltagePerReactivePowerControl': {
        defaultMessage: 'Contrôle de la tension par le réactif',
    },
    'iidm.import.xml.extensions.voltageRegulation': { defaultMessage: 'Réglage de tension' },
    'iidm.import.xml.extensions.xnode': { defaultMessage: 'Code Xnode' },

    // to remove after powsybl september release
    'iidm.import.xml.extensions.generatorFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des groupes',
    },
    'iidm.import.xml.extensions.lineFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des lignes',
    },
    'iidm.import.xml.extensions.loadFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des consommations',
    },
    'iidm.import.xml.extensions.threeWindingsTransformerFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerFortescue': {
        defaultMessage: 'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    },
    // end to remove
});
