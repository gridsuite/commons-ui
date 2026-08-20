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
    TARGET_DEADBAND_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    VALUE_MUST_BE_NUMERIC_WHEN_PERCENTAGE_ERROR,
    VALUE_MUST_BE_REF_WHEN_PERCENTAGE_ERROR,
    WRONG_REF_OR_VALUE_ERROR,
} from '../../utils';

export const networkModificationValidationEn = {
    BusBarCountMustBeGreaterThanOrEqualToOne: 'Number of busbars must be greater than or equal to 1',
    SectionCountMustBeGreaterThanOrEqualToOne: 'Number of sections must be greater than or equal to 1',
    SectionCountMustBeLessThanOrEqualToTwenty: 'Number of sections must be less than or equal to 20',
    CreateCouplingDeviceIdenticalBusBar: 'Bus bar section / bus 1 and 2 must be different',
    [CREATE_SUBSTATION_IN_VOLTAGE_LEVEL_IDENTICAL_ID]: 'Voltage Level ID can not match Substation ID',
    voltageLevelNominalVoltageMaxValueError: 'Low voltage limit must be inferior to high voltage limit',
    [SHORT_CIRCUIT_CURRENT_LIMIT_MUST_BE_GREATER_OR_EQUAL_TO_ZERO]:
        'Short-circuit current limit must be greater than or equal to 0',
    ShortCircuitCurrentLimitMinMaxError: 'Low short-circuit current limit must be less than or equal to high limit',
    [SHUNT_COMPENSATOR_ERROR_Q_AT_NOMINAL_VOLTAGE_LESS_THAN_ZERO]:
        'Q at nominal voltage value should be greater than or equal to 0',
    [MAXIMUM_SECTION_COUNT_MUST_BE_GREATER_OR_EQUAL_TO_ONE]: 'Maximum section count must be greater than or equal to 1',
    [SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT]:
        'Section count must be between 0 and Maximum section count',
    [MIN_ACTIVE_POWER_MUST_BE_LESS_OR_EQUAL_TO_MAX_ACTIVE_POWER]:
        'Minimum active power value must be less than or equal to maximum active power value',
    [ACTIVE_LIMITS_MIN_MAX_INVALID]: 'Maximum active power must be greater than minimum active power',
    [REACTIVE_LIMITS_MIN_MAX_INVALID]: 'Maximum reactive power must be greater than minimum reactive power',
    [WRONG_REF_OR_VALUE_ERROR]:
        'Please enter a valid numeric value or a valid field reference. Use # to select a field',
    [VALUE_MUST_BE_NUMERIC_WHEN_PERCENTAGE_ERROR]: 'When using %, this field must be a valid positive numeric value',
    [VALUE_MUST_BE_REF_WHEN_PERCENTAGE_ERROR]: 'When using %, this field must be a valid field reference',
    [TARGET_DEADBAND_MUST_BE_GREATER_OR_EQUAL_TO_ZERO]: 'Deadband value must be greater than or equal to 0',
    TemporaryLimitNameUnicityError: 'Temporary limit names must be unique in the table',
    TemporaryLimitDurationUnicityError: 'Temporary limit acceptable durations must be unique in the table',
    LimitSetApplicabilityError: '2 limit sets with the same name must have different application sides.',
    permanentCurrentLimitMustBeGreaterThanZero: 'The permanent current limit value must be greater than 0',
};
