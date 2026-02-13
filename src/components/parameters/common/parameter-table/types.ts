/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export interface IParameters {
    columnsDef: IColumnsDef[];
    name: string;
}

export interface IColumnsDef {
    label: string;
    dataKey: string;
    initialValue: boolean | string | string[] | number | null;
    editable?: boolean;
    directoryItems?: boolean;
    menuItems?: boolean;
    equipmentTypes?: any[];
    elementType?: string;
    titleId?: string;
    checkboxItems?: boolean;
    floatItems?: boolean;
    textItems?: boolean;
    descriptionItems?: boolean;
    width?: string;
}
