/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { NetworkModificationData } from '../../../services';

export const removeNullFields = (data: NetworkModificationData) => {
    let dataTemp = data;
    if (dataTemp) {
        Object.keys(dataTemp).forEach((key) => {
            if (dataTemp[key] && dataTemp[key] !== null && typeof dataTemp[key] === 'object') {
                dataTemp[key] = removeNullFields(dataTemp[key]);
            }

            if (dataTemp[key] === null) {
                delete dataTemp[key];
            }
        });
    }
    return dataTemp;
};
