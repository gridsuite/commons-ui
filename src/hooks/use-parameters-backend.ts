/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { UUID } from 'node:crypto';
import { User } from 'oidc-client';

import { useSnackMessage } from './useSnackMessage';
import { useDebounce } from './useDebounce';
import { ComputingType, formatComputingTypeLabel } from '../components/parameters/common/computing-type';
import type { ILimitReductionsByVoltageLevel } from '../components/parameters/common/limitreductions/columns-definitions';
import type {
    ParametersInfos,
    SpecificParametersDescription,
    UseParametersBackendReturnProps,
} from '../utils/types/parameters.type';
import { snackWithFallback } from '../utils/error';

const INITIAL_PROVIDERS = {};

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
    backendFetchProviders: (() => Promise<string[]>) | null,
    backendFetchProvider: ((studyUuid: UUID) => Promise<string>) | null,
    backendFetchDefaultProvider: (() => Promise<string>) | null,
    backendUpdateProvider: ((studyUuid: UUID, newProvider: string) => Promise<any>) | null,
    backendFetchParameters: (studyUuid: UUID) => Promise<ParametersInfos<T>>,
    backendUpdateParameters?: (studyUuid: UUID, newParam: ParametersInfos<T> | null) => Promise<any>,
    backendFetchSpecificParametersDescription?: () => Promise<SpecificParametersDescription>,
    backendFetchDefaultLimitReductions?: () => Promise<ILimitReductionsByVoltageLevel[]>
): UseParametersBackendReturnProps<T> => {
    const { snackError, snackWarning } = useSnackMessage();

    const providersRef = useRef<Record<string, string>>(INITIAL_PROVIDERS);
    const [provider, setProvider] = useState<string>();
    const providerRef = useRef(provider);
    providerRef.current = provider;

    const [params, setParams] = useState<ParametersInfos<T> | null>(null);
    const [specificParamsDescription, setSpecificParamsDescription] = useState<SpecificParametersDescription | null>(
        null
    );
    const [defaultLimitReductions, setDefaultLimitReductions] = useState<ILimitReductionsByVoltageLevel[]>([]);

    const optionalServiceStatusRef = useRef(optionalServiceStatus);
    optionalServiceStatusRef.current = optionalServiceStatus;

    // since provider is updated seperately sometimes we need to update the params with the new provider
    const currentParams = useMemo(() => {
        if (params && 'provider' in params && provider) {
            return { ...params, provider };
        }
        return params;
    }, [params, provider]);

    // PROVIDER UPDATE
    const updateProvider = useCallback(
        (newProvider: string) => {
            if (!studyUuid) {
                return;
            }
            const oldProvider = providerRef.current;
            setProvider(newProvider); // local state
            backendUpdateProvider?.(studyUuid, newProvider).catch((error) => {
                setProvider(oldProvider);
                snackWithFallback(snackError, error, {
                    headerId: `update${formatComputingTypeLabel(type)}ProviderError`,
                });
            });
        },
        [backendUpdateProvider, studyUuid, snackError, type]
    );

    // PROVIDER RESET
    const resetProvider = useCallback(() => {
        backendFetchDefaultProvider?.()
            .then((defaultProvider) => {
                const providerNames = Object.keys(providersRef.current);
                if (providerNames.length > 0) {
                    const newProvider = defaultProvider in providersRef.current ? defaultProvider : providerNames[0];
                    if (newProvider !== providerRef.current) {
                        updateProvider(newProvider);
                    }
                }
            })
            .catch((error) => {
                snackWithFallback(snackError, error, {
                    headerId: `fetchDefault${formatComputingTypeLabel(type)}ProviderError`,
                });
            });
    }, [backendFetchDefaultProvider, updateProvider, snackError, type]);

    // PROVIDER SYNC
    const fetchAvailableProviders = useCallback(() => {
        return backendFetchProviders?.()
            .then((providers) => {
                // we can consider the provider gotten from back will be also used as
                // a key for translation
                const providersObj = providers.reduce<Record<string, string>>((acc, v) => {
                    return {
                        ...acc,
                        [v]: v,
                    };
                }, {});
                providersRef.current = providersObj;
            })
            .catch((error) => {
                snackWithFallback(snackError, error, {
                    headerId: `fetch${formatComputingTypeLabel(type)}ProvidersError`,
                });
            });
    }, [backendFetchProviders, snackError, type]);

    const fetchProvider = useCallback(
        (_studyUuid: UUID) => {
            backendFetchProvider?.(_studyUuid)
                .then((newProvider) => {
                    // if provider is not defined or not among allowed values, it's set to default value
                    if (newProvider in providersRef.current) {
                        setProvider(newProvider);
                    } else {
                        resetProvider();
                    }
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, {
                        headerId: `fetch${formatComputingTypeLabel(type)}ProviderError`,
                    });
                });
        },
        [backendFetchProvider, resetProvider, snackError, type]
    );

    // We need to fetch available providers when optionalServiceStatus changes
    // Then fetch saved provider for this study and set it
    // other dependencies don't change this much
    useEffect(() => {
        if (user !== null && studyUuid && optionalServiceStatus === OptionalServicesStatus.Up) {
            fetchAvailableProviders()?.then(() => fetchProvider(studyUuid));
        }
    }, [fetchAvailableProviders, fetchProvider, optionalServiceStatus, studyUuid, user]);

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
    }, [optionalServiceStatus, studyUuid, fetchSpecificParametersDescription]);

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
    const backendUpdateParametersCb = useCallback(
        (_studyUuid: UUID, newParams: ParametersInfos<T>, oldParams: ParametersInfos<T> | null) => {
            backendUpdateParameters?.(_studyUuid, newParams).catch((error) => {
                // Restore old local params and provider if update didn't work
                setParams(oldParams);
                if (oldParams && 'provider' in oldParams) {
                    setProvider(oldParams.provider);
                } else {
                    setProvider(undefined);
                }
                snackWithFallback(snackError, error, {
                    headerId: `update${formatComputingTypeLabel(type)}ParametersError`,
                });
            });
        },
        [backendUpdateParameters, snackError, type]
    );
    const debouncedBackendUpdateParameters = useDebounce(backendUpdateParametersCb, 1000);

    const updateParameter = useCallback(
        (newParams: ParametersInfos<T>) => {
            if (!studyUuid) {
                return;
            }
            const oldParams: ParametersInfos<T> | null = currentParams ? { ...currentParams } : null;
            // Set local states first to components rendering
            setParams(newParams);
            if (newParams && 'provider' in newParams) {
                setProvider(newParams.provider);
            } else {
                setProvider(undefined);
            }
            // then send request to save it
            debouncedBackendUpdateParameters(studyUuid, newParams, oldParams);
        },
        [debouncedBackendUpdateParameters, currentParams, studyUuid]
    );

    // PARAMETERS RESET
    const resetParameters = useCallback(() => {
        if (!studyUuid || !backendUpdateParameters) {
            return Promise.reject();
        }
        return backendUpdateParameters(studyUuid, null)
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
                    if ('provider' in _params) {
                        setProvider(_params.provider);
                    }
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

    return [
        providersRef.current,
        provider,
        fetchProvider,
        updateProvider,
        resetProvider,
        currentParams,
        fetchParameters,
        updateParameter,
        resetParameters,
        specificParamsDescription,
        defaultLimitReductions,
    ];
};
