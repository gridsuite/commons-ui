/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';

import { UUID } from 'node:crypto';
import { User } from 'oidc-client';

import { useSnackMessage } from './useSnackMessage';
import { ComputingType, formatComputingTypeLabel } from '../components/parameters/common/computing-type';
import type { ILimitReductionsByVoltageLevel } from '../components/parameters/common/limitreductions/columns-definitions';
import type {
    BackendFunctions,
    ParametersInfos,
    SpecificParametersDescription,
    UseParametersBackendReturnProps,
} from '../utils/types/parameters.type';
import { snackWithFallback } from '../utils/error';

export enum OptionalServicesStatus {
    Up = 'UP',
    Down = 'DOWN',
    Pending = 'PENDING',
}

export const useParametersBackend = <T extends ComputingType>(
    user: User | null,
    studyUuid: UUID | null,
    type: T,
    optionalServiceStatus: OptionalServicesStatus | undefined,
    backendFunctions: BackendFunctions<T>
): UseParametersBackendReturnProps<T> => {
    const { snackError, snackWarning } = useSnackMessage();
    const {
        backendFetchProviders,
        backendFetchParameters,
        backendUpdateParameters,
        backendFetchSpecificParametersDescription,
        backendFetchDefaultLimitReductions,
    } = backendFunctions;

    const [providers, setProviders] = useState<Record<string, string>>({});
    const [params, setParams] = useState<ParametersInfos<T> | null>(null);
    const [specificParamsDescription, setSpecificParamsDescription] = useState<SpecificParametersDescription | null>(
        null
    );
    const [defaultLimitReductions, setDefaultLimitReductions] = useState<ILimitReductionsByVoltageLevel[]>([]);

    // PROVIDER SYNC
    const fetchAvailableProviders = useCallback(() => {
        return backendFetchProviders?.()
            .then((response) => {
                // we can consider the provider gotten from back will be also used as
                // a key for translation
                const providersObj = response.reduce<Record<string, string>>((acc, v) => {
                    return {
                        ...acc,
                        [v]: v,
                    };
                }, {});
                setProviders(providersObj);
            })
            .catch((error) => {
                snackWithFallback(snackError, error, {
                    headerId: `fetch${formatComputingTypeLabel(type)}ProvidersError`,
                });
            });
    }, [backendFetchProviders, snackError, type]);

    // We need to fetch available providers when optionalServiceStatus changes
    // other dependencies don't change this much
    useEffect(() => {
        if (user !== null && optionalServiceStatus === OptionalServicesStatus.Up) {
            fetchAvailableProviders();
        }
    }, [fetchAvailableProviders, optionalServiceStatus, user]);

    // SPECIFIC PARAMETERS DESCRIPTION
    const fetchSpecificParametersDescription = useCallback(() => {
        backendFetchSpecificParametersDescription?.()
            .then((specificParams) => {
                setSpecificParamsDescription(specificParams);
            })
            .catch((error) => {
                snackWithFallback(snackError, error, {
                    headerId: `fetch${formatComputingTypeLabel(type)}SpecificParametersError`,
                });
            });
    }, [backendFetchSpecificParametersDescription, snackError, type]);

    // We need to fetch specific parameters description when optionalServiceStatus changes
    // other dependencies don't change this much
    useEffect(() => {
        if (optionalServiceStatus === OptionalServicesStatus.Up) {
            fetchSpecificParametersDescription();
        }
    }, [optionalServiceStatus, fetchSpecificParametersDescription]);

    // Default limit reductions
    const fetchDefaultLimitReductions = useCallback(() => {
        backendFetchDefaultLimitReductions?.()
            .then((defaultLimits: ILimitReductionsByVoltageLevel[]) => {
                setDefaultLimitReductions(defaultLimits);
            })
            .catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'fetchDefaultLimitReductionsError' });
            });
    }, [backendFetchDefaultLimitReductions, snackError]);

    // We just need to fetch default limit reductions once
    useEffect(() => {
        if (optionalServiceStatus === OptionalServicesStatus.Up) {
            fetchDefaultLimitReductions();
        }
    }, [optionalServiceStatus, fetchDefaultLimitReductions]);

    // PARAMETERS UPDATE
    const updateParameters = useCallback(
        (newParams: ParametersInfos<T>) => {
            if (!studyUuid) {
                return;
            }
            const oldParams: ParametersInfos<T> | null = params ? { ...params } : null;
            // Set local states first to components rendering
            setParams(newParams);
            // then send request to save it
            backendUpdateParameters?.(studyUuid, newParams).catch((error) => {
                // Restore old local params if update didn't work
                setParams(oldParams);
                snackWithFallback(snackError, error, {
                    headerId: `update${formatComputingTypeLabel(type)}ParametersError`,
                });
            });
        },
        [backendUpdateParameters, params, snackError, studyUuid, type]
    );

    // PARAMETERS RESET
    const resetParameters = useCallback(() => {
        if (!studyUuid || !backendUpdateParameters) {
            return;
        }
        backendUpdateParameters(studyUuid, null)
            .then((response) => {
                if (response.status === 204) {
                    snackWarning({
                        headerId: `reset${formatComputingTypeLabel(type)}ParametersWarning`,
                    });
                }
                // Parameters will be updated after an ComputationParametersUpdated notification
                // No need to set local params or provider states here
                // because a reset call with a button don't need an intermediate render like for forms
            })
            .catch((error) => {
                snackWithFallback(snackError, error, {
                    headerId: `update${formatComputingTypeLabel(type)}ParametersError`,
                });
            });
    }, [studyUuid, type, backendUpdateParameters, snackError, snackWarning]);

    // PARAMETERS SYNC
    const fetchParameters = useCallback(
        (_studyUuid: UUID) => {
            backendFetchParameters(_studyUuid)
                .then((_params) => {
                    setParams(_params);
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, {
                        headerId: `fetch${formatComputingTypeLabel(type)}ParametersError`,
                    });
                });
        },
        [backendFetchParameters, type, snackError]
    );

    // We need to fetch parameters when optionalServiceStatus changes
    // other dependencies don't change this much
    useEffect(() => {
        if (studyUuid && optionalServiceStatus === OptionalServicesStatus.Up) {
            fetchParameters(studyUuid);
        }
    }, [optionalServiceStatus, studyUuid, fetchParameters]);

    return {
        providers,
        params,
        fetchParameters,
        updateParameters,
        resetParameters,
        specificParamsDescription,
        defaultLimitReductions,
    };
};
