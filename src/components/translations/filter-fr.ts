/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const filterFr = {
    OR: 'OU',
    AND: 'ET',
    rule: 'règle',
    subGroup: 'sous-groupe',
    is: 'est',
    contains: 'contient',
    beginsWith: 'commence par',
    endsWith: 'finit par',
    exists: 'existe',
    not_exists: "n'existe pas",
    between: 'entre',
    in: 'dans',
    isPartOf: 'fait partie de',
    isNotPartOf: 'ne fait pas partie de',
    emptyRule: 'Le filtre contient un champ vide',
    incorrectRule: 'Le filtre contient un champ incorrect',
    betweenRule:
        "La valeur de gauche d'une règle 'entre' doit être inférieure à la valeur de droite",
    emptyGroup:
        'Le filtre contient un groupe vide. Supprimez le ou ajoutez des règles à ce groupe',
    Hvdc: 'HVDC',
};

export default filterFr;
