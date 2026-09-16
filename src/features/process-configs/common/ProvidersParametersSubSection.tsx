/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Control, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { FormSubSection } from './FormSubSection';
import type { ProcessConfigFormValues } from './process-config-form.types';
import { ParameterLineDirectoryItemsInput } from '../../parameters';
import { getProcessConfigTypeDefinition } from './process-config-type.definitions';

const commonDirectoryItemsInputProps = {
    allowMultiSelect: false,
    hideErrorMessage: false,
    labelGridSize: 4,
    inputGridSize: 8,
    showPlaceHolder: true,
};

export function ProvidersParametersSubSection({ control }: Readonly<{ control: Control<ProcessConfigFormValues> }>) {
    const selectedProcessType = useWatch({ control, name: 'processType' });

    const definition = getProcessConfigTypeDefinition(selectedProcessType);

    return (
        <FormSubSection
            id="network-parameters-heading"
            title={<FormattedMessage id="process_config/providersParameters" />}
        >
            {definition?.parameters.map(({ field, elementType, label }) => (
                <ParameterLineDirectoryItemsInput
                    key={field}
                    label={label}
                    elementType={elementType}
                    name={field}
                    {...commonDirectoryItemsInputProps}
                />
            ))}
        </FormSubSection>
    );
}
