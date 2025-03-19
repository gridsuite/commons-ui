/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const loginFr = defineMessages({
    'login/login': { defaultMessage: 'Se connecter' },
    'login/connection': { defaultMessage: 'Connexion' },
    'login/unauthorizedAccess': { defaultMessage: 'Accès non autorisé' },
    'login/unauthorizedAccessMessage': { defaultMessage: "L'utilisateur {userName} n'a pas encore accès à GridSuite" },
    'login/errorInUserValidation': { defaultMessage: "Erreur lors de la validation de l'utilisateur" },
    'login/errorInUserValidationMessage': {
        defaultMessage: "Une erreur s'est produite pendant la validation de l'utilisateur {userName}.",
    },
    'login/errorInLogout': { defaultMessage: "Erreur lors de la déconnexion de l'utilisateur" },
    'login/errorInLogoutMessage': {
        defaultMessage: "Une erreur s'est produite pendant la déconnexion de l'utilisateur {userName}.",
    },
    'login/logout': { defaultMessage: 'Se déconnecter' },
});
