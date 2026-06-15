/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { CustomFormProvider } from '../../../components/ui';
import { ParameterLayout } from '../common';
import { UseShortCircuitParametersFormReturn } from './use-short-circuit-parameters-form';
import ShortCircuitParametersContent from './short-circuit-parameters-content';

interface ShortCircuitParametersFormProps {
    shortCircuitMethods: UseShortCircuitParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
}

export function ShortCircuitParametersForm({
    shortCircuitMethods,
    renderTitleFields,
    renderActions,
}: Readonly<ShortCircuitParametersFormProps>) {
    const { formMethods, formSchema, paramsLoaded } = shortCircuitMethods;
    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <ParameterLayout header={renderTitleFields?.()} footer={renderActions?.()} isLoading={!paramsLoaded}>
                <ShortCircuitParametersContent shortCircuitMethods={shortCircuitMethods} />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
