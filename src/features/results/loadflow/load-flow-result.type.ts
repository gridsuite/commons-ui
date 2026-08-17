/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Key } from 'react';
import { ColDef } from 'ag-grid-community';
import { GsLangUser } from '../../../utils';

export interface LimitViolationResultProps {
    result: OverloadedEquipment[] | undefined;
    columnDefs: ColDef<any>[];
    isLoadingResult: boolean;
    tableName: string;
    computationStatus: string;
    computationSubType: string;
    exportCsvResetKey: Key;
    language: GsLangUser;
    onGridReady?: (params: any) => void;
}

export interface OverloadedEquipment {
    overload: number;
    patlOverload: number;
    subjectId: string;
    locationId: string;
    value: number;
    actualOverloadDuration: number | null;
    upComingOverloadDuration: number | null;
    limit: number;
    patlLimit: number;
    limitName: string | null | undefined;
    nextLimitName: string | null | undefined;
    side: string | undefined;
    limitType: string;
}
