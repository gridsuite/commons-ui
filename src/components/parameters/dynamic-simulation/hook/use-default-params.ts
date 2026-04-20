/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useRef } from 'react';

export default function useDefaultParams<T>(params: T | null) {
    const defaultParamsRef = useRef<T | null>(params);

    useEffect(() => {
        if (params) {
            defaultParamsRef.current = params;
        }
    }, [params]);

    const getDefaultParams = useCallback(() => {
        return defaultParamsRef.current;
    }, []);

    const setDefaultParams = useCallback((newParams: T) => {
        defaultParamsRef.current = newParams;
    }, []);
    return {
        getDefaultParams,
        setDefaultParams,
    };
}
