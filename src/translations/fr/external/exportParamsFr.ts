/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const exportParamsFr = {
    // CGMES
    'iidm.export.cgmes.base-name': 'Nom des fichiers',
    'iidm.export.cgmes.base-name.desc': "Nom des fichiers d'export",
    'iidm.export.cgmes.cim-version': 'Version CIM',
    'iidm.export.cgmes.cim-version.desc': 'Version du CIM à exporter',
    'iidm.export.cgmes.cim-version.14': '14',
    'iidm.export.cgmes.cim-version.16': '16',
    'iidm.export.cgmes.cim-version.100': '100',
    'iidm.export.cgmes.export-boundary-power-flows': 'Exporter les flux des terminaux frontières',
    'iidm.export.cgmes.export-boundary-power-flows.desc':
        'Exporter les flux des terminaux frontières dans le fichier SV',
    'iidm.export.cgmes.export-power-flows-for-switches': 'Exporter les flux au niveau des OCs',
    'iidm.export.cgmes.export-power-flows-for-switches.desc':
        'Exporter les flux au niveau des organes de coupures dans le fichier SV',
    'iidm.export.cgmes.naming-strategy': 'Type de conversion utilisé pour créer les identifiants CGMES',
    'iidm.export.cgmes.naming-strategy.desc': 'Type de conversion utilisé pour créer les identifiants CGMES',
    'iidm.export.cgmes.naming-strategy.identity': 'identity',
    'iidm.export.cgmes.naming-strategy.cgmes': 'cgmes',
    'iidm.export.cgmes.naming-strategy.cgmes-fix-all-invalid-ids': 'cgmes-fix-all-invalid-ids',
    'iidm.export.cgmes.profiles': 'Profils',
    'iidm.export.cgmes.profiles.desc': 'Profils à exporter',
    'iidm.export.cgmes.profiles.EQ': 'EQ',
    'iidm.export.cgmes.profiles.TP': 'TP',
    'iidm.export.cgmes.profiles.SSH': 'SSH',
    'iidm.export.cgmes.profiles.SV': 'SV',
    'iidm.export.cgmes.boundary-EQ-identifier': 'Identifiant du fichier de boundary EQ',
    'iidm.export.cgmes.boundary-EQ-identifier.desc': 'Identifiant du fichier EQ décrivant les terminaux frontières',
    'iidm.export.cgmes.boundary-TP-identifier': 'Identifiant du fichier de boundary TP',
    'iidm.export.cgmes.boundary-TP-identifier.desc':
        'Identifiant du fichier TP décrivant la topologie des terminaux frontières',
    'iidm.export.cgmes.modeling-authority-set': 'Définition du ModelingAuthority',
    'iidm.export.cgmes.modeling-authority-set.desc': 'Définition du ModelingAuthority',
    'iidm.export.cgmes.model-description': 'Description du Model',
    'iidm.export.cgmes.model-description.desc': 'Description du Model',
    'iidm.export.cgmes.export-transformers-with-highest-voltage-at-end1':
        'Exporter les tranformateurs avec le plus haut niveau de tension à la fin',
    'iidm.export.cgmes.export-transformers-with-highest-voltage-at-end1.desc':
        'Exporter les tranformateurs avec le plus haut niveau de tension à la fin',
    'iidm.export.cgmes.sourcing-actor': 'Nom du créateur du réseau',
    'iidm.export.cgmes.sourcing-actor.desc': 'Ajoute le nom du créateur du réseau',
    'iidm.export.cgmes.export-load-flow-status': 'Export du statut du loadflow',
    'iidm.export.cgmes.export-load-flow-status.desc': 'Exporter du statut du loadflow',
    'iidm.export.cgmes.max-p-mismatch-converged': 'Ecart maximum de puissance active tolérable sur chaque bus',
    'iidm.export.cgmes.max-p-mismatch-converged.desc':
        "L'écart maximum de puissance active tolérable sur chaque bus pour considérer que la loi de kirchhoff est respectée",
    'iidm.export.cgmes.max-q-mismatch-converged': 'Ecart maximum de puissance réactive tolérable sur chaque bus',
    'iidm.export.cgmes.max-q-mismatch-converged.desc':
        "L'écart maximum de puissance réactive tolérable sur chaque bus pour considérer que la loi de kirchhoff est respectée",
    'iidm.export.cgmes.export-sv-injections-for-slacks': 'Exporter les injections sv pour les noeuds bilans',
    'iidm.export.cgmes.export-sv-injections-for-slacks.desc':
        'Exporter les injections sv (qui représentent les déséquilibres) pour les nœuds bilans',
    'iidm.export.cgmes.uuid-namespace': 'Uuid du namespace',
    'iidm.export.cgmes.uuid-namespace.desc': 'Uuid du namespace',
    'iidm.export.cgmes.model-version': 'Version du modèle',
    'iidm.export.cgmes.model-version.desc': 'Version du modèle',
    'iidm.export.cgmes.business-process': 'Horizon de temps',
    'iidm.export.cgmes.business-process.desc': 'Horizon de temps visé par le réseau J-1, J-2 ou IJ',
    'iidm.export.cgmes.update-dependencies': 'Mettre à jour les dépendances',
    'iidm.export.cgmes.update-dependencies.desc':
        "Si à vrai met à jour les dépendances automatiquement sinon l'utilisateur les a déjà mises dans une extension de metadata",
    'iidm.export.cgmes.cgm_export': 'Exporter le cgm',
    'iidm.export.cgmes.cgm_export.desc': 'Exporter le cgm',

    // UCTE
    'ucte.export.naming-strategy': 'Type de conversion utilisé pour créer les identifiants UCTE',
    'ucte.export.naming-strategy.desc': 'Type de conversion utilisé pour créer les identifiants UCTE',
    'ucte.export.combine-phase-angle-regulation': 'Combiner les lois de réglage et de déphasage',
    'ucte.export.combine-phase-angle-regulation.desc': 'Combiner les lois de réglage et de déphasage',

    // XML
    // parameters
    'iidm.export.xml.indent': 'Indentation du fichier exporté',
    'iidm.export.xml.indent.desc': 'Indentation du fichier exporté',
    'iidm.export.xml.with-branch-state-variables': 'Exporter les flux au niveau des quadripôles',
    'iidm.export.xml.with-branch-state-variables.desc': 'Exporter les flux au niveau des quadripôles',
    'iidm.export.xml.only-main-cc': 'Exporter seulement la CC principale',
    'iidm.export.xml.only-main-cc.desc': 'Exporter seulement la composante connexe principale',
    'iidm.export.xml.anonymised': 'Anonymisation du réseau exporté',
    'iidm.export.xml.anonymised.desc': 'Anonymisation du réseau exporté',
    'iidm.export.xml.iidm-version-incompatibility-behavior': "Comportement en cas d'incompatibilité de version IIDM",
    'iidm.export.xml.iidm-version-incompatibility-behavior.desc':
        "Comportement en cas d'incompatibilité de version IIDM",
    'iidm.export.xml.iidm-version-incompatibility-behavior.THROW_EXCEPTION': 'Exception',
    'iidm.export.xml.iidm-version-incompatibility-behavior.LOG_ERROR': 'Logs',
    'iidm.export.xml.topology-level': 'Niveau de détail de la topologie',
    'iidm.export.xml.topology-level.desc': 'Niveau de détail de la topologie',
    'iidm.export.xml.topology-level.BUS_BRANCH': 'BUS_BRANCH',
    'iidm.export.xml.topology-level.BUS_BREAKER': 'BUS_BREAKER',
    'iidm.export.xml.topology-level.NODE_BREAKER': 'NODE_BREAKER',
    'iidm.export.xml.throw-exception-if-extension-not-found': "Exception si une extension n'est pas connue",
    'iidm.export.xml.throw-exception-if-extension-not-found.desc':
        "Lever une exception si on essaie d'exporter une extension inconnue",
    'iidm.export.xml.included.extensions.manualFrequencyRestorationReserve': 'Réserve tertiaire de fréquence',
    'iidm.export.xml.included.extensions.batteryShortCircuit': 'Données de court-circuit des batteries',
    'iidm.export.xml.with-automation-systems': 'Avec les automates',
    'iidm.export.xml.topology-level.voltage-levels.node-breaker': 'Postes en topologie node breaker',
    'iidm.export.xml.topology-level.voltage-levels.node-breaker.desc':
        'Applique la topologie node breaker aux postes sélectionnés',
    'iidm.export.xml.topology-level.voltage-levels.bus-breaker': 'Postes en topologie bus breaker',
    'iidm.export.xml.topology-level.voltage-levels.bus-breaker.desc':
        'Applique la topologie bus breaker aux postes sélectionnés',
    'iidm.export.xml.topology-level.voltage-levels.bus-branch': 'Postes en topologie bus branch',
    'iidm.export.xml.topology-level.voltage-levels.bus-branch.desc':
        'Applique la topologie bus branch aux postes sélectionnés',
    'iidm.export.xml.flatten': 'Mettre à plat',
    'iidm.export.xml.flatten.desc': 'Mettre à plat un réseau pour ignorer les sous réseaux',
    'iidm.export.xml.sorted': 'Trier les ouvrages dans le fichier',
    'iidm.export.xml.sorted.desc': 'Trier les ouvrages dans le fichier',
    'iidm.export.xml.version': 'Version IIDM',
    'iidm.export.xml.version.desc': 'Version IIDM utilisée pour générer le fichier',

    // extensions
    'iidm.export.xml.included.extensions': 'Extensions',
    'iidm.export.xml.included.extensions.selectionDialog.name': 'Sélection des extensions',
    'iidm.export.xml.included.extensions.desc': 'Exporter avec ces extensions',
    'iidm.export.xml.included.extensions.activePowerControl': 'Compensation',
    'iidm.export.xml.included.extensions.baseVoltageMapping': 'Tension nominale',
    'iidm.export.xml.included.extensions.branchObservability': 'Observabilité des quadripôles',
    'iidm.export.xml.included.extensions.busbarSectionPosition': 'Position des SJBs',
    'iidm.export.xml.included.extensions.branchStatus':
        'Statut de consignation et de déclenchement (Version IIDM < 1.12)',
    'iidm.export.xml.included.extensions.cgmesControlAreas': 'Cgmes - zone géographique',
    'iidm.export.xml.included.extensions.cgmesBoundaryLineBoundaryNode':
        'Code EIC des lignes frontières (ligne non mergée)',
    'iidm.export.xml.included.extensions.cgmesLineBoundaryNode': 'Code EIC des lignes frontières (ligne complète)',
    'iidm.export.xml.included.extensions.cgmesMetadataModels': 'Cgmes - Métadonnées des modèles',
    'iidm.export.xml.included.extensions.cgmesSshMetadata': 'Cgmes - ssh métadonnées',
    'iidm.export.xml.included.extensions.cgmesSvMetadata': 'Cgmes - sv métadonnées',
    'iidm.export.xml.included.extensions.cgmesTapChangers': 'Cgmes - lois de réglage et déphasage',
    'iidm.export.xml.included.extensions.cimCharacteristics': 'Cgmes - caractéristiques',
    'iidm.export.xml.included.extensions.coordinatedReactiveControl': 'Contrôle coordonné du réactif',
    'iidm.export.xml.included.extensions.detail': 'Données détaillées des consommations (fixe | affine)',
    'iidm.export.xml.included.extensions.discreteMeasurements': 'Télémesures (Régleurs et Déphaseurs)',
    'iidm.export.xml.included.extensions.entsoeArea': 'Zone Entsoe',
    'iidm.export.xml.included.extensions.entsoeCategory': 'Catégorie Entsoe des groupes',
    'iidm.export.xml.included.extensions.generatorActivePowerControl': 'Compensation (Groupes)',
    'iidm.export.xml.included.extensions.generatorFortescue': 'Données pour les calculs dissymétriques des groupes',
    'iidm.export.xml.included.extensions.generatorAsymmetrical': 'Données pour les calculs dissymétriques des groupes',
    'iidm.export.xml.included.extensions.generatorRemoteReactivePowerControl':
        'Régulation à distance de la puissance réactive des groupes',
    'iidm.export.xml.included.extensions.generatorShortCircuit': 'Données de court-circuit des groupes',
    'iidm.export.xml.included.extensions.generatorShortCircuits':
        'Données de court-circuit des groupes (Version IIDM 1.0)',
    'iidm.export.xml.included.extensions.hvdcAngleDroopActivePowerControl': 'Emulation AC pour les HVDCs',
    'iidm.export.xml.included.extensions.hvdcOperatorActivePowerRange': 'Limites de transits des HVDCs',
    'iidm.export.xml.included.extensions.identifiableShortCircuit': 'Données de court-circuit des postes',
    'iidm.export.xml.included.extensions.injectionObservability': 'Observabilité des injections',
    'iidm.export.xml.included.extensions.lineFortescue': 'Données pour les calculs dissymétriques des lignes',
    'iidm.export.xml.included.extensions.lineAsymmetrical': 'Données pour les calculs dissymétriques des lignes',
    'iidm.export.xml.included.extensions.linePosition': 'Coordonnées géographiques de lignes',
    'iidm.export.xml.included.extensions.loadFortescue': 'Données pour les calculs dissymétriques des consommations',
    'iidm.export.xml.included.extensions.loadAsymmetrical': 'Données pour les calculs dissymétriques des consommations',
    'iidm.export.xml.included.extensions.measurements': 'Télémesures',
    'iidm.export.xml.included.extensions.mergedXnode': 'Xnode mergé',
    'iidm.export.xml.included.extensions.operatingStatus': 'Statut de consignation et de déclenchement',
    'iidm.export.xml.included.extensions.position': 'Position des départs',
    'iidm.export.xml.included.extensions.referencePriorities':
        'Indice de priorité des noeuds de référence (Calcul de répartition)',
    'iidm.export.xml.included.extensions.referenceTerminals': 'Terminaux référence de phase (Calcul de répartition)',
    'iidm.export.xml.included.extensions.secondaryVoltageControl': 'Réglage secondaire de tension',
    'iidm.export.xml.included.extensions.slackTerminal': 'Nœud bilan',
    'iidm.export.xml.included.extensions.standbyAutomaton': 'Automate des CSPRs',
    'iidm.export.xml.included.extensions.startup': 'Coût de démarrage des groupes',
    'iidm.export.xml.included.extensions.substationPosition': 'Coordonnées géographiques des sites',
    'iidm.export.xml.included.extensions.threeWindingsTransformerFortescue':
        'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    'iidm.export.xml.included.extensions.threeWindingsTransformerAsymmetrical':
        'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    'iidm.export.xml.included.extensions.threeWindingsTransformerPhaseAngleClock':
        "Angles de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à trois enroulements",
    'iidm.export.xml.included.extensions.threeWindingsTransformerToBeEstimated':
        'Estimation des prises des régleurs et des déphaseurs des transformateurs à trois enroulements',
    'iidm.export.xml.included.extensions.twoWindingsTransformerFortescue':
        'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    'iidm.export.xml.included.extensions.twoWindingsTransformerAsymmetrical':
        'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    'iidm.export.xml.included.extensions.twoWindingsTransformerPhaseAngleClock':
        "Angle de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à deux enroulements",
    'iidm.export.xml.included.extensions.twoWindingsTransformerToBeEstimated':
        'Estimation des prises des régleurs et des déphaseurs des transformateurs à deux enroulements',
    'iidm.export.xml.included.extensions.voltageLevelShortCircuits':
        'Données de court-circuit des postes (Version IIDM 1.0)',
    'iidm.export.xml.included.extensions.voltagePerReactivePowerControl':
        'Lien entre la tension de consigne et la puissance réactive en mode réglage de tension (CSPRs)',
    'iidm.export.xml.included.extensions.voltageRegulation': 'Réglage de tension',
};
