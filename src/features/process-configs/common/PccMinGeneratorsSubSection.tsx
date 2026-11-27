/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { FormSubSection } from './FormSubSection';
import { ParameterLineDirectoryItemsInput } from '../../parameters';
import { getProcessConfigTypeDefinition } from './process-config-type.definitions';
import { ProcessConfigFormValues } from './process-config-form.types';
import { FieldConstants } from '../../../utils';

const commonDirectoryItemsInputProps = {
    allowMultiSelect: true,
    hideErrorMessage: false,
    labelGridSize: 4,
    inputGridSize: 8,
    showPlaceHolder: true,
};

export function PccMinGeneratorsSubSection() {
    const selectedProcessType = useWatch<ProcessConfigFormValues>({ name: FieldConstants.PROCESS_TYPE });

    const definition = getProcessConfigTypeDefinition(selectedProcessType);
    const watchedGenerators = definition?.watchedGenerators;

    return (
        watchedGenerators && (
            <FormSubSection
                id="watched-generators-heading"
                title={<FormattedMessage id="process_config/pccMinWatchedElements" />}
            >
                <ParameterLineDirectoryItemsInput
                    key={watchedGenerators.field}
                    label={watchedGenerators.label}
                    elementType={watchedGenerators.elementType}
                    name={watchedGenerators.field}
                    {...commonDirectoryItemsInputProps}
                />
            </FormSubSection>
        )
    );
}
