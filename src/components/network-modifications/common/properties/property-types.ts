/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants } from '../../../../utils';

export type Property = {
    [FieldConstants.NAME]: string;
    [FieldConstants.VALUE]?: string | null;
    [FieldConstants.PREVIOUS_VALUE]?: string | null;
    [FieldConstants.DELETION_MARK]: boolean;
    [FieldConstants.ADDED]: boolean;
};

export type Properties = {
    [FieldConstants.ADDITIONAL_PROPERTIES]?: Property[];
};
