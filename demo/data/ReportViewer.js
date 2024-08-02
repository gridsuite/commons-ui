/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable no-template-curly-in-string */

const LOGS_JSON = {
    taskKey: 'Test',
    defaultName: 'Test',
    taskValues: {},
    subReporters: [
        {
            taskKey: 'loadflow',
            defaultName: 'loadflow',
            taskValues: {},
            subReporters: [
                {
                    taskKey: 'loadFlow',
                    defaultName: 'Load flow on network ${networkId}',
                    taskValues: {
                        networkId: {
                            value: 'test',
                            type: 'UNTYPED',
                        },
                    },
                    subReporters: [
                        {
                            taskKey: 'createLfNetwork',
                            defaultName: 'Create network ${networkNum}',
                            taskValues: {
                                networkNum: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                        {
                            taskKey: 'postLoading',
                            defaultName:
                                'Post loading process on network CC${numNetworkCc} SC${numNetworkSc}',
                            taskValues: {
                                numNetworkCc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                                numNetworkSc: {
                                    value: 0,
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'networkSize',
                                    defaultMessage:
                                        'Network CC${numNetworkCc} SC${numNetworkSc} has ${nbBuses} buses (voltage remote control: ${nbRemoteControllerBuses} controllers, ${nbRemoteControlledBuses} controlled) and ${nbBranches} branches',
                                    values: {
                                        nbBranches: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControlledBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbRemoteControllerBuses: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        nbBuses: {
                                            value: 3,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'networkBalance',
                                    defaultMessage:
                                        'Network CC${numNetworkCc} SC${numNetworkSc} balance: active generation=${activeGeneration} MW, active load=${activeLoad} MW, reactive generation=${reactiveGeneration} MVar, reactive load=${reactiveLoad} MVar',
                                    values: {
                                        reactiveLoad: {
                                            value: 18.0,
                                            type: 'UNTYPED',
                                        },
                                        activeLoad: {
                                            value: 180.0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkCc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        numNetworkSc: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        activeGeneration: {
                                            value: 200.0,
                                            type: 'UNTYPED',
                                        },
                                        reactiveGeneration: {
                                            value: 0.0,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on generation',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'mismatchDistributionSuccess',
                                    defaultMessage:
                                        'Iteration ${iteration}: slack bus active power (${initialMismatch} MW) distributed in ${nbIterations} iterations',
                                    values: {
                                        reportSeverity: {
                                            value: 'ERROR',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        nbIterations: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                        iteration: {
                                            value: 0,
                                            type: 'UNTYPED',
                                        },
                                        initialMismatch: {
                                            value: -19.98634545729172,
                                            type: 'Mismatch',
                                        },
                                    },
                                },
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'FATAL',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Distributed slack on generation',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [
                                {
                                    reportKey: 'NoMismatchDistribution',
                                    defaultMessage:
                                        'Iteration ${iteration}: already balanced',
                                    values: {
                                        reportSeverity: {
                                            value: 'WARN',
                                            type: 'INFO_LOGLEVEL',
                                        },
                                        iteration: {
                                            value: 1,
                                            type: 'UNTYPED',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            taskKey: 'OuterLoop',
                            defaultName: 'Outer loop ${outerLoopType}',
                            taskValues: {
                                outerLoopType: {
                                    value: 'Reactive limits',
                                    type: 'UNTYPED',
                                },
                            },
                            subReporters: [],
                            reports: [],
                        },
                    ],
                    reports: [],
                },
            ],
            reports: [],
        },
    ],
    reports: [],
};

export default LOGS_JSON;
