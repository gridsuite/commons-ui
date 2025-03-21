/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const networkModificationsEn = defineMessages({
    'network_modifications.modificationsCount': {
        defaultMessage:
            '{hide, select, false {{count, plural, zero {no modification} one {# modification} other {# modifications}}} other {...}}',
    },
    'network_modifications.EQUIPMENT_DELETION': { defaultMessage: 'Deletion of {computedLabel}' },
    'network_modifications.BY_FILTER_DELETION': { defaultMessage: 'By filter deletion ({computedLabel})' },
    'network_modifications.SUBSTATION_CREATION': { defaultMessage: 'Creating substation {computedLabel}' },
    'network_modifications.SUBSTATION_MODIFICATION': { defaultMessage: 'Modifying substation {computedLabel}' },
    'network_modifications.VOLTAGE_LEVEL_CREATION': { defaultMessage: 'Creating voltage level {computedLabel}' },
    'network_modifications.VOLTAGE_LEVEL_MODIFICATION': { defaultMessage: 'Modifying voltage level {computedLabel}' },
    'network_modifications.LINE_SPLIT_WITH_VOLTAGE_LEVEL': { defaultMessage: 'Splitting a line {computedLabel}' },
    'network_modifications.LINE_ATTACH_TO_VOLTAGE_LEVEL': { defaultMessage: 'Attaching line {computedLabel}' },
    'network_modifications.LINES_ATTACH_TO_SPLIT_LINES': {
        defaultMessage: 'Attaching lines to splitting lines {computedLabel}',
    },
    'network_modifications.LOAD_SCALING': { defaultMessage: 'Load scaling {computedLabel}' },
    'network_modifications.DELETE_VOLTAGE_LEVEL_ON_LINE': {
        defaultMessage: 'Deleting a voltage level on a line {computedLabel}',
    },
    'network_modifications.DELETE_ATTACHING_LINE': { defaultMessage: 'Deleting attaching line {computedLabel}' },
    'network_modifications.LOAD_CREATION': { defaultMessage: 'Creating load {computedLabel}' },
    'network_modifications.LOAD_MODIFICATION': { defaultMessage: 'Modifying load {computedLabel}' },
    'network_modifications.BATTERY_CREATION': { defaultMessage: 'Creating battery {computedLabel}' },
    'network_modifications.BATTERY_MODIFICATION': { defaultMessage: 'Modifying battery {computedLabel}' },
    'network_modifications.GENERATOR_CREATION': { defaultMessage: 'Creating generator {computedLabel}' },
    'network_modifications.GENERATOR_MODIFICATION': { defaultMessage: 'Modifying generator {computedLabel}' },
    'network_modifications.LINE_CREATION': { defaultMessage: 'Creating line {computedLabel}' },
    'network_modifications.LINE_MODIFICATION': { defaultMessage: 'Modifying line {computedLabel}' },
    'network_modifications.TWO_WINDINGS_TRANSFORMER_CREATION': {
        defaultMessage: 'Creating 2 windings transformer {computedLabel}',
    },
    'network_modifications.TWO_WINDINGS_TRANSFORMER_MODIFICATION': {
        defaultMessage: 'Modifying 2 windings transformer {computedLabel}',
    },
    'network_modifications.OPERATING_STATUS_MODIFICATION': {
        defaultMessage:
            '{action, select, TRIP {Trip {computedLabel}} LOCKOUT {Lock out {computedLabel}} ENERGISE_END_ONE {Energise {computedLabel} on {energizedEnd}} ENERGISE_END_TWO {Energise {computedLabel} on {energizedEnd}} SWITCH_ON {Switch on {computedLabel}} other {Equipment operating status modification {computedLabel}}}',
    },
    'network_modifications.SHUNT_COMPENSATOR_CREATION': {
        defaultMessage: 'Creating shunt compensator {computedLabel}',
    },
    'network_modifications.SHUNT_COMPENSATOR_MODIFICATION': {
        defaultMessage: 'Modifying shunt compensator {computedLabel}',
    },
    'network_modifications.GENERATOR_SCALING': { defaultMessage: 'Generator scaling {computedLabel}' },
    'network_modifications.VSC_CREATION': { defaultMessage: 'Creating HVDC (VSC) {computedLabel}' },
    'network_modifications.VSC_MODIFICATION': { defaultMessage: 'Modifing HVDC (VSC) {computedLabel}' },
    'network_modifications.GROOVY_SCRIPT': { defaultMessage: 'Modification by script' },
    'network_modifications.EQUIPMENT_ATTRIBUTE_MODIFICATION': {
        defaultMessage:
            '{equipmentAttributeName, select, open {{equipmentAttributeValue, select, true {Open {computedLabel}} other {Close {computedLabel}}}} other {Equipment modification {computedLabel}}}',
    },
    'network_modifications.creatingModification': { defaultMessage: 'Creating modification ...' },
    'network_modifications.deletingModification': { defaultMessage: 'Deleting modification ...' },
    'network_modifications.updatingModification': { defaultMessage: 'Updating modification ...' },
    'network_modifications.stashingModification': { defaultMessage: 'Stashing modification ...' },
    'network_modifications.restoringModification': { defaultMessage: 'Restoring modification ...' },
    'network_modifications.modifications': { defaultMessage: 'Updating modification list ...' },
    'network_modifications.GENERATION_DISPATCH': { defaultMessage: 'Generation dispatch {computedLabel}' },
    'network_modifications.VOLTAGE_INIT_MODIFICATION': {
        defaultMessage: 'Voltage profile initialization {computedLabel}',
    },
    'network_modifications.TABULAR_MODIFICATION': { defaultMessage: 'Tabular modification - {computedLabel}' },
    'network_modifications.tabular.GENERATOR_MODIFICATION': { defaultMessage: 'generator modifications' },
    'network_modifications.tabular.LOAD_MODIFICATION': { defaultMessage: 'load modifications' },
    'network_modifications.BY_FORMULA_MODIFICATION': { defaultMessage: 'Modification by formula {computedLabel}' },
    'network_modifications.MODIFICATION_BY_ASSIGNMENT': { defaultMessage: 'Modification by filter {computedLabel}' },
    'network_modifications.tabular.LINE_MODIFICATION': { defaultMessage: 'line modifications' },
    'network_modifications.tabular.BATTERY_MODIFICATION': { defaultMessage: 'battery modifications' },
    'network_modifications.tabular.VOLTAGE_LEVEL_MODIFICATION': { defaultMessage: 'voltage level modifications' },
    'network_modifications.tabular.TWO_WINDINGS_TRANSFORMER_MODIFICATION': {
        defaultMessage: 'two windings transformer modifications',
    },
    'network_modifications.tabular.SHUNT_COMPENSATOR_MODIFICATION': {
        defaultMessage: 'linear shunt compensator modifications',
    },
    'network_modifications.tabular.SUBSTATION_MODIFICATION': { defaultMessage: 'substation modifications' },
    'network_modifications.TABULAR_CREATION': { defaultMessage: 'Tabular creation - {computedLabel}' },
    'network_modifications.tabular.GENERATOR_CREATION': { defaultMessage: 'generator creations' },
    'network_modifications.LCC_CREATION': { defaultMessage: 'Creating HVDC (LCC) {computedLabel}' },
    'network_modifications.STATIC_VAR_COMPENSATOR_CREATION': {
        defaultMessage: 'Creating static var compensator {computedLabel}',
    },
    'network_modifications.VOLTAGE_LEVEL_CREATION_SUBSTATION_CREATION': {
        defaultMessage: 'Creating voltage level {voltageLevelEquipmentId} and substation {substationEquipmentId}',
    },
});
