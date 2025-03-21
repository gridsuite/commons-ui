/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const networkModificationsFr = defineMessages({
    'network_modifications.modificationsCount': {
        defaultMessage:
            '{hide, select, false {{count, plural, zero {aucune modification} one {# modification} other {# modifications}}} other {...}}',
    },
    'network_modifications.EQUIPMENT_DELETION': { defaultMessage: 'Suppression de {computedLabel}' },
    'network_modifications.BY_FILTER_DELETION': { defaultMessage: 'Suppression par filtre ({computedLabel})' },
    'network_modifications.SUBSTATION_CREATION': { defaultMessage: 'Création du site {computedLabel}' },
    'network_modifications.SUBSTATION_MODIFICATION': { defaultMessage: 'Modification du site {computedLabel}' },
    'network_modifications.VOLTAGE_LEVEL_CREATION': { defaultMessage: 'Création du poste {computedLabel}' },
    'network_modifications.VOLTAGE_LEVEL_MODIFICATION': { defaultMessage: 'Modification du poste {computedLabel}' },
    'network_modifications.LINE_SPLIT_WITH_VOLTAGE_LEVEL': { defaultMessage: "Création d'une coupure {computedLabel}" },
    'network_modifications.LINE_ATTACH_TO_VOLTAGE_LEVEL': { defaultMessage: "Création d'un piquage {computedLabel}" },
    'network_modifications.LINES_ATTACH_TO_SPLIT_LINES': {
        defaultMessage: 'Passage de piquage en coupure {computedLabel}',
    },
    'network_modifications.LOAD_SCALING': { defaultMessage: 'Variation plan de consommation {computedLabel}' },
    'network_modifications.DELETE_VOLTAGE_LEVEL_ON_LINE': {
        defaultMessage: "Suppression d'une coupure {computedLabel}",
    },
    'network_modifications.DELETE_ATTACHING_LINE': { defaultMessage: "Suppression d'un piquage {computedLabel}" },
    'network_modifications.LOAD_CREATION': { defaultMessage: 'Création de la charge {computedLabel}' },
    'network_modifications.LOAD_MODIFICATION': { defaultMessage: 'Modification de la charge {computedLabel}' },
    'network_modifications.BATTERY_CREATION': { defaultMessage: 'Création de batterie {computedLabel}' },
    'network_modifications.BATTERY_MODIFICATION': { defaultMessage: 'Modification de batterie {computedLabel}' },
    'network_modifications.GENERATOR_CREATION': { defaultMessage: 'Création du générateur {computedLabel}' },
    'network_modifications.GENERATOR_MODIFICATION': { defaultMessage: 'Modification du générateur {computedLabel}' },
    'network_modifications.LINE_CREATION': { defaultMessage: 'Création de la ligne {computedLabel}' },
    'network_modifications.LINE_MODIFICATION': { defaultMessage: 'Modification de la ligne {computedLabel}' },
    'network_modifications.TWO_WINDINGS_TRANSFORMER_CREATION': {
        defaultMessage: 'Création du transformateur à 2 enroulements {computedLabel}',
    },
    'network_modifications.TWO_WINDINGS_TRANSFORMER_MODIFICATION': {
        defaultMessage: 'Modification du transformateur à 2 enroulements {computedLabel}',
    },
    'network_modifications.OPERATING_STATUS_MODIFICATION': {
        defaultMessage:
            "{action, select, TRIP {Déclenchement de {computedLabel}} LOCKOUT {Consignation de {computedLabel}} ENERGISE_END_ONE {Mise sous tension à vide de {computedLabel} depuis {energizedEnd}} ENERGISE_END_TWO {Mise sous tension à vide de {computedLabel} depuis {energizedEnd}} SWITCH_ON {Mise en service de {computedLabel}} other {Modification du statut opérationnel de l'équipement {computedLabel}}}",
    },
    'network_modifications.SHUNT_COMPENSATOR_CREATION': {
        defaultMessage: "Création d'un moyen de compensation {computedLabel}",
    },
    'network_modifications.SHUNT_COMPENSATOR_MODIFICATION': {
        defaultMessage: "Modification d'un moyen de compensation {computedLabel}",
    },
    'network_modifications.GENERATOR_SCALING': { defaultMessage: 'Variation plan de production {computedLabel}' },
    'network_modifications.VSC_CREATION': { defaultMessage: 'Création de la HVDC (VSC) {computedLabel}' },
    'network_modifications.VSC_MODIFICATION': { defaultMessage: 'Modification de la HVDC (VSC) {computedLabel}' },
    'network_modifications.GROOVY_SCRIPT': { defaultMessage: 'Modification par script' },
    'network_modifications.EQUIPMENT_ATTRIBUTE_MODIFICATION': {
        defaultMessage:
            "{equipmentAttributeName, select, open {{equipmentAttributeValue, select, true {Ouverture de {computedLabel}} other {Fermeture de {computedLabel}}}} other {Modification de l'equipement {computedLabel}}}",
    },
    'network_modifications.creatingModification': { defaultMessage: 'Création de la modification en cours ...' },
    'network_modifications.deletingModification': { defaultMessage: 'Suppression de la modification en cours ...' },
    'network_modifications.updatingModification': { defaultMessage: 'Mise à jour de la modification en cours ...' },
    'network_modifications.stashingModification': {
        defaultMessage: 'Mise en corbeille de la modification en cours ...',
    },
    'network_modifications.restoringModification': { defaultMessage: 'Restauration de la modification en cours ...' },
    'network_modifications.modifications': { defaultMessage: 'Mise à jour de la liste des modifications en cours ...' },
    'network_modifications.GENERATION_DISPATCH': { defaultMessage: 'Démarrage de groupes {computedLabel}' },
    'network_modifications.VOLTAGE_INIT_MODIFICATION': {
        defaultMessage: 'Initialisation du plan de tension {computedLabel}',
    },
    'network_modifications.TABULAR_MODIFICATION': { defaultMessage: 'Modification tabulaire - {computedLabel}' },
    'network_modifications.tabular.GENERATOR_MODIFICATION': { defaultMessage: 'modifications de générateurs' },
    'network_modifications.tabular.LOAD_MODIFICATION': { defaultMessage: 'modifications de consommations' },
    'network_modifications.BY_FORMULA_MODIFICATION': { defaultMessage: 'Modification par formule {computedLabel}' },
    'network_modifications.MODIFICATION_BY_ASSIGNMENT': { defaultMessage: 'Modification par filtre {computedLabel}' },
    'network_modifications.tabular.LINE_MODIFICATION': { defaultMessage: 'modifications de lignes' },
    'network_modifications.tabular.BATTERY_MODIFICATION': { defaultMessage: 'modifications de batteries' },
    'network_modifications.tabular.VOLTAGE_LEVEL_MODIFICATION': { defaultMessage: 'modifications de postes' },
    'network_modifications.tabular.TWO_WINDINGS_TRANSFORMER_MODIFICATION': {
        defaultMessage: 'modifications de transformateurs à 2 enroulements',
    },
    'network_modifications.tabular.SHUNT_COMPENSATOR_MODIFICATION': {
        defaultMessage: 'modifications de MCS linéaires',
    },
    'network_modifications.tabular.SUBSTATION_MODIFICATION': { defaultMessage: 'modifications de sites' },
    'network_modifications.TABULAR_CREATION': { defaultMessage: 'Création tabulaire - {computedLabel}' },
    'network_modifications.tabular.GENERATOR_CREATION': { defaultMessage: 'créations de générateurs' },
    'network_modifications.LCC_CREATION': { defaultMessage: 'Création de la HVDC (LCC) {computedLabel}' },
    'network_modifications.STATIC_VAR_COMPENSATOR_CREATION': { defaultMessage: 'Création de CSPR {computedLabel}' },
    'network_modifications.VOLTAGE_LEVEL_CREATION_SUBSTATION_CREATION': {
        defaultMessage: 'Création du poste {voltageLevelEquipmentId} et du site {substationEquipmentId}',
    },
});
