/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    DESCRIPTION_LIMIT_ERROR,
    MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NAME_EMPTY,
    NORMALIZED_PERCENTAGE,
    REAL_PERCENTAGE,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_REQUIRED,
} from '../../utils';

export const validationFr = {
    [YUP_REQUIRED]: 'Ce champ doit être renseigné',
    [YUP_NOT_TYPE_NUMBER]: "Ce champ n'accepte que des valeurs numériques",
    [YUP_NOT_TYPE_DEFAULT]: "La valeur du champ n'est pas au bon format",
    [NAME_EMPTY]: 'Le nom est vide',
    [DESCRIPTION_LIMIT_ERROR]: 'La description dépasse la limite de caractères',
    [MUST_BE_GREATER_OR_EQUAL_TO_ZERO]: 'Cette valeur doit être supérieure ou égale à 0',
    [NORMALIZED_PERCENTAGE]: 'Ce pourcentage doit être compris entre 0 et 100',
    [REAL_PERCENTAGE]: 'Cette valeur doit être comprise entre 0 et 1',
};
