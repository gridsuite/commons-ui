/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type Sort = {
    empty?: boolean;
    sorted?: boolean;
    unsorted?: boolean;
};

export type Pageable = {
    offset?: number;
    pageNumber?: number;
    pageSize?: number;
    paged?: boolean;
    sort?: Sort;
    unpaged?: boolean;
};

export interface Page<ResultType> {
    content?: ResultType[];
    pageable?: Pageable;
    last?: boolean;
    totalPages?: number;
    totalElements?: number;
    first?: boolean;
    size?: number;
    number?: number;
    sort?: Sort;
    numberOfElements?: number;
    empty?: boolean;
}
