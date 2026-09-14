/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    DUPLICATED_PROPS_ERROR,
    MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NAME_ALREADY_USED,
    NAME_EMPTY,
    NORMALIZED_PERCENTAGE,
    NUMERIC_VALUE_OR_EMPTY_FIELD,
    REAL_PERCENTAGE,
    YUP_DEFAULT,
    YUP_NOT_NULL,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_POSITIVE,
    YUP_REQUIRED,
} from '../../utils';

export const genericValidationFr = {
    [YUP_REQUIRED]: 'Obligatoire',
    [YUP_NOT_NULL]: 'Ne peut pas être vide',
    [YUP_DEFAULT]: 'Ce champ est invalide',
    [YUP_POSITIVE]: 'Doit être un nombre positif',
    [YUP_NOT_TYPE_NUMBER]: "Ce champ n'accepte que des valeurs numériques",
    [YUP_NOT_TYPE_DEFAULT]: "La valeur du champ n'est pas au bon format",
    [DUPLICATED_PROPS_ERROR]: 'Propriétés dupliquées : chaque propriété doit être unique',
    [MUST_BE_GREATER_OR_EQUAL_TO_ZERO]: 'Cette valeur doit être supérieure ou égale à 0',
    [NORMALIZED_PERCENTAGE]: 'Ce pourcentage doit être compris entre 0 et 100',
    [REAL_PERCENTAGE]: 'Cette valeur doit être comprise entre 0 et 1',
    [NAME_EMPTY]: 'Le nom est vide',
    [NAME_ALREADY_USED]: 'Ce nom est déjà utilisé',
    [NUMERIC_VALUE_OR_EMPTY_FIELD]: 'Valeur numérique ou Vider le champ',
    UniqueName: 'Le nom doit être unique',
    FieldNotEmpty: 'le champs ne doit pas être vide',
};
