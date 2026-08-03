/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    ACTIVE_LIMITS_MIN_MAX_INVALID,
    CREATE_SUBSTATION_IN_VOLTAGE_LEVEL_IDENTICAL_ID,
    MAXIMUM_SECTION_COUNT_MUST_BE_GREATER_OR_EQUAL_TO_ONE,
    MIN_ACTIVE_POWER_MUST_BE_LESS_OR_EQUAL_TO_MAX_ACTIVE_POWER,
    REACTIVE_LIMITS_MIN_MAX_INVALID,
    SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT,
    SHORT_CIRCUIT_CURRENT_LIMIT_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    SHUNT_COMPENSATOR_ERROR_Q_AT_NOMINAL_VOLTAGE_LESS_THAN_ZERO,
    VALUE_MUST_BE_NUMERIC_WHEN_PERCENTAGE_ERROR,
    VALUE_MUST_BE_REF_WHEN_PERCENTAGE_ERROR,
    WRONG_REF_OR_VALUE_ERROR,
} from '../../utils';

export const networkModificationValidationFr = {
    BusBarCountMustBeGreaterThanOrEqualToOne: 'Un nombre de barres doit être supérieur ou égal à 1',
    SectionCountMustBeGreaterThanOrEqualToOne: 'Un nombre de sections doit être supérieur ou égal à 1',
    SectionCountMustBeLessThanOrEqualToTwenty: 'Un nombre de sections doit être inférieur ou égal à 20',
    CreateCouplingDeviceIdenticalBusBar: 'Les SJB / Nœuds 1 et 2 doivent être différents',
    [CREATE_SUBSTATION_IN_VOLTAGE_LEVEL_IDENTICAL_ID]: "L'ID du poste doit être différent de celui du site",
    voltageLevelNominalVoltageMaxValueError: 'La limite de tension basse doit être inférieure à celle de tension haute',
    [SHORT_CIRCUIT_CURRENT_LIMIT_MUST_BE_GREATER_OR_EQUAL_TO_ZERO]:
        "Une limite d'ICC doit être supérieure ou égale à 0",
    ShortCircuitCurrentLimitMinMaxError: 'La limite ICC min doit être inférieure ou égale à la limite ICC max',
    [SHUNT_COMPENSATOR_ERROR_Q_AT_NOMINAL_VOLTAGE_LESS_THAN_ZERO]:
        'La valeur de Q à Unom doit être supérieure ou égale à 0',
    [MAXIMUM_SECTION_COUNT_MUST_BE_GREATER_OR_EQUAL_TO_ONE]: 'Le nombre de gradins doit être supérieur ou égal à 1',
    [SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT]:
        'La valeur de la prise courante doit être comprise entre 0 et le nombre de gradins',
    [MIN_ACTIVE_POWER_MUST_BE_LESS_OR_EQUAL_TO_MAX_ACTIVE_POWER]:
        'La valeur de la puissance active min doit être inférieure ou égale à la valeur de la puissance active max',
    [ACTIVE_LIMITS_MIN_MAX_INVALID]: 'La puissance active maximale doit être supérieure à la puissance active minimale',
    [REACTIVE_LIMITS_MIN_MAX_INVALID]:
        'La puissance réactive maximale doit être supérieure à la puissance réactive minimale',
    [WRONG_REF_OR_VALUE_ERROR]:
        'Veuillez saisir une valeur numérique valide ou une référence de champ valide. Utiliser # pour sélectionner un champ',
    [VALUE_MUST_BE_NUMERIC_WHEN_PERCENTAGE_ERROR]:
        "Lors de l'utilisation de %, ce champ doit être une valeur numérique positive valide",
    [VALUE_MUST_BE_REF_WHEN_PERCENTAGE_ERROR]:
        "Lors de l'utilisation de %, ce champ doit être une référence de champ valide",
    TemporaryLimitNameUnicityError: 'Les noms des limites temporaires doivent être uniques dans la table',
    TemporaryLimitDurationUnicityError: 'Les tempos des limites temporaires doivent être uniques dans la table',
    LimitSetApplicabilityError: "2 jeux de limites de même nom doivent s'appliquer sur des côtés différents.",
    permanentCurrentLimitMustBeGreaterThanZero: 'La valeur IST doit être supérieure à 0',
};
