/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const filterExpertEn = {
    id: 'ID',
    name: 'Name',
    energySource: 'Energy source',
    country: 'Country',
    voltageRegulatorOn: 'Voltage regulation',
    PlannedActivePowerSetPoint: 'Planning active power set point (MW)',
    minP: 'Minimum active power (MW)',
    maxP: 'Maximum active power (MW)',
    targetP: 'Active power target (MW)',
    targetV: 'Voltage target (kV)',
    targetQ: 'Reactive power target (MVar)',
    connected: 'Connected',
    maximumSectionCount: 'Maximum number of sections',
    sectionCount: 'Current number of sections',
    shuntCompensatorType: 'Type',
    Capacitor: 'Capacitor',
    Reactor: 'Reactor',
    maxQAtNominalV: 'Available Qmax at nominal voltage (MVar)',
    SwitchedOnMaxQAtNominalV: 'Switch-on Q at nominal voltage (MVar)',
    maxSusceptance: 'Maximum available susceptance (S)',
    SwitchedOnMaxSusceptance: 'Switch-on susceptance (S)',
    ratedS: 'Rated nominal power (MVA)',
    ratedS1: 'Rated nominal power side 1 (MVA)',
    ratedS2: 'Rated nominal power side 2 (MVA)',
    ratedS3: 'Rated nominal power side 3 (MVA)',
    marginalCost: 'Cost',
    plannedOutageRate: 'Planning outage rate',
    forcedOutageRate: 'Forced outage rate',
    vlId: 'Voltage level ID',
    p0: 'Constant P (MW)',
    q0: 'Constant Q (MVar)',
    loadTapChangingCapabilities: 'Ratio tap changer on-load',
    loadTapChangingCapabilities1: 'Ratio tap changer 1 on-load',
    loadTapChangingCapabilities2: 'Ratio tap changer 2 on-load',
    loadTapChangingCapabilities3: 'Ratio tap changer 3 on-load',
    ratioTargetV: 'Ratio tap changer voltage set point (kV)',
    ratioTargetV1: 'Ratio tap changer 1 voltage set point (kV)',
    ratioTargetV2: 'Ratio tap changer 2 voltage set point (kV)',
    ratioTargetV3: 'Ratio tap changer 3 voltage set point (kV)',
    magnetizingConductance: 'Magnetizing conductance (μS)',
    magnetizingConductance1: 'Magnetizing conductance side 1 (μS)',
    magnetizingConductance2: 'Magnetizing conductance side 2 (μS)',
    magnetizingConductance3: 'Magnetizing conductance side 3 (μS)',
    magnetizingSusceptance: 'Magnetizing susceptance (μS)',
    magnetizingSusceptance1: 'Magnetizing susceptance side 1 (μS)',
    magnetizingSusceptance2: 'Magnetizing susceptance side 2 (μS)',
    magnetizingSusceptance3: 'Magnetizing susceptance side 3 (μS)',
    vlNominalVoltage: 'Voltage level nominal voltage (kV)',
    lowVoltageLimit: 'Low voltage limit (kV)',
    highVoltageLimit: 'High voltage limit (kV)',
    selectFilterDialogTitle: 'Choose a filter',
    filter: 'Filter',
    loadType: 'Type',
    Undefined: 'Undefined',
    Auxiliary: 'Auxiliary',
    Fictitious: 'Fictitious',
    hasRatioTapChanger: 'Ratio tap changer exists',
    hasRatioTapChanger1: 'Ratio tap 1 changer exists',
    hasRatioTapChanger2: 'Ratio tap 2 changer exists',
    hasRatioTapChanger3: 'Ratio tap 3 changer exists',
    hasPhaseTapChanger: 'Phase tap changer exists',
    hasPhaseTapChanger1: 'Phase tap 1 changer exists',
    hasPhaseTapChanger2: 'Phase tap 2 changer exists',
    hasPhaseTapChanger3: 'Phase tap 3 changer exists',
    Voltage: 'Voltage',
    ReactivePower: 'Reactive power',
    VoltageRegulation: 'Voltage regulation',
    FixedRatio: 'Fixed ratio',
    CurrentLimiter: 'Current limiter',
    ActivePowerControl: 'Active power control',
    FixedTap: 'Fixed tap',
    ratioRegulationMode: 'Ratio tap changer regulation mode',
    ratioRegulationMode1: 'Ratio tap 1 changer regulation mode',
    ratioRegulationMode2: 'Ratio tap 2 changer regulation mode',
    ratioRegulationMode3: 'Ratio tap 3 changer regulation mode',
    phaseRegulationMode: 'Phase tap changer regulation mode',
    phaseRegulationMode1: 'Phase tap 1 changer regulation mode',
    phaseRegulationMode2: 'Phase tap 2 changer regulation mode',
    phaseRegulationMode3: 'Phase tap 3 changer regulation mode',
    phaseRegulationValue: 'Phase tap changer flow set point or current limit',
    phaseRegulationValue1: 'Phase tap 1 changer flow set point or current limit',
    phaseRegulationValue2: 'Phase tap 2 changer flow set point or current limit',
    phaseRegulationValue3: 'Phase tap 3 changer flow set point or current limit',
    property: 'Property',
    substationProperty: 'Substation property',
    substationProperty1: 'Substation property 1',
    substationProperty2: 'Substation property 2',
    substationProperty1Twt: 'Substation property 1',
    substationProperty2Twt: 'Substation property 2',
    substationProperty3Twt: 'Substation property 3',
    ratedVoltage1KV: 'Rated Voltage 1 (kV)',
    ratedVoltage2KV: 'Rated Voltage 2 (kV)',
    ratedVoltage0KVTwt: 'Rated Voltage 0 (kV)',
    ratedVoltage1KVTwt: 'Rated Voltage 1 (kV)',
    ratedVoltage2KVTwt: 'Rated Voltage 2 (kV)',
    ratedVoltage3KVTwt: 'Rated Voltage 3 (kV)',
    nominalVoltage1: 'Nominal Voltage 1',
    nominalVoltage2: 'Nominal Voltage 2',
    nominalVoltage3: 'Nominal Voltage 3',
    nominalVoltage1KV: 'Nominal Voltage 1 (kV)',
    nominalVoltage2KV: 'Nominal Voltage 2 (kV)',
    nominalVoltage1KVTwt: 'Nominal Voltage 1 (kV)',
    nominalVoltage2KVTwt: 'Nominal Voltage 2 (kV)',
    nominalVoltage3KVTwt: 'Nominal Voltage 3 (kV)',
    voltageLevelId1: 'Voltage level ID 1',
    voltageLevelId2: 'Voltage level ID 2',
    voltageLevelId1Twt: 'Voltage level ID 1',
    voltageLevelId2Twt: 'Voltage level ID 2',
    voltageLevelId3Twt: 'Voltage level ID 3',
    terminal1Connected: 'Connected 1',
    terminal2Connected: 'Connected 2',
    terminal1ConnectedTwt: 'Connected 1',
    terminal2ConnectedTwt: 'Connected 2',
    terminal3ConnectedTwt: 'Connected 3',
    voltageLevelProperty: 'Voltage level property',
    voltageLevelProperty1: 'Voltage level property 1',
    voltageLevelProperty2: 'Voltage level property 2',
    voltageLevelProperty1Twt: 'Voltage level property 1',
    voltageLevelProperty2Twt: 'Voltage level property 2',
    voltageLevelProperty3Twt: 'Voltage level property 3',
    'maxQAtNominalV.svar': 'Q max at nominal voltage (MVar)',
    'minQAtNominalV.svar': 'Q min at nominal voltage (MVar)',
    'fixQAtNominalV.svar': 'Fixed part of Q at nominal voltage (MVar)',
    'maxSusceptance.svar': 'Susceptance max (S)',
    'minSusceptance.svar': 'Susceptance min (S)',
    regulationMode: 'Regulation mode',
    'regulationMode.off': 'Off',
    'regulationMode.voltage': 'Voltage regulation',
    'regulationMode.reactivePower': 'Reactive power regulation',
    voltageSetPoint: 'Voltage set point',
    activePowerSetPoint: 'Active power set point (MW)',
    reactivePowerSetPoint: 'Reactive power set point (MVar)',
    remoteRegulatedTerminal: 'Remote regulated terminal',
    regulatingTerminalVLId: 'Voltage Level ID',
    regulatingTerminalConnectableId: 'Equipment ID',
    regulationType: 'Regulation type',
    'regulationType.distant': 'Remote regulation',
    'regulationType.local': 'Local regulation',
    automate: 'Automaton',
    lowVoltageSetPoint: 'Low voltage set point ',
    highVoltageSetPoint: 'High voltage set point',
    lowVoltageThreshold: 'Low voltage threshold',
    highVoltageThreshold: 'High voltage threshold',
    susceptanceFix: 'Fixed part of susceptance ',
    paired: 'Paired',
    converterStationId1: 'Converter station 1 ID',
    converterStationId2: 'Converter station 2 ID',
    convertersMode: 'Converters mode',
    side1RectifierSide2Inverter: 'Flow (Side1->Side2)',
    side1InverterSide2Rectifier: 'Flow (Side2->Side1)',
    dcNominalVoltage: 'DC nominal voltage (kV)',
    converterStationNominalVoltage1: 'Converter station 1 nominal voltage (kV)',
    converterStationNominalVoltage2: 'Converter station 2 nominal voltage (kV)',
    country1: 'Country 1',
    country2: 'Country 2',
    seriesResistance: 'Series resistance (Ω)',
    seriesResistance1: 'Series resistance 1 (Ω)',
    seriesResistance2: 'Series resistance 2 (Ω)',
    seriesResistance3: 'Series resistance 3 (Ω)',
    seriesReactance: 'Series reactance (Ω)',
    seriesReactance1: 'Series reactance 1 (Ω)',
    seriesReactance2: 'Series reactance 2 (Ω)',
    seriesReactance3: 'Series reactance 3 (Ω)',
    shuntConductance: 'Shunt conductance (μS)',
    shuntSusceptance: 'Shunt susceptance (μS)',
    shuntConductance1: 'Shunt conductance 1 (μS)',
    shuntSusceptance1: 'Shunt susceptance 1 (μS)',
    shuntConductance2: 'Shunt conductance 2 (μS)',
    shuntSusceptance2: 'Shunt susceptance 2 (μS)',
};

export default filterExpertEn;
