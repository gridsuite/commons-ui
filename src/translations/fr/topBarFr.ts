/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const topBarFr = defineMessages({
    'top-bar/userSettings': { defaultMessage: 'Paramètres utilisateur' },
    'top-bar/logout': { defaultMessage: 'Se déconnecter' },
    'top-bar/goFullScreen': { defaultMessage: 'Plein écran' },
    'top-bar/exitFullScreen': { defaultMessage: 'Quitter mode plein écran' },
    'top-bar/userInformation': { defaultMessage: 'Informations utilisateur' },
    'top-bar/about': { defaultMessage: 'À propos' },
    'top-bar/displayMode': { defaultMessage: "Mode d'affichage" },
    'top-bar/equipmentLabel': { defaultMessage: 'Label des ouvrages' },
    'top-bar/id': { defaultMessage: 'Id' },
    'top-bar/name': { defaultMessage: 'Nom' },
    'top-bar/language': { defaultMessage: 'Langue' },
    'top-bar/developerModeWarning': {
        defaultMessage:
            'Mode développeur : Certaines fonctionnalités ne sont pas complètes et peuvent ne pas fonctionner comme prévu.',
    },

    'about-dialog/title': { defaultMessage: 'À propos' },
    'about-dialog/version': { defaultMessage: 'Version {version}' },
    'about-dialog/alert-running-old-version-msg': {
        defaultMessage:
            "Ancienne version de l'application.\nVeuillez sauvegarder votre travail et rafraîchir l'application pour charger la dernière version",
    },
    'about-dialog/license': { defaultMessage: 'Licence' },
    'about-dialog/modules-section': { defaultMessage: 'Détails des modules' },
    'about-dialog/label-version': { defaultMessage: 'Version' },
    'about-dialog/label-git-version': { defaultMessage: 'Tag' },
    'about-dialog/label-type': { defaultMessage: 'Type' },
    'about-dialog/module-tooltip-app': { defaultMessage: 'application' },
    'about-dialog/module-tooltip-server': { defaultMessage: 'serveur' },
    'about-dialog/module-tooltip-other': { defaultMessage: 'autre' },

    'user-information-dialog/title': { defaultMessage: 'Informations utilisateur' },
    'user-information-dialog/role': { defaultMessage: 'Rôle' },
    'user-information-dialog/role-user': { defaultMessage: 'Utilisateur simple' },
    'user-information-dialog/role-admin': { defaultMessage: 'Admin' },
    'user-information-dialog/profile': { defaultMessage: 'Profil' },
    'user-information-dialog/no-profile': { defaultMessage: 'Pas de profil' },
    'user-information-dialog/quotas': { defaultMessage: 'Quotas' },
    'user-information-dialog/number-of-cases-or-studies': { defaultMessage: 'Nombre situations ou études' },
    'user-information-dialog/used': { defaultMessage: 'Utilisé : {nb}' },
    'user-information-dialog/number-of-builds-per-study': { defaultMessage: 'Nombre réalisations par étude' },

    'user-settings-dialog/title': { defaultMessage: 'Paramètres utilisateur' },
    'user-settings-dialog/label-developer-mode': { defaultMessage: 'Mode développeur' },
    'user-settings-dialog/warning-developer-mode': {
        defaultMessage:
            'Certaines fonctionnalités ne sont pas complètes et peuvent donc ne pas fonctionner comme prévu. Pour masquer ces fonctionnalités, désactivez le mode développeur.',
    },
    'user-settings-dialog/close': { defaultMessage: 'Fermer' },
});
