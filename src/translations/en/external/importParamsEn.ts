/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const importParamsEn = {
    // CGMES
    'iidm.import.cgmes.allow-unsupported-tap-changers': 'Allow unsupported tap changers',
    'iidm.import.cgmes.allow-unsupported-tap-changers.desc': 'Allow import of potentially unsupported tap changers',
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state':
        'Change sign for shunt power flow in initial state',
    'iidm.import.cgmes.change-sign-for-shunt-reactive-power-flow-initial-state.desc':
        'Change the sign of the power flow for shunt in initial state',
    'iidm.import.cgmes.convert-boundary': 'Convert boundary',
    'iidm.import.cgmes.convert-boundary.desc': 'Convert boundary during import',
    'iidm.import.cgmes.convert-sv-injections': 'Convert SV injections',
    'iidm.import.cgmes.convert-sv-injections.desc': 'Convert SV injections during import',
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node':
        'Create busbar section for every connectivity node',
    'iidm.import.cgmes.create-busbar-section-for-every-connectivity-node.desc':
        'Create busbar section for every connectivity node',
    'iidm.import.cgmes.ensure-id-alias-unicity': 'Ensure IDs and aliases unicity ',
    'iidm.import.cgmes.ensure-id-alias-unicity.desc': 'Ensure IDs and aliases are unique',
    'iidm.import.cgmes.naming-strategy': 'Naming strategy',
    'iidm.import.cgmes.naming-strategy.desc':
        'Configure what type of naming strategy you want to use for the provided ID mapping file',
    'iidm.import.cgmes.naming-strategy.identity': 'identity',
    'iidm.import.cgmes.naming-strategy.cgmes': 'cgmes',
    'iidm.import.cgmes.naming-strategy.cgmes-fix-all-invalid-id': 'cgmes-fix-all-invalid-id',
    'iidm.import.cgmes.import-control-areas': 'Import control areas',
    'iidm.import.cgmes.import-control-areas.desc': 'Import control areas',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions':
        'Profile used for initial state values of shunt sections and tap position',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.desc':
        'Profile used for initial state values of shunt sections and tap position',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SV': 'SV',
    'iidm.import.cgmes.profile-for-initial-values-shunt-sections-tap-positions.SSH': 'SSH',
    'iidm.import.cgmes.source-for-iidm-id': 'Source for IIDM identifiers',
    'iidm.import.cgmes.source-for-iidm-id.desc': 'Source for IIDM identifiers',
    'iidm.import.cgmes.source-for-iidm-id.mRID': 'mrID',
    'iidm.import.cgmes.source-for-iidm-id.rdfID': 'rdfID',
    'iidm.import.cgmes.store-cgmes-model-as-network-extension': 'Store cgmes model as network extension',
    'iidm.import.cgmes.store-cgmes-model-as-network-extension.desc':
        'Store the initial CGMES model as a network extension',
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension':
        'Store cgmes conversion context as network extension',
    'iidm.import.cgmes.store-cgmes-conversion-context-as-network-extension.desc':
        'Store the CGMES-IIDM terminal mapping as a network extension',
    'iidm.import.cgmes.create-active-power-control-extension': 'Create active power control extension',
    'iidm.import.cgmes.create-active-power-control-extension.desc':
        'Create active power control extension during import',
    'iidm.import.cgmes.decode-escaped-identifiers': 'Decode escaped identifiers',
    'iidm.import.cgmes.decode-escaped-identifiers.desc': 'Decode escaped special characters in IDs',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode':
        'Create fictitious switches for disconnected terminals mode',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.desc':
        'Defines in which case fictitious switches for disconnected terminals are created (relevant for node-breaker models only): always, always except for switches or never',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS': 'Always',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.ALWAYS_EXCEPT_SWITCHES':
        'Always except switches',
    'iidm.import.cgmes.create-fictitious-switches-for-disconnected-terminals-mode.NEVER': 'Never',
    'iidm.import.cgmes.post-processors': 'Post processors',
    'iidm.import.cgmes.post-processors.desc': 'Post processors',
    'iidm.import.cgmes.post-processors.EntsoeCategory': 'EntsoeCategory',
    'iidm.import.cgmes.post-processors.PhaseAngleClock': 'PhaseAngleClock',
    'iidm.import.cgmes.import-node-breaker-as-bus-breaker': 'Import node breaker as bus breaker',
    'iidm.import.cgmes.import-node-breaker-as-bus-breaker.desc': 'Import node breaker as bus breaker network',
    'iidm.import.cgmes.disconnect-boundary-line-if-boundary-side-is-disconnected':
        'Disconnect boundary line if boundary side is disconnected',
    'iidm.import.cgmes.create-fictitious-voltage-level-for-every-node':
        'Create fictitious voltage level for every node',
    'iidm.import.cgmes.use-previous-values-during-update': 'Use previous values during update',
    'iidm.import.cgmes.remove-properties-and-aliases-after-import': 'Remove properties and aliases after import',
    'iidm.import.cgmes.use-detailed-dc-model': 'Use detailed DC model',
    'iidm.import.cgmes.silence-frequent-issues-warnings': 'Silent frequent issues warnings',
    'iidm.import.cgmes.missing-permanent-limit-percentage': 'Create missing permanent limit with temporary one',

    // UCTE
    'ucte.import.combine-phase-angle-regulation': 'Combine phase and angle regulation',
    'ucte.import.combine-phase-angle-regulation.desc': 'Combine phase and angle regulation',
    'ucte.import.create-areas': 'Create areas',
    'ucte.import.create-areas.desc': 'Indicate if areas should be created in the imported IIDM grid model',
    'ucte.import.areas-dc-xnodes': 'Areas for DC xnodes',
    'ucte.import.areas-dc-xnodes.desc': 'defines the list of X-nodes that should be considered as area DC boundaries',

    // IIDM
    // import parameters
    'iidm.import.xml.throw-exception-if-extension-not-found': 'Throw exception if extension not found',
    'iidm.import.xml.throw-exception-if-extension-not-found.desc': 'Throw exception if extension not found',
    'iidm.import.xml.missing-permanent-limit-percentage': 'Create missing permanent limit with temporary one',
    'iidm.import.minimal-validation-level': 'Minimal validation level',
    'iidm.import.xml.with-automation-systems': 'With automation systems',

    // import extensions
    'iidm.import.xml.included.extensions': 'Extensions',
    'iidm.import.xml.included.extensions.selectionDialog.name': 'Extensions selection',
    'iidm.import.xml.included.extensions.desc': 'Import with these extensions',
    'iidm.import.xml.included.extensions.activePowerControl': 'Active power control',
    'iidm.import.xml.included.extensions.baseVoltageMapping': 'Base voltage mapping',
    'iidm.import.xml.included.extensions.branchObservability': 'Branch observability',
    'iidm.import.xml.included.extensions.busbarSectionPosition': 'Busbar section position',
    'iidm.import.xml.included.extensions.branchStatus': 'Branch status (IIDM version < 1.12)',
    'iidm.import.xml.included.extensions.cgmesControlAreas': 'Cgmes control areas',
    'iidm.import.xml.included.extensions.cgmesBoundaryLineBoundaryNode': 'Cgmes boundary line boundary node',
    'iidm.import.xml.included.extensions.cgmesLineBoundaryNode': 'Cgmes line boundary node',
    'iidm.import.xml.included.extensions.cgmesMetadataModels': 'Cgmes models metadata',
    'iidm.import.xml.included.extensions.cgmesSshMetadata': 'Cgmes ssh metadata',
    'iidm.import.xml.included.extensions.cgmesSvMetadata': 'Cgmes sv metadata',
    'iidm.import.xml.included.extensions.cgmesTapChangers': 'Cgmes tap changers',
    'iidm.import.xml.included.extensions.cimCharacteristics': 'Cgmes characteristics',
    'iidm.import.xml.included.extensions.coordinatedReactiveControl': 'Coordinated reactive control',
    'iidm.import.xml.included.extensions.detail': 'Load detail',
    'iidm.import.xml.included.extensions.discreteMeasurements': 'Discrete measurements',
    'iidm.import.xml.included.extensions.entsoeArea': 'Entsoe area',
    'iidm.import.xml.included.extensions.entsoeCategory': 'Entsoe category',
    'iidm.import.xml.included.extensions.generatorActivePowerControl': 'Generator active power control',
    'iidm.import.xml.included.extensions.generatorAsymmetrical': 'Generator asymmetrical',
    'iidm.import.xml.included.extensions.generatorRemoteReactivePowerControl':
        'Generator remote reactive power control',
    'iidm.import.xml.included.extensions.generatorShortCircuit': 'Generator short-circuit',
    'iidm.import.xml.included.extensions.generatorShortCircuits': 'Generator short-circuit (IIDM version 1.0)',
    'iidm.import.xml.included.extensions.hvdcAngleDroopActivePowerControl': 'HVDC angle droop active power control',
    'iidm.import.xml.included.extensions.hvdcOperatorActivePowerRange': 'HVDC operator active power range',
    'iidm.import.xml.included.extensions.identifiableShortCircuit': 'Identifiable short-circuit',
    'iidm.import.xml.included.extensions.injectionObservability': 'Injection observability',
    'iidm.import.xml.included.extensions.lineAsymmetrical': 'Line asymmetrical',
    'iidm.import.xml.included.extensions.linePosition': 'Line position',
    'iidm.import.xml.included.extensions.loadAsymmetrical': 'Load asymmetrical',
    'iidm.import.xml.included.extensions.measurements': 'Measurements',
    'iidm.import.xml.included.extensions.mergedXnode': 'Merged Xnode',
    'iidm.import.xml.included.extensions.operatingStatus': 'Operating status',
    'iidm.import.xml.included.extensions.position': 'Connectable position',
    'iidm.import.xml.included.extensions.referencePriorities': 'Reference priorities (LoadFlow)',
    'iidm.import.xml.included.extensions.referenceTerminals': 'Reference terminals (LoadFlow)',
    'iidm.import.xml.included.extensions.secondaryVoltageControl': 'Secondary voltage control',
    'iidm.import.xml.included.extensions.slackTerminal': 'Slack terminal',
    'iidm.import.xml.included.extensions.standbyAutomaton': 'Static var compensators automaton',
    'iidm.import.xml.included.extensions.startup': 'Generator startup',
    'iidm.import.xml.included.extensions.substationPosition': 'Substation position',
    'iidm.import.xml.included.extensions.threeWindingsTransformerAsymmetrical':
        'Three windings transformer asymmetrical',
    'iidm.import.xml.included.extensions.threeWindingsTransformerPhaseAngleClock':
        'Three windings transformer phase angle clock',
    'iidm.import.xml.included.extensions.threeWindingsTransformerToBeEstimated':
        'Three windings transformer to be estimated',
    'iidm.import.xml.included.extensions.twoWindingsTransformerAsymmetrical': 'Two windings transformer asymmetrical',
    'iidm.import.xml.included.extensions.twoWindingsTransformerPhaseAngleClock':
        'Two windings transformer phase angle clock',
    'iidm.import.xml.included.extensions.twoWindingsTransformerToBeEstimated':
        'Two windings transformer to be estimated',
    'iidm.import.xml.included.extensions.voltageLevelShortCircuits': 'Voltage level short circuits',
    'iidm.import.xml.included.extensions.voltagePerReactivePowerControl': 'Voltage per reactive power control',
    'iidm.import.xml.included.extensions.voltageRegulation': 'Voltage regulation',
    'iidm.import.xml.included.extensions.xnode': 'Xnode',
    'iidm.import.xml.included.extensions.manualFrequencyRestorationReserve': 'Manual frequency restoration reserve',

    // to remove after powsybl september release
    'iidm.import.xml.included.extensions.generatorFortescue': 'Generator asymmetrical',
    'iidm.import.xml.included.extensions.lineFortescue': 'Line asymmetrical',
    'iidm.import.xml.included.extensions.loadFortescue': 'Load asymmetrical',
    'iidm.import.xml.included.extensions.threeWindingsTransformerFortescue': 'Three windings transformer asymmetrical',
    'iidm.import.xml.included.extensions.twoWindingsTransformerFortescue': 'Two windings transformer asymmetrical',
    // end to remove
};
