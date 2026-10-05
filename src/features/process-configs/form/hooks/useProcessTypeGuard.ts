/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Option } from '../../../../utils';
import { getProcessConfigFormDefaultValues } from '../../common/process-config-form.constants';
import type { ProcessConfigFormValues } from '../../common/process-config-form.types';
import { deepEqual, withoutProcessType } from '../utils/form.utils';

export function useProcessTypeGuard() {
    const selectedProcessType = useWatch<ProcessConfigFormValues>({ name: 'processType' });
    const { getValues, reset } = useFormContext<ProcessConfigFormValues>();

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
                withoutProcessType(getValues()),
                withoutProcessType(defaultValues as ProcessConfigFormValues)
            );

            if (!hasOtherChanges) {
                setConfirmedProcessType(nextProcessType);
                return true;
            }

            setPendingProcessType(nextProcessType);
            return false;
        },
        [confirmedProcessType, getValues, defaultValues]
    );

    const cancelProcessTypeChange = useCallback(() => {
        setPendingProcessType(null);
    }, []);

    const confirmProcessTypeChange = useCallback(() => {
        if (!pendingProcessType) {
            return;
        }
        reset({
            ...defaultValues,
            processType: pendingProcessType as ProcessConfigFormValues['processType'],
        });
        setConfirmedProcessType(pendingProcessType);
        setPendingProcessType(null);
    }, [pendingProcessType, reset, defaultValues]);

    return {
        selectedProcessType,
        pendingProcessType,
        checkProcessTypeChange,
        confirmProcessTypeChange,
        cancelProcessTypeChange,
    };
}
