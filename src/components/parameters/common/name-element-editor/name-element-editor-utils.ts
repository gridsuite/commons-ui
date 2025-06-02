/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../utils/yupConfig';
import { DESCRIPTION_INPUT, NAME } from '../../../inputs';

export function getNameElementEditorEmptyFormData(
    initialElementName: string | null,
    initialElementdescripton: string | null
) {
    return {
        [NAME]: initialElementName,
        [DESCRIPTION_INPUT]: initialElementdescripton,
    };
}

export function getNameElementEditorSchema(initialElementName: string | null) {
    return yup.object().shape({
        [NAME]: yup.string().when('nameRequiredWhenInitialNameIsSet', {
            is: () => initialElementName !== null,
            then: () => yup.string().required(),
            otherwise: () => yup.string(),
        }),
        [DESCRIPTION_INPUT]: yup.string(),
    });
}
