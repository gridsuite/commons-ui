/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const filterFr = defineMessages({
    OR: { defaultMessage: 'OU' },
    AND: { defaultMessage: 'ET' },
    rule: { defaultMessage: 'critère' },
    subGroup: { defaultMessage: 'sous-groupe' },
    is: { defaultMessage: 'est' },
    contains: { defaultMessage: 'contient' },
    beginsWith: { defaultMessage: 'commence par' },
    endsWith: { defaultMessage: 'finit par' },
    exists: { defaultMessage: 'existe' },
    not_exists: { defaultMessage: "n'existe pas" },
    between: { defaultMessage: 'entre' },
    in: { defaultMessage: 'est parmi' },
    notIn: { defaultMessage: "n'est pas parmi" },
    inFilter: { defaultMessage: 'dans le filtre' },
    notInFilter: { defaultMessage: 'pas dans le filtre' },
    emptyRule: { defaultMessage: 'Le filtre contient un champ vide' },
    incorrectRule: { defaultMessage: 'Le filtre contient un champ incorrect' },
    obsoleteFilter: {
        defaultMessage: "Ce filtre n'est plus supporté. Veuillez le supprimer ou changer son type d'équipement.",
    },
    betweenRule: {
        defaultMessage: "La valeur de gauche d'un critère 'entre' doit être inférieure à la valeur de droite",
    },
    emptyGroup: {
        defaultMessage: 'Le filtre contient un groupe vide. Supprimez le ou ajoutez des critères à ce groupe',
    },
    Hvdc: { defaultMessage: 'HVDC' },
    'filter.expert': { defaultMessage: 'Par critères' },
    'filter.explicitNaming': { defaultMessage: 'Par nommage' },
    nameEmpty: { defaultMessage: 'Le nom est vide' },
    equipmentType: { defaultMessage: "Type d'ouvrage" },
    changeTypeMessage: { defaultMessage: "Le type d'ouvrage sera modifié et la configuration actuelle sera perdue." },
    PropertyValues: { defaultMessage: 'Valeurs de la propriété' },
    PropertyValues1: { defaultMessage: 'Valeurs de la propriété 1' },
    PropertyValues2: { defaultMessage: 'Valeurs de la propriété 2' },
    FreePropsCrit: { defaultMessage: 'Filtrage par propriétés' },
    AddFreePropCrit: { defaultMessage: 'Ajouter un filtrage par propriété' },
    FreeProps: { defaultMessage: "Propriétés de l'ouvrage" },
    SubstationFreeProps: { defaultMessage: "Propriétés du site de l'ouvrage" },
    YupRequired: { defaultMessage: 'Ce champ doit être renseigné' },
    filterPropertiesNameUniquenessError: {
        defaultMessage: "Il n'est pas possible d'ajouter plusieurs filtres pour la même propriété",
    },
    emptyFilterError: { defaultMessage: 'Le filtre doit contenir au moins un ouvrage' },
    distributionKeyWithMissingIdError: { defaultMessage: 'ID manquant avec une clé de répartition définie' },
    missingDistributionKeyError: { defaultMessage: 'Clé de répartition manquante' },
    filterCsvFileName: { defaultMessage: 'creationFiltre' },
    createNewFilter: { defaultMessage: 'Créer un filtre' },
    nameProperty: { defaultMessage: 'Nom' },
    Countries: { defaultMessage: 'Pays' },
    Countries1: { defaultMessage: 'Pays 1' },
    Countries2: { defaultMessage: 'Pays 2' },
    nominalVoltage: { defaultMessage: 'Tension nominale' },
    EnergySourceText: { defaultMessage: "Source d'énergie" },
    nameAlreadyUsed: { defaultMessage: 'Ce nom est déjà utilisé' },
    nameValidityCheckErrorMsg: { defaultMessage: 'Erreur lors de la vérification de la validité du nom' },
    cantSubmitWhileValidating: {
        defaultMessage: "Impossible de soumettre le formulaire durant la validation d'un champ",
    },
});
