/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { DESCRIPTION, NAME } from '../../reactHookForm';
import type { MuiStyles } from '../../../../utils';

export const elementEditionStyles = {
    textField: {
        minWidth: '250px',
        width: '33%',
    },
    description: {
        minWidth: '250px',
        width: '50%',
    },
} as const satisfies MuiStyles;

export function getNameElementEditorSchema(initialElementName: string | null) {
    return yup.object().shape({
        [NAME]: yup
            .string()
            .nullable()
            .when('nameRequiredWhenInitialNameIsSet', {
                is: () => initialElementName !== null,
                then: () => yup.string().required(),
                otherwise: () => yup.string(),
            }),
        [DESCRIPTION]: yup.string().nullable(),
    });
}

export function getNameElementEditorEmptyFormData(
    initialElementName: string | null,
    initialElementDescription: string | null
) {
    return {
        [NAME]: initialElementName,
        [DESCRIPTION]: initialElementDescription,
    };
}
