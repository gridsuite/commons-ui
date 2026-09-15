/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Control } from 'react-hook-form';
import { FormSection } from './FormSection';
import { ModificationsSubSection } from './ModificationsSubSection';
import { ProvidersParametersSubSection } from './ProvidersParametersSubSection';
import type { ProcessConfigFormValues } from './process-config-form.types';

type SpecificInformationSectionProps = {
    control: Control<ProcessConfigFormValues>;
    onPrefill?: () => void;
};

export function SpecificInformationSection({ control, onPrefill }: Readonly<SpecificInformationSectionProps>) {
    return (
        <FormSection
            id="specific-information-heading"
            title={
                <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" width="100%">
                    <FormattedMessage id="processConfigSpecificInformation" />
                    {onPrefill && (
                        <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={onPrefill}>
                            <FormattedMessage id="processConfigPrefill" />
                        </Button>
                    )}
                </Stack>
            }
        >
            <ModificationsSubSection />
            <ProvidersParametersSubSection control={control} />
        </FormSection>
    );
}
