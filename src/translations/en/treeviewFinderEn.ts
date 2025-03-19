/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const treeviewFinderEn = defineMessages({
    'treeview_finder/close': { defaultMessage: 'Close' },
    'treeview_finder/validate': { defaultMessage: 'Validate' },
    'treeview_finder/add': { defaultMessage: 'Add...' },
    'treeview_finder/deleteSelection': { defaultMessage: 'Delete selection' },
    'treeview_finder/contentText': {
        defaultMessage:
            '{multiSelect, select, true {Please choose one or more element(s).} false {Please choose one element.} other {}}',
    },
    'treeview_finder/finderTitle': {
        defaultMessage:
            '{multiSelect, select, true {Please choose one or more element(s).} false {Please choose one element.} other {}}',
    },
    'treeview_finder/addElementsValidation': {
        defaultMessage:
            '{nbElements, plural, zero {Please select an element} one {Add this element} other {Add # elements}}',
    },
    'treeview_finder/replaceElementsValidation': {
        defaultMessage:
            '{nbElements, plural, zero {Please select an element} one {Replace with this element} other {Replace with # elements}}',
    },
});
