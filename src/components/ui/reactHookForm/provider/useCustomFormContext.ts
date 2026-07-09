/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFormContext } from 'react-hook-form';
import { useContext } from 'react';
import { CustomFormContext, type MergedFormContextProps } from './CustomFormProvider';

// TODO found how to manage generic type
export const useCustomFormContext = (): MergedFormContextProps => {
    const formMethods = useFormContext();
    const customFormMethods = useContext(CustomFormContext);

    return { ...formMethods, ...customFormMethods };
};
