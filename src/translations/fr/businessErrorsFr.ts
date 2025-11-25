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
    'explore.permissionDenied': "Vous n'êtes pas autorisé à effectuer cette action.",
    'explore.maxElementExceededError':
        "Vous avez atteint votre quota utilisateur en termes de situations et d'études, vous ne pouvez donc plus importer des situations ou créer des études pour le moment. Merci de supprimer des situations ou études anciennes afin de redescendre sous le seuil de {limit} éléments.",
    'explore.incorrectCaseFile': 'Le fichier réseau fourni est incorrect.',
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
        'Vous avez atteint votre quota utilisateur en termes de réalisations par étude, vous ne pouvez donc plus réaliser de nœuds dans cette étude pour le moment. Merci de déréaliser des nœuds afin de redescendre sous le seuil de {limit} réalisations.',
    'study.rootNetworkDeleteForbidden': 'Impossible de supprimer ce réseau racine.',
    'study.maximumRootNetworkByStudyReached': 'Nombre maximal de réseau racine par étude atteint.',
    'study.maximumTagLengthExceeded': "Taille maximale d'étiquette atteinte.",
    'study.networkExportFailed': "Échec de l'export de réseau.",
    'study.tooManyNadConfigs': "Nombre maximal de configurations d'image nodale de zone atteint.",
    'study.tooManyMapCards': 'Nombre maximal de carte atteint.',
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
};
