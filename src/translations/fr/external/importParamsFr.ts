/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const importParamsFr = {
    // CGMES
    'iidm.import.cgmes.allow-unsupported-tap-changers': "Autoriser n'importe quel type de régleur ou déphaseur",
    'iidm.import.cgmes.allow-unsupported-tap-changers.desc': "Autoriser n'importe quel type de régleur ou déphaseur",
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state':
        "Changement du signe des flux des MCS de l'état initial",
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state.desc':
        "Changement du signe des flux des MCS de l'état initial",
    'iidm.import.cgmes.convert-boundary': 'Importer les XNodes en tant que site/poste',
    'iidm.import.cgmes.convert-boundary.desc': 'Importer les XNodes en tant que site/poste',
    'iidm.import.cgmes.convert-sv-injections': 'Convertir les injections du fichier SV en conso',
    'iidm.import.cgmes.convert-sv-injections.desc': 'Convertir les injections du fichier SV en conso',
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node': 'Créer un SJB pour chaque noeud',
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node.desc': 'Créer un SJB pour chaque noeud',
    'iidm.import.cgmes.ensure-id-alias-unicity': "Assurer l'unicité des identifiants et des alias",
    'iidm.import.cgmes.ensure-id-alias-unicity.desc': "Assurer l'unicité des identifiants et des alias",
    'iidm.import.cgmes.naming-strategy': 'Type de nommage utilisé par le fichier de mapping des identifiants',
    'iidm.import.cgmes.naming-strategy.desc': 'Type de nommage utilisé par le fichier de mapping des identifiants',
    'iidm.import.cgmes.naming-strategy.identity': 'identity',
    'iidm.import.cgmes.naming-strategy.cgmes': 'cgmes',
    'iidm.import.cgmes.naming-strategy.cgmes-fix-all-invalid-id': 'cgmes-fix-all-invalid-id',
    'iidm.import.cgmes.import-control-areas': 'Importer les zones géographiques',
    'iidm.import.cgmes.import-control-areas.desc': 'Importer les zones géographiques (Control areas)',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions':
        'Profil utilisé pour initialiser les valeurs des sections enclenchés des MCS et les prises courantes des régleurs et déphaseurs',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.desc':
        'Profil utilisé pour initialiser les valeurs des sections enclenchés des MCS et les prises courantes des régleurs et déphaseurs',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SV': 'SV',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SSH': 'SSH',
    'iidm.import.cgmes.source-for-iidm-id': 'Identifiants CGMES utilisés pour créer les identifiants IIDM',
    'iidm.import.cgmes.source-for-iidm-id.desc': 'Identifiants CGMES utilisés pour créer les identifiants IIDM',
    'iidm.import.cgmes.source-for-iidm-id.mRID': 'mrID',
    'iidm.import.cgmes.source-for-iidm-id.rdfID': 'rdfID',
    'iidm.import.cgmes.store-cgmes-model-as-network-extension': "Stocker le CGMES initial en tant qu'extension",
    'iidm.import.cgmes.store-cgmes-model-as-network-extension.desc': "Stocker le CGMES initial en tant qu'extension",
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension':
        "Stocker le mapping des terminaux CGMES en IIDM en tant qu'extension",
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension.desc':
        "Stocker le mapping des terminaux CGMES en IIDM en tant qu'extension",
    'iidm.import.cgmes.create-active-power-control-extension': 'Créer une extension pour la compensation',
    'iidm.import.cgmes.create-active-power-control-extension.desc': 'Créer une extension pour la compensation',
    'iidm.import.cgmes.decode-escaped-identifiers': 'Décoder les caractères spéciaux échappés dans les identifiants',
    'iidm.import.cgmes.decode-escaped-identifiers.desc':
        'Décoder les caractères spéciaux échappés dans les identifiants',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode':
        'Créer des interrupteurs fictifs pour les terminaux déconnectés',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.desc':
        'Définir dans quel cas des interrupteurs fictifs sont créés pour les terminaux déconnectés (uniquement en node-breaker) : toujours, toujours sauf pour les organes de coupure ou jamais',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS': 'Toujours',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS_EXCEPT_SWITCHES':
        'Toujours sauf pour les organes de coupure',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.NEVER': 'Jamais',
    'iidm.import.cgmes.post-processors': 'Post-traitements',
    'iidm.import.cgmes.post-processors.desc': 'Post-traitements',
    'iidm.import.cgmes.post-processors.EntsoeCategory': 'EntsoeCategory',
    'iidm.import.cgmes.post-processors.PhaseAngleClock': 'PhaseAngleClock',
    'iidm.import.cgmes.import-node-breaker-as-bus-breaker': 'Importer un Node breaker comme un bus breaker',
    'iidm.import.cgmes.import-node-breaker-as-bus-breaker.desc':
        'Importer un réseau node breaker en tant que bus breaker',
    'iidm.import.cgmes.disconnect-boundary-line-if-boundary-side-is-disconnected':
        'Déconnexion automatique des lignes frontières',
    'iidm.import.cgmes.disconnect-boundary-line-if-boundary-side-is-disconnected.desc':
        'Force la déconnexion des lignes frontières si le côté frontière est déconnecté (Xnode)',
    'iidm.import.cgmes.create-fictitious-voltage-level-for-every-node': 'Créer un poste fictif pour chaque noeud',
    'iidm.import.cgmes.create-fictitious-voltage-level-for-every-node.desc': 'Créer un poste fictif pour chaque noeud',
    'iidm.import.cgmes.use-previous-values-during-update': 'Garder les valeurs initiales pendant la mise à jour',
    'iidm.import.cgmes.use-previous-values-during-update.desc':
        'Garder les valeurs initiales pendant la mise à jour du fichier ssh si elles sont absentes (Sinon elles seront remises à NaN)',
    'iidm.import.cgmes.remove-properties-and-aliases-after-import': 'Retirer les propriétés et les alias',
    'iidm.import.cgmes.remove-properties-and-aliases-after-import.desc':
        "Retire toutes les propriétés et tous les alias après l'import",
    'iidm.import.cgmes.use-detailed-dc-model': 'Utiliser le modèle détaillé DC',
    'iidm.import.cgmes.use-detailed-dc-model.desc': 'Utiliser le modèle détaillé de courant continu',
    'iidm.import.cgmes.silence-frequent-issues-warnings': 'Ne pas remonter les avertissements les plus fréquents',
    'iidm.import.cgmes.silence-frequent-issues-warnings.desc': 'Ne pas remonter les avertissements les plus fréquents',
    'iidm.import.cgmes.missing-permanent-limit-percentage':
        'Pourcentage appliqué à la limite temporaire pour créer la permanente',
    'iidm.import.cgmes.missing-permanent-limit-percentage.desc':
        'Si la limite permanente est absente, ajoute une limite permanente de x pourcentage de la temporaire (Version IIDM < 1.12)',

    // UCTE
    'ucte.import.combine-phase-angle-regulation': 'Combiner les lois de réglage et de déphasage',
    'ucte.import.combine-phase-angle-regulation.desc': 'Combiner les lois de réglage et de déphasage',
    'ucte.import.create-areas': 'Créer des zones',
    'ucte.import.create-areas.desc': 'Indique si des zones doivent être créées dans le modèle de réseau IIDM importé',
    'ucte.import.areas-dc-xnodes': 'Zones pour les xnodes DC',
    'ucte.import.areas-dc-xnodes.desc': 'Liste des xnodes qui doivent être considérés comme zones frontières DC',

    // IIDM
    // parameters
    'iidm.import.xml.throw-exception-if-extension-not-found': "Erreur si une extension n'est pas connue",
    'iidm.import.xml.throw-exception-if-extension-not-found.desc':
        "Lever une erreur si on essaie d'importer une extension inconnue",
    'iidm.import.xml.missing-permanent-limit-percentage':
        'Pourcentage appliqué à la limite temporaire pour créer la permanente',
    'iidm.import.xml.missing-permanent-limit-percentage.desc':
        'Si la limite permanente est absente, ajoute une limite permanente de x pourcentage de la temporaire (Version IIDM < 1.12)',
    'iidm.import.minimal-validation-level': "Niveau de validation de l'import",
    'iidm.import.minimal-validation-level.desc':
        "Permet de changer le niveau de validation de l'import du réseau, les valeurs possibles sont : 'EQUIPMENT' et 'STEADY_STATE_HYPOTHESIS'",
    'iidm.import.xml.with-automation-systems': 'Importer les automates',
    'iidm.import.xml.with-automation-systems.desc': "Permet d'importer les automates dans le réseau",

    // extensions
    'iidm.import.xml.included.extensions': 'Extensions',
    'iidm.import.xml.included.extensions.desc': 'Extensions',
    'iidm.import.xml.extensions.selectionDialog.name': 'Sélection des extensions',
    'iidm.import.xml.extensions.desc': 'Importer avec ces extensions',
    'iidm.import.xml.included.extensions.activePowerControl': 'Compensation',
    'iidm.import.xml.included.extensions.baseVoltageMapping': 'Tension nominale',
    'iidm.import.xml.included.extensions.batteryShortCircuit': 'Données de court-circuit des batteries',
    'iidm.import.xml.included.extensions.branchObservability': 'Observabilité des quadripôles',
    'iidm.import.xml.included.extensions.busbarSectionPosition': 'Position des SJBs',
    'iidm.import.xml.included.extensions.branchStatus':
        'Statut de consignation et de déclenchement (Version IIDM < 1.12)',
    'iidm.import.xml.included.extensions.cgmesControlAreas': 'Cgmes - zone géographique',
    'iidm.import.xml.included.extensions.cgmesBoundaryLineBoundaryNode':
        'Code EIC des lignes frontières (ligne non mergée)',
    'iidm.import.xml.included.extensions.cgmesLineBoundaryNode': 'Code EIC des lignes frontières (ligne complète)',
    'iidm.import.xml.included.extensions.cgmesMetadataModels': 'Cgmes - Métadonnées des modèles',
    'iidm.import.xml.included.extensions.cgmesSshMetadata': 'Cgmes - ssh métadonnées',
    'iidm.import.xml.included.extensions.cgmesSvMetadata': 'Cgmes - sv métadonnées',
    'iidm.import.xml.included.extensions.cgmesTapChangers': 'Cgmes - lois de réglage et déphasage',
    'iidm.import.xml.included.extensions.cimCharacteristics': 'Cgmes - caractéristiques',
    'iidm.import.xml.included.extensions.coordinatedReactiveControl': 'Contrôle coordonné du réactif',
    'iidm.import.xml.included.extensions.detail': 'Données détaillées des consommations (fixe | affine)',
    'iidm.import.xml.included.extensions.discreteMeasurements': 'Télémesures (Régleurs et Déphaseurs)',
    'iidm.import.xml.included.extensions.entsoeArea': 'Zone Entsoe',
    'iidm.import.xml.included.extensions.entsoeCategory': 'Catégorie Entsoe des groupes',
    'iidm.import.xml.included.extensions.generatorActivePowerControl': 'Compensation (Groupes)',
    'iidm.import.xml.included.extensions.generatorAsymmetrical': 'Données pour les calculs dissymétriques des groupes',
    'iidm.import.xml.included.extensions.generatorRemoteReactivePowerControl':
        'Régulation à distance de la puissance réactive des groupes',
    'iidm.import.xml.included.extensions.generatorShortCircuit': 'Données de court-circuit des groupes',
    'iidm.import.xml.included.extensions.generatorShortCircuits':
        'Données de court-circuit des groupes (Version IIDM 1.0)',
    'iidm.import.xml.included.extensions.hvdcAngleDroopActivePowerControl': 'Emulation AC pour les HVDCs',
    'iidm.import.xml.included.extensions.hvdcOperatorActivePowerRange': 'Limites de transits des HVDCs',
    'iidm.import.xml.included.extensions.identifiableShortCircuit': 'Données de court-circuit des postes',
    'iidm.import.xml.included.extensions.injectionObservability': 'Observabilité des injections',
    'iidm.import.xml.included.extensions.lineAsymmetrical': 'Données pour les calculs dissymétriques des lignes',
    'iidm.import.xml.included.extensions.linePosition': 'Coordonnées géographiques de lignes',
    'iidm.import.xml.included.extensions.loadAsymmetrical': 'Données pour les calculs dissymétriques des consommations',
    'iidm.import.xml.included.extensions.measurements': 'Télémesures',
    'iidm.import.xml.included.extensions.mergedXnode': 'Xnode mergé',
    'iidm.import.xml.included.extensions.operatingStatus': 'Statut de consignation et de déclenchement',
    'iidm.import.xml.included.extensions.position': 'Position des départs',
    'iidm.import.xml.included.extensions.referencePriorities':
        'Indice de priorité des noeuds de référence (Calcul de répartition)',
    'iidm.import.xml.included.extensions.referenceTerminals': 'Terminaux référence de phase (Calcul de répartition)',
    'iidm.import.xml.included.extensions.secondaryVoltageControl': 'Réglage secondaire de tension',
    'iidm.import.xml.included.extensions.slackTerminal': 'Noeud bilan',
    'iidm.import.xml.included.extensions.standbyAutomaton': 'Automate des CSPRs',
    'iidm.import.xml.included.extensions.startup': 'Coût de démarrage des groupes',
    'iidm.import.xml.included.extensions.substationPosition': 'Coordonnées géographiques des sites',
    'iidm.import.xml.included.extensions.threeWindingsTransformerAsymmetrical':
        'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    'iidm.import.xml.included.extensions.threeWindingsTransformerPhaseAngleClock':
        "Angles de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à trois enroulements",
    'iidm.import.xml.included.extensions.threeWindingsTransformerToBeEstimated':
        'Estimation des prises des régleurs et des déphaseurs des transformateurs à trois enroulements',
    'iidm.import.xml.included.extensions.twoWindingsTransformerAsymmetrical':
        'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    'iidm.import.xml.included.extensions.twoWindingsTransformerPhaseAngleClock':
        "Angle de phase entre les enroulements (sous forme d'horloge) pour les transformateurs à deux enroulements",
    'iidm.import.xml.included.extensions.twoWindingsTransformerToBeEstimated':
        'Estimation des prises des régleurs et des déphaseurs des transformateurs à deux enroulements',
    'iidm.import.xml.included.extensions.voltageLevelShortCircuits':
        'Données de court-circuit des postes (Version IIDM 1.0)',
    'iidm.import.xml.included.extensions.voltagePerReactivePowerControl': 'Contrôle de la tension par le réactif',
    'iidm.import.xml.included.extensions.voltageRegulation': 'Réglage de tension',
    'iidm.import.xml.included.extensions.xnode': 'Code Xnode',
    'iidm.import.xml.included.extensions.manualFrequencyRestorationReserve': 'Réserve tertiaire de fréquence',

    // to remove after powsybl september release
    'iidm.import.xml.included.extensions.generatorFortescue': 'Données pour les calculs dissymétriques des groupes',
    'iidm.import.xml.included.extensions.lineFortescue': 'Données pour les calculs dissymétriques des lignes',
    'iidm.import.xml.included.extensions.loadFortescue': 'Données pour les calculs dissymétriques des consommations',
    'iidm.import.xml.included.extensions.threeWindingsTransformerFortescue':
        'Données pour les calculs dissymétriques des transformateurs à trois enroulements',
    'iidm.import.xml.included.extensions.twoWindingsTransformerFortescue':
        'Données pour les calculs dissymétriques des transformateurs à deux enroulements',
    // end to remove
};
