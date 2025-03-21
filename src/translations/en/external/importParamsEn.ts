/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineMessages } from '../../utils';

export const importParamsEn = defineMessages({
    'iidm.import.cgmes.allow-unsupported-tap-changers': { defaultMessage: 'Allow unsupported tap changers' },
    'iidm.import.cgmes.allow-unsupported-tap-changers.desc': {
        defaultMessage: 'Allow import of potentially unsupported tap changers',
    },
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state': {
        defaultMessage: 'Change sign for shunt power flow in initial state',
    },
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state.desc': {
        defaultMessage: 'Change the sign of the power flow for shunt in initial state',
    },
    'iidm.import.cgmes.convert-boundary': { defaultMessage: 'Convert boundary' },
    'iidm.import.cgmes.convert-boundary.desc': { defaultMessage: 'Convert boundary during import' },
    'iidm.import.cgmes.convert-sv-injections': { defaultMessage: 'Convert SV injections' },
    'iidm.import.cgmes.convert-sv-injections.desc': { defaultMessage: 'Convert SV injections during import' },
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node': {
        defaultMessage: 'Create busbar section for every connectivity node',
    },
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node.desc': {
        defaultMessage: 'Create busbar section for every connectivity node',
    },
    'iidm.import.cgmes.ensure-id-alias-unicity': { defaultMessage: 'Ensure IDs and aliases unicity ' },
    'iidm.import.cgmes.ensure-id-alias-unicity.desc': { defaultMessage: 'Ensure IDs and aliases are unique' },
    'iidm.import.cgmes.naming-strategy': { defaultMessage: 'Naming strategy' },
    'iidm.import.cgmes.naming-strategy.desc': {
        defaultMessage: 'Configure what type of naming strategy you want to use for the provided ID mapping file',
    },
    'iidm.import.cgmes.naming-strategy.identity': { defaultMessage: 'identity' },
    'iidm.import.cgmes.naming-strategy.cgmes': { defaultMessage: 'cgmes' },
    'iidm.import.cgmes.naming-strategy.cgmes-fix-all-invalid-id': { defaultMessage: 'cgmes-fix-all-invalid-id' },
    'iidm.import.cgmes.import-control-areas': { defaultMessage: 'Import control areas' },
    'iidm.import.cgmes.import-control-areas.desc': { defaultMessage: 'Import control areas' },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions': {
        defaultMessage: 'Profile used for initial state values of shunt sections and tap position',
    },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.desc': {
        defaultMessage: 'Profile used for initial state values of shunt sections and tap position',
    },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SV': { defaultMessage: 'SV' },
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SSH': { defaultMessage: 'SSH' },
    'iidm.import.cgmes.source-for-iidm-id': { defaultMessage: 'Source for IIDM identifiers' },
    'iidm.import.cgmes.source-for-iidm-id.desc': { defaultMessage: 'Source for IIDM identifiers' },
    'iidm.import.cgmes.source-for-iidm-id.mRID': { defaultMessage: 'mrID' },
    'iidm.import.cgmes.source-for-iidm-id.rdfID': { defaultMessage: 'rdfID' },
    'iidm.import.cgmes.store-cgmes-model-as-network-extension': {
        defaultMessage: 'Store cgmes model as network extension',
    },
    'iidm.import.cgmes.store-cgmes-model-as-network-extension.desc': {
        defaultMessage: 'Store the initial CGMES model as a network extension',
    },
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension': {
        defaultMessage: 'Store cgmes conversion context as network extension',
    },
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension.desc': {
        defaultMessage: 'Store the CGMES-IIDM terminal mapping as a network extension',
    },
    'iidm.import.cgmes.create-active-power-control-extension': {
        defaultMessage: 'Create active power control extension',
    },
    'iidm.import.cgmes.create-active-power-control-extension.desc': {
        defaultMessage: 'Create active power control extension during import',
    },
    'iidm.import.cgmes.decode-escaped-identifiers': { defaultMessage: 'Decode escaped identifiers' },
    'iidm.import.cgmes.decode-escaped-identifiers.desc': { defaultMessage: 'Decode escaped special characters in IDs' },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode': {
        defaultMessage: 'Create fictitious switches for disconnected terminals mode',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.desc': {
        defaultMessage:
            'Defines in which case fictitious switches for disconnected terminals are created (relevant for node-breaker models only): always, always except for switches or never',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS': { defaultMessage: 'Always' },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS_EXCEPT_SWITCHES': {
        defaultMessage: 'Always except switches',
    },
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.NEVER': { defaultMessage: 'Never' },
    'iidm.import.cgmes.post-processors': { defaultMessage: 'Post processors' },
    'iidm.import.cgmes.post-processors.desc': { defaultMessage: 'Post processors' },
    'iidm.import.cgmes.post-processors.EntsoeCategory': { defaultMessage: 'EntsoeCategory' },
    'iidm.import.cgmes.post-processors.PhaseAngleClock': { defaultMessage: 'PhaseAngleClock' },
    'ucte.import.combine-phase-angle-regulation': { defaultMessage: 'Combine phase and angle regulation' },
    'ucte.import.combine-phase-angle-regulation.desc': { defaultMessage: 'Combine phase and angle regulation' },
    // IIDM
    'iidm.import.xml.throw-exception-if-extension-not-found': {
        defaultMessage: 'Throw exception if extension not found',
    },
    'iidm.import.xml.throw-exception-if-extension-not-found.desc': {
        defaultMessage: 'Throw exception if extension not found',
    },
    'iidm.import.xml.extensions': { defaultMessage: 'Extensions' },
    'iidm.import.xml.extensions.selectionDialog.name': { defaultMessage: 'Extensions selection' },
    'iidm.import.xml.extensions.desc': { defaultMessage: 'Import with these extensions' },
    'iidm.import.xml.extensions.activePowerControl': { defaultMessage: 'Active power control' },
    'iidm.import.xml.extensions.baseVoltageMapping': { defaultMessage: 'Base voltage mapping' },
    'iidm.import.xml.extensions.branchObservability': { defaultMessage: 'Branch observability' },
    'iidm.import.xml.extensions.busbarSectionPosition': { defaultMessage: 'Busbar section position' },
    'iidm.import.xml.extensions.branchStatus': { defaultMessage: 'Branch status (IIDM version < 1.12)' },
    'iidm.import.xml.extensions.cgmesControlAreas': { defaultMessage: 'Cgmes control areas' },
    'iidm.import.xml.extensions.cgmesDanglingLineBoundaryNode': { defaultMessage: 'Cgmes dangling line boundary node' },
    'iidm.import.xml.extensions.cgmesLineBoundaryNode': { defaultMessage: 'Cgmes line boundary node' },
    'iidm.import.xml.extensions.cgmesMetadataModels': { defaultMessage: 'Cgmes models metadata' },
    'iidm.import.xml.extensions.cgmesSshMetadata': { defaultMessage: 'Cgmes ssh metadata' },
    'iidm.import.xml.extensions.cgmesSvMetadata': { defaultMessage: 'Cgmes sv metadata' },
    'iidm.import.xml.extensions.cgmesTapChangers': { defaultMessage: 'Cgmes tap changers' },
    'iidm.import.xml.extensions.cimCharacteristics': { defaultMessage: 'Cgmes characteristics' },
    'iidm.import.xml.extensions.coordinatedReactiveControl': { defaultMessage: 'Coordinated reactive control' },
    'iidm.import.xml.extensions.detail': { defaultMessage: 'Load detail' },
    'iidm.import.xml.extensions.discreteMeasurements': { defaultMessage: 'Discrete measurements' },
    'iidm.import.xml.extensions.entsoeArea': { defaultMessage: 'Entsoe area' },
    'iidm.import.xml.extensions.entsoeCategory': { defaultMessage: 'Entsoe category' },
    'iidm.import.xml.extensions.generatorActivePowerControl': { defaultMessage: 'Generator active power control' },
    'iidm.import.xml.extensions.generatorAsymmetrical': { defaultMessage: 'Generator asymmetrical' },
    'iidm.import.xml.extensions.generatorRemoteReactivePowerControl': {
        defaultMessage: 'Generator remote reactive power control',
    },
    'iidm.import.xml.extensions.generatorShortCircuit': { defaultMessage: 'Generator short-circuit' },
    'iidm.import.xml.extensions.generatorShortCircuits': {
        defaultMessage: 'Generator short-circuit (IIDM version 1.0)',
    },
    'iidm.import.xml.extensions.hvdcAngleDroopActivePowerControl': {
        defaultMessage: 'HVDC angle droop active power control',
    },
    'iidm.import.xml.extensions.hvdcOperatorActivePowerRange': { defaultMessage: 'HVDC operator active power range' },
    'iidm.import.xml.extensions.identifiableShortCircuit': { defaultMessage: 'Identifiable short-circuit' },
    'iidm.import.xml.extensions.injectionObservability': { defaultMessage: 'Injection observability' },
    'iidm.import.xml.extensions.lineAsymmetrical': { defaultMessage: 'Line asymmetrical' },
    'iidm.import.xml.extensions.linePosition': { defaultMessage: 'Line position' },
    'iidm.import.xml.extensions.loadAsymmetrical': { defaultMessage: 'Load asymmetrical' },
    'iidm.import.xml.extensions.measurements': { defaultMessage: 'Measurements' },
    'iidm.import.xml.extensions.mergedXnode': { defaultMessage: 'Merged Xnode' },
    'iidm.import.xml.extensions.operatingStatus': { defaultMessage: 'Operating status' },
    'iidm.import.xml.extensions.position': { defaultMessage: 'Connectable position' },
    'iidm.import.xml.extensions.referencePriorities': { defaultMessage: 'Reference priorities (LoadFlow)' },
    'iidm.import.xml.extensions.referenceTerminals': { defaultMessage: 'Reference terminals (LoadFlow)' },
    'iidm.import.xml.extensions.secondaryVoltageControl': { defaultMessage: 'Secondary voltage control' },
    'iidm.import.xml.extensions.slackTerminal': { defaultMessage: 'Slack terminal' },
    'iidm.import.xml.extensions.standbyAutomaton': { defaultMessage: 'Static var compensators automaton' },
    'iidm.import.xml.extensions.startup': { defaultMessage: 'Generator startup' },
    'iidm.import.xml.extensions.substationPosition': { defaultMessage: 'Substation position' },
    'iidm.import.xml.extensions.threeWindingsTransformerAsymmetrical': {
        defaultMessage: 'Three windings transformer asymmetrical',
    },
    'iidm.import.xml.extensions.threeWindingsTransformerPhaseAngleClock': {
        defaultMessage: 'Three windings transformer phase angle clock',
    },
    'iidm.import.xml.extensions.threeWindingsTransformerToBeEstimated': {
        defaultMessage: 'Three windings transformer to be estimated',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerAsymmetrical': {
        defaultMessage: 'Two windings transformer asymmetrical',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerPhaseAngleClock': {
        defaultMessage: 'Two windings transformer phase angle clock',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerToBeEstimated': {
        defaultMessage: 'Two windings transformer to be estimated',
    },
    'iidm.import.xml.extensions.voltageLevelShortCircuits': { defaultMessage: 'Voltage level short circuits' },
    'iidm.import.xml.extensions.voltagePerReactivePowerControl': {
        defaultMessage: 'Voltage per reactive power control',
    },
    'iidm.import.xml.extensions.voltageRegulation': { defaultMessage: 'Voltage regulation' },
    'iidm.import.xml.extensions.xnode': { defaultMessage: 'Xnode' },

    // to remove after powsybl september release
    'iidm.import.xml.extensions.generatorFortescue': { defaultMessage: 'Generator asymmetrical' },
    'iidm.import.xml.extensions.lineFortescue': { defaultMessage: 'Line asymmetrical' },
    'iidm.import.xml.extensions.loadFortescue': { defaultMessage: 'Load asymmetrical' },
    'iidm.import.xml.extensions.threeWindingsTransformerFortescue': {
        defaultMessage: 'Three windings transformer asymmetrical',
    },
    'iidm.import.xml.extensions.twoWindingsTransformerFortescue': {
        defaultMessage: 'Two windings transformer asymmetrical',
    },
    // end to remove
});
