/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import TextInput, { TextInputProps } from '../text-input';
import { isFloatNumber } from './utils';

export type FloatInputProps = Omit<
    TextInputProps,
    'outputTransform' | 'inputTransform' | 'acceptValue' // already defined in FloatInput
>;

type Input = string | number;

// toLocaleString never uses exponential notation unlike toString.  Avoiding
// exponential notation makes in place normalizing of numbers after each
// keystroke less intrusive: we can almost always normalize to a number that
// uses the same string representation as the intermediate text that the user
// typed. For example, if the user wants to input "625", they will write "6"
// and then "62" and then "625". The intermediate strings are numbers that have
// nothing in common with the final number but their normalization is the
// same as what was typed by the user. With exponential notation, if the user
// wants to input "12.5e21", at the intermediate step of "12.5e2" their input
// is normalized to "1.25e3" and after adding the final "1" they get "12.5e31"
// instead of "12.5e21".
// Note: with 16+ digits, two small problems in the current implementation appear:
//   - rounding due to precision causes the cursor to jump at the end.
//   - rounding due to precision causes the last digits of the number to jiggle.
// These two problems should be fixable with manual rounding and cursor
// handling if we need it.
const normalizeFixed = (number: number) => {
    return number.toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
    });
};

const FloatInput = (props: FloatInputProps) => {
    const inputTransform = (value: Input) => {
        if (typeof value == 'number' && !isNaN(value)) {
            // if we have a parsed real number, normalize like we do after each
            // keystroke in outputTransform for consistency. We get parsed
            // numbers when the data doesn't come from a user edit in the form,
            // but from data persisted as a float.
            return normalizeFixed(value);
        } else {
            // The user is editing, leave as is because we already did what we
            // need to do in outputTransform after the previous keystroke.
            // NOTE: To avoid "bad things" we haven't predicted and be extra
            // cautious, we clear the text on NaN, so we need to special case
            // known inputs that would be rejected by isNaN but are accepted by
            // our acceptValue because they are needed as intermediate strings
            // for the user to input useful numbers.
            // TODO can we remove the isNaN check and the special cases check?
            if (['-', '.'].includes(value as string)) {
                return value as string;
            }
            return value === null || isNaN(value as number)
                ? ''
                : value.toString();
        }
    };

    const outputTransform = (value: string): Input | null => {
        if (value === '-') {
            return value;
        }
        if (value === '') {
            return null;
        }

        const tmp = value?.replace(',', '.') || '';

        // Can't show the normalization to the user when the fractional part
        // ends with 0 because normalizing removes the trailing zeroes and prevents
        // inputting the required intermediate strings (e.g "1." or "1.0" to input "1.02")
        // So we return the user string instead. This has the downside that
        // when the user finally writes a non 0 digit at the end, the normalization takes place
        // and may startle the user when changing a lot of its input text.
        // For example:
        //   - "1.00000000000000000000000000" and then press any non zero digit
        //      removes all the zeroes at once
        //   - "1." or "1.0" and then left arrow to move the cursor to the left and then inputting many digits
        //      disables all normalization, can write huge numbers that are not rounded like
        //      -    1231231231241231241231245123124234234123123124234.
        //        vs 1231231231241231300000000000000000000000000000000
        //      -    1.4312322342321323434534234235234
        //        vs 1.4312322342321324
        // Note: this is a symmetric problem inputting many zeros
        // to the left of a number to allow to input a final leading nonzero
        // digit, but users never want to do that, unlike inputting trailing zeroes in the
        // fractional part before inputing the final trailing non zero digit
        if (tmp.endsWith('.') || (tmp.includes('.') && tmp.endsWith('0'))) {
            return tmp;
        }

        // normalize after each user keystroke, needs to be very unintrusive
        // otherwise users are surprised when typing doesn't do what they want
        // NOTE: the parse should always succeed and produce non-NaN because we
        // restrict what the user can type with "acceptValue" but if we
        // have a bug just clear the data instead of sending "NaN"
        const parsed = parseFloat(tmp);
        return isNaN(parsed) ? null : normalizeFixed(parsed);
    };

    return (
        <TextInput
            acceptValue={isFloatNumber}
            outputTransform={outputTransform}
            inputTransform={inputTransform}
            {...props}
        />
    );
};

export default FloatInput;
