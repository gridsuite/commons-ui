/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { Option } from '../../../../utils';
import { getProcessConfigFormDefaultValues } from '../../common/process-config-form.constants';
import type { ProcessConfigFormValues } from '../../common/process-config-form.types';
import { deepEqual, withoutProcessType } from '../utils/form.utils';

export function useProcessTypeGuard(form: UseFormReturn<ProcessConfigFormValues>) {
    const { control } = form;

    const selectedProcessType = useWatch({ control, name: 'processType' });

    const defaultValues = getProcessConfigFormDefaultValues('create');

    const [confirmedProcessType, setConfirmedProcessType] = useState('');
    const [pendingProcessType, setPendingProcessType] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedProcessType) {
            setConfirmedProcessType('');
            setPendingProcessType(null);
        }
    }, [selectedProcessType]);

    const checkProcessTypeChange = useCallback(
        (nextValue: Option | null) => {
            const nextProcessType = typeof nextValue === 'string' ? nextValue : (nextValue?.id ?? '');

            if (!nextProcessType) {
                return true;
            }
            if (!confirmedProcessType) {
                setConfirmedProcessType(nextProcessType);
                return true;
            }
            if (nextProcessType === confirmedProcessType) {
                return true;
            }

            const hasOtherChanges = !deepEqual(
                withoutProcessType(form.getValues()),
                withoutProcessType(defaultValues as ProcessConfigFormValues)
            );

            if (!hasOtherChanges) {
                return true;
            }

            setPendingProcessType(nextProcessType);
            return false;
        },
        [form, confirmedProcessType, defaultValues]
    );

    const cancelProcessTypeChange = useCallback(() => {
        setPendingProcessType(null);
    }, []);

    const confirmProcessTypeChange = useCallback(() => {
        if (!pendingProcessType) {
            return;
        }
        form.reset({
            ...defaultValues,
            processType: pendingProcessType as ProcessConfigFormValues['processType'],
        });
        setConfirmedProcessType(pendingProcessType);
        setPendingProcessType(null);
    }, [form, defaultValues, pendingProcessType]);

    return {
        selectedProcessType,
        pendingProcessType,
        checkProcessTypeChange,
        confirmProcessTypeChange,
        cancelProcessTypeChange,
    };
}
