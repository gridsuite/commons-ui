/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const businessErrorsFr = {
    'directory.permissionDenied': "Vous n'êtes pas autorisé à effectuer cette action.",
    'directory.elementNameBlank': "Le nom de l'élément ne peut pas être vide.",
    'directory.notDirectory': "L'élément sélectionné n'est pas un dossier.",
    'directory.elementNameConflict': 'Un élément portant le même nom existe déjà dans le dossier.',
    'directory.moveInDescendantNotAllowed': 'Impossible de déplacer un élément dans l’un de ses descendants.',
    'directory.someElementsAreMissing': 'Certains des éléments demandés sont manquants.',
    'directory.elementNotFound': "L'élément du dossier demandé est introuvable.",
    'directory.parentPermissionDenied': "Vous n'avez pas les droits d'accès suffisants sur le dossier parent",
    'directory.childPermissionDenied':
        "Le dossier contient au moins un sous-dossier pour lequel vous n'avez pas les droits d'accès s",
    'directory.targetPermissionDenied': "Vous n'avez pas les droits d'accès suffisants sur le dossier cible",
    'explore.permissionDenied': "Vous n'êtes pas autorisé à effectuer cette action.",
    'explore.maxElementsExceeded':
        "Vous avez atteint votre quota utilisateur en termes de situations et d'études ({limit} situations et études).",
    'explore.incorrectCaseFile': 'Format ou nom du fichier importé invalide.',
    'study.notFound': 'Étude non trouvée.',
    'study.computationRunning': "L'opération ne peut être menée car un calcul est en cours.",
    'study.loadflowError': 'Erreur de calcul de répartition.',
    'study.notAllowed': 'Opération non permise.',
    'study.cantDeleteRootNode': 'Un noeud racine ne peut être supprimé.',
    'study.moveNetworkModificationForbidden': 'Impossible de déplacer cette modification de réseau.',
    'study.badNodeType': 'Mauvais type de noeud.',
    'study.nodeNotBuilt': 'Noeud non réalisé.',
    'study.nodeNameAlreadyExist': 'Ce nom de noeud existe déjà.',
    'study.timeSeriesBadType': 'Série temporelle de mauvais type.',
    'study.noVoltageInitResultsForNode': "Pas de résultats pour l'initialisation du plan de tension.",
    'study.maxNodeBuildsExceeded':
        'Vous avez atteint votre quota utilisateur en termes de réalisation de nœud par étude ({limit} réalisations).',
    'study.rootNetworkDeleteForbidden': 'Impossible de supprimer ce réseau racine.',
    'study.maximumRootNetworkByStudyReached': 'Nombre maximal de réseau racine par étude atteint.',
    'study.maximumTagLengthExceeded': "Taille maximale d'étiquette atteinte.",
    'study.networkExportFailed': "Échec de l'export de réseau.",
    'study.tooManyNadConfigs': "Nombre maximal de configurations d'image nodale de zone atteint.",
    'study.tooManyMapCards': 'Nombre maximal de carte atteint.',
    'study.elementAlreadyExists': 'Un élément avec le nom {fileName} est déjà présent',
    'useradmin.permissionDenied': "Vous n'avez pas la permission d'effectuer cette action.",
    'useradmin.userNotFound': 'Utilisateur introuvable.',
    'useradmin.userAlreadyExists': "L'utilisateur existe déjà.",
    'useradmin.profileNotFound': 'Profil utilisateur introuvable.',
    'useradmin.profileAlreadyExists': 'Le profil utilisateur existe déjà.',
    'useradmin.groupNotFound': "Le groupe de l'utilisateur est introuvable.",
    'useradmin.groupAlreadyExists': "Le groupe d'utilisateurs existe déjà.",
    'useradmin.announcementInvalidPeriod': "La période de l'annonce est invalide.",
    'useradmin.announcementOverlap': "La période de l'annonce chevauche une autre annonce existante.",
    'filter.filterCycleDetected': 'Cycle de filtre détecté: {filters}',
    'computation.resultNotFound': 'Résultats non trouvés.',
    'computation.parametersNotFound': 'Paramètres non trouvés.',
    'computation.invalidSortFormat': 'Le format du tri est incorrect.',
    'computation.invalidExportParams': "Les paramètres d'export sont incorrects.",
    'computation.limitReductionConfigError': 'La configuration des abattements est incorrect.',
    'computation.runnerError': "Une erreur est survenue durant l'exécution du calcul.",
    'voltageInit.missingFilter': 'La configuration contient un ou des filtres qui ont été supprimés.',
    'shortcircuit.busOutOfVoltage': 'Bus sélectionné en dehors des limites de tension.',
    'shortcircuit.missingExtensionData': "Données de l'extension court-circuit manquantes.",
    'shortcircuit.inconsistentVoltageLevels':
        'Des postes ont des données Icc incohérentes. Vérifiez les logs pour déterminer lesquels.',
    'dynamicMapping.mappingNameNotProvided': 'Nom du mapping non fourni',
    'dynamicSecurityAnalysis.providerNotFound': "Simulateur d'analyse de sécurité dynamique non trouvé.",
    'dynamicSecurityAnalysis.contingenciesNotFound': 'Aucun aléa fourni.',
    'dynamicSecurityAnalysis.contingencyListEmpty': "La liste d'aléas fournie ne doit pas être nulle ou vide.",
    'dynamicSimulation.providerNotFound': 'Simulateur pour la simulation dynamique non trouvé.',
    'dynamicSimulation.mappingNotProvided': 'Mapping pour la simulation dynamique non fourni.',
    'dynamicSimulation.mappingNotLastRuleWithEmptyFilterError':
        'Seule la dernière règle peut avoir un filtre vide : type {equipmentType}, indice de la règle : {index}.',
    'sensitivityAnalysis.tooManyFactors':
        'Trop de facteurs pour exécuter l’analyse de sensibilité : {resultCount} résultats (limite : {resultCountLimit}) et {variableCount} variables (limite : {variableCountLimit}).',
    'pccMin.missingFilter': 'La configuration contient un filtre qui a été supprimé.',
};
