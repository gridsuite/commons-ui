/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import type { UUID } from 'node:crypto';
import type * as yup from 'yup';
import { snackWithFallback } from '../../../../utils';
import { useSnackMessage } from '../../../../hooks';
import { getProcessConfigFormData } from '../../common/process-config-mapping';
import { getProcessConfigFormDefaultValues } from '../../common/process-config-form.constants';
import { getProcessConfigFormSchema } from '../../common/process-config-form.schema';
import type {
    FetchPersistedProcessConfigHandler,
    ProcessConfigFormValues,
    ProcessConfigMode,
} from '../../common/process-config-form.types';

type UseProcessConfigFormParams = {
    mode: ProcessConfigMode;
    processConfigUuid?: UUID;
    processConfigName?: string;
    description?: string | null;
    fetchProcessConfig?: FetchPersistedProcessConfigHandler;
};

export type UseProcessConfigFormReturn = {
    formMethods: UseFormReturn<ProcessConfigFormValues>;
    formSchema: yup.ObjectSchema<ProcessConfigFormValues>;
    defaultValues: ProcessConfigFormValues;
    isLoading: boolean;
};

export function useProcessConfigForm({
    mode,
    processConfigUuid,
    processConfigName,
    description,
    fetchProcessConfig,
}: UseProcessConfigFormParams): UseProcessConfigFormReturn {
    const defaultValues = useMemo(() => getProcessConfigFormDefaultValues(mode), [mode]);

    const formSchema = useMemo(
        () => getProcessConfigFormSchema(mode) as unknown as yup.ObjectSchema<ProcessConfigFormValues>,
        [mode]
    );

    const formMethods = useForm<ProcessConfigFormValues>({
        defaultValues,
        resolver: yupResolver(formSchema),
    });

    const { reset } = formMethods;
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    useEffect(() => {
        if (mode !== 'edit' || !processConfigUuid || !fetchProcessConfig) {
            return undefined;
        }

        let cancelled = false;
        setIsLoading(true);

        (async () => {
            try {
                const persistedProcessConfig = await fetchProcessConfig(processConfigUuid);
                if (!cancelled && persistedProcessConfig) {
                    const formData = await getProcessConfigFormData(
                        persistedProcessConfig,
                        processConfigName ?? '',
                        description ?? null
                    );
                    if (!cancelled) {
                        reset(formData);
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    snackWithFallback(snackError, error, {
                        headerId: 'processConfig/fetchProcessConfigError',
                    });
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [mode, processConfigUuid, processConfigName, description, fetchProcessConfig, reset, snackError]);

    return { formMethods, formSchema, defaultValues, isLoading };
}
