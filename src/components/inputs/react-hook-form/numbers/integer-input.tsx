/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import TextInput, { TextInputProps } from '../text-input';
import { isIntegerNumber } from './utils';

function IntegerInput(props: TextInputProps) {
    const inputTransform = (value: string | number | null) => {
        if (value === '-') {
            return value;
        }
        return value === null || (typeof value === 'number' && Number.isNaN(value)) ? '' : value.toString();
    };

    const outputTransform = (value: string) => {
        if (value === '-') {
            return value;
        }
        if (value === '0') {
            return 0;
        }
        return parseInt(value, 10) || null;
    };

    return (
        <TextInput
            acceptValue={isIntegerNumber}
            outputTransform={outputTransform}
            inputTransform={inputTransform}
            {...props}
        />
    );
}

export default IntegerInput;
