/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import RightResizableBox from './right-resizable-box';
import { FlatParameters } from '../../src/components/FlatParameters/FlatParameters';

const EXAMPLE_PARAMETERS = [
    {
        name: 'voltageRemoteControl',
        type: 'BOOLEAN',
        description: 'Generator voltage remote control',
        defaultValue: 'true',
        possibleValues: null,
    },
    {
        name: 'plausibleActivePowerLimit',
        type: 'DOUBLE',
        description: 'Plausible active power limit',
        defaultValue: '5000.0',
        possibleValues: null,
    },
    {
        name: 'slackBusSelectionMode',
        type: 'STRING',
        description: 'Slack bus selection mode',
        defaultValue: 'MOST_MESHED',
        possibleValues: ['FIRST', 'MOST_MESHED', 'NAME', 'LARGEST_GENERATOR'],
    },
    {
        name: 'limitReductions',
        type: 'STRING_LIST',
        description: 'Limit reductions (in JSON)',
        defaultValue: [],
        possibleValues: null,
    },
    {
        name: 'slackBusesIds',
        type: 'STRING',
        description: 'Slack bus IDs',
        defaultValue: 'null',
        possibleValues: null,
    },
    {
        name: 'maxIteration',
        type: 'INTEGER',
        description: 'Max iterations',
        defaultValue: '30',
        possibleValues: null,
    },
    {
        name: 'newtonRaphsonConvEpsPerEq',
        type: 'DOUBLE',
        description: 'Newton-Raphson convergence epsilon per equation',
        defaultValue: '1.0E-4',
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.base-name',
        type: 'STRING',
        description: 'Basename for output files',
        defaultValue: null,
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.cim-version',
        type: 'STRING',
        description: 'CIM version to export',
        defaultValue: null,
        possibleValues: ['14', '16', '100'],
    },
    {
        name: 'iidm.export.cgmes.export-boundary-power-flows',
        type: 'BOOLEAN',
        description: "Export boundaries' power flows",
        defaultValue: true,
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.export-power-flows-for-switches',
        type: 'BOOLEAN',
        description: 'Export power flows for switches',
        defaultValue: false,
        possibleValues: null,
    },
    {
        name: 'iidm.export.cgmes.naming-strategy',
        type: 'STRING',
        description: 'Configure what type of naming strategy you want',
        defaultValue: 'identity',
        possibleValues: ['identity', 'cgmes', 'cgmes-fix-all-invalid-ids'],
    },
    {
        name: 'iidm.export.cgmes.profiles',
        type: 'STRING_LIST',
        description: 'Profiles to export',
        defaultValue: ['EQ', 'TP', 'SSH', 'SV'],
        possibleValues: ['EQ', 'TP', 'SSH', 'SV'],
    },
    {
        name: 'iidm.export.xml.extensions',
        type: 'STRING_LIST',
        description: 'The list of exported extensions',
        defaultValue: [
            'generatorShortCircuit',
            'identifiableShortCircuit',
            'slackTerminal',
            'entsoeArea',
            'coordinatedReactiveControl',
            'linePosition',
            'baseVoltageMapping',
            'voltagePerReactivePowerControl',
            'substationPosition',
            'cgmesControlAreas',
            'loadAsymmetrical',
            'cgmesTapChangers',
            'branchObservability',
            'generatorFortescue',
            'startup',
            'branchStatus',
            'cgmesDanglingLineBoundaryNode',
            'cgmesLineBoundaryNode',
            'busbarSectionPosition',
            'threeWindingsTransformerToBeEstimated',
            'injectionObservability',
            'cgmesSvMetadata',
            'measurements',
            'twoWindingsTransformerPhaseAngleClock',
            'generatorShortCircuits',
            'entsoeCategory',
            'hvdcOperatorActivePowerRange',
            'twoWindingsTransformerFortescue',
            'hvdcAngleDroopActivePowerControl',
            'standbyAutomaton',
            'voltageLevelShortCircuits',
            'twoWindingsTransformerToBeEstimated',
            'generatorActivePowerControl',
            'discreteMeasurements',
            'secondaryVoltageControl',
            'cimCharacteristics',
            'cgmesSshMetadata',
            'position',
            'detail',
            'threeWindingsTransformerPhaseAngleClock',
            'lineFortescue',
            'activePowerControl',
            'threeWindingsTransformerFortescue',
        ],
        possibleValues: [
            'generatorShortCircuit',
            'identifiableShortCircuit',
            'slackTerminal',
            'entsoeArea',
            'coordinatedReactiveControl',
            'linePosition',
            'baseVoltageMapping',
            'voltagePerReactivePowerControl',
            'substationPosition',
            'cgmesControlAreas',
            'loadAsymmetrical',
            'cgmesTapChangers',
            'branchObservability',
            'generatorFortescue',
            'startup',
            'branchStatus',
            'cgmesDanglingLineBoundaryNode',
            'cgmesLineBoundaryNode',
            'busbarSectionPosition',
            'threeWindingsTransformerToBeEstimated',
            'injectionObservability',
            'cgmesSvMetadata',
            'measurements',
            'twoWindingsTransformerPhaseAngleClock',
            'generatorShortCircuits',
            'entsoeCategory',
            'hvdcOperatorActivePowerRange',
            'twoWindingsTransformerFortescue',
            'hvdcAngleDroopActivePowerControl',
            'standbyAutomaton',
            'voltageLevelShortCircuits',
            'twoWindingsTransformerToBeEstimated',
            'generatorActivePowerControl',
            'discreteMeasurements',
            'secondaryVoltageControl',
            'cimCharacteristics',
            'cgmesSshMetadata',
            'position',
            'detail',
            'threeWindingsTransformerPhaseAngleClock',
            'lineFortescue',
            'activePowerControl',
            'threeWindingsTransformerFortescue',
        ],
    },
];

function FlatParametersTab() {
    const [currentParameters, setCurrentParameters] = useState({});
    const onChange = useCallback((paramName, value, isEdit) => {
        if (!isEdit) {
            setCurrentParameters((prevCurrentParameters) => {
                return {
                    ...prevCurrentParameters,
                    ...{ [paramName]: value },
                };
            });
        }
    }, []);
    return (
        <div style={{ display: 'flex', margin: 8 }}>
            <RightResizableBox>
                <FlatParameters
                    paramsAsArray={EXAMPLE_PARAMETERS}
                    initValues={currentParameters}
                    onChange={onChange}
                    variant="standard"
                    showSeparator
                    selectionWithDialog={(param) =>
                        param?.possibleValues?.length > 10
                    }
                />
            </RightResizableBox>
        </div>
    );
}

export default FlatParametersTab;
