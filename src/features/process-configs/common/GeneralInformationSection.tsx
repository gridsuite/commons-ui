/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Typography } from '@mui/material';
import { UUID } from 'node:crypto';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormSection } from './FormSection';
import { DescriptionField, DirectoryItemInput, UniqueNameInput } from '../../../components';
import { ElementType, FieldConstants } from '../../../utils';

type GeneralInformationSectionProps = {
    activeDirectory?: UUID;
    initialElementName?: string;
    withFolderField?: boolean;
};

export function GeneralInformationSection({
    activeDirectory,
    initialElementName,
    withFolderField = false,
}: Readonly<GeneralInformationSectionProps>) {
    const intl = useIntl();

    return (
        <FormSection id="general-information-heading" title={<FormattedMessage id="processConfigGeneralInformation" />}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12 }}>
                    <UniqueNameInput
                        name={FieldConstants.NAME}
                        label="nameProperty"
                        elementType={ElementType.PROCESS_CONFIG}
                        currentName={initialElementName}
                        activeDirectory={activeDirectory}
                        autoFocus
                        formProps={{ size: 'small' }}
                    />
                    <DescriptionField
                        buttonLabel="AddDescription"
                        expandingTextSx={{ marginTop: 1 }}
                        buttonSx={{ textTransform: 'none' }}
                    />
                </Grid>

                {withFolderField && (
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Typography variant="subtitle1">
                            <FormattedMessage id="processConfigSaveDirectory" />
                        </Typography>
                        <DirectoryItemInput
                            name={FieldConstants.DIRECTORY}
                            types={[ElementType.DIRECTORY]}
                            multiSelect={false}
                            onlyLeaves={false}
                            validationButtonText={intl.formatMessage({ id: 'validate' })}
                            title={intl.formatMessage({ id: 'processConfigSaveDirectory' })}
                        />
                    </Grid>
                )}
            </Grid>
        </FormSection>
    );
}
