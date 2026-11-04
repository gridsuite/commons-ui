/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';

import type { UUID } from 'node:crypto';
import {
    DescriptionField,
    DIRECTORY_ITEM,
    DIRECTORY_ITEM_ID,
    DirectoryItemInput,
    DirectoryItemSchema,
    EXPORT_COMPRESSION,
    EXPORT_DESTINATION,
    EXPORT_FORMAT,
    EXPORT_PARAMETERS,
    FILE_NAME,
    Parameter,
    SelectInput,
    UniqueNameInput,
} from '../../components';
import { ElementType } from '../../utils';
import { FlatParametersInput } from './FlatParametersInput';
import { CompressionType, ExportDestinationType } from './exportNetwork.utils';
import { ExportFormatProperties } from './exportNetwork.types';

export interface ExportNetworkFormProps {
    formatsWithParameters: Record<string, ExportFormatProperties>;
    parameters: Parameter[];
    availableCompressions: CompressionType[];
    displayFormat?: boolean;
}

export function ExportNetworkForm({
    formatsWithParameters,
    parameters,
    availableCompressions,
    displayFormat = true,
}: Readonly<ExportNetworkFormProps>) {
    const intl = useIntl();

    const exportDestination = useWatch({ name: EXPORT_DESTINATION });
    const folderItem = useWatch({ name: DIRECTORY_ITEM }) as DirectoryItemSchema;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
            <UniqueNameInput
                name={FILE_NAME}
                label="download.fileName"
                elementType={ElementType.CASE}
                activeDirectory={
                    exportDestination === ExportDestinationType.GRID_EXPLORE
                        ? (folderItem?.[DIRECTORY_ITEM_ID] as UUID)
                        : undefined
                }
                formProps={{
                    size: 'small',
                }}
            />
            <SelectInput
                name={EXPORT_DESTINATION}
                options={Object.values(ExportDestinationType).map((item) => {
                    return { id: item, label: item };
                })}
                size="small"
                label="destination"
            />
            {exportDestination === ExportDestinationType.GRID_EXPLORE && (
                <Box>
                    <DescriptionField />
                    <DirectoryItemInput
                        name={DIRECTORY_ITEM}
                        types={[ElementType.DIRECTORY]}
                        multiSelect={false}
                        onlyLeaves={false}
                        title={intl.formatMessage({
                            id: 'showSelectDirectoryDialog',
                        })}
                    />
                </Box>
            )}
            {displayFormat && (
                <>
                    <SelectInput
                        sx={{ marginTop: 1 }}
                        name={EXPORT_FORMAT}
                        label="exportFormat"
                        options={Object.keys(formatsWithParameters)}
                        size="small"
                        disableClearable
                    />
                    <SelectInput
                        sx={{ marginTop: 1 }}
                        name={EXPORT_COMPRESSION}
                        label="exportCompression"
                        options={availableCompressions}
                        size="small"
                        disableClearable
                    />
                    <FlatParametersInput name={EXPORT_PARAMETERS} parameters={parameters} />
                </>
            )}
        </Box>
    );
}
