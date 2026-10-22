/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
import {
    CGMES_FORMAT,
    CompressionType,
    defaultGzipFormats,
    emptyObj,
    ExportDestinationType,
    getDefaultValuesForExtensionsParameter,
    onlyZipCompression,
    XIIDM_FORMAT,
} from './exportNetwork.utils';
import { ExportFormatProperties } from './exportNetwork.types';
import { getAvailableExportFormats } from '../../services';

const compressions = [CompressionType.ZIP, CompressionType.GZIP];

export interface ExportNetworkFormProps {
    open: boolean;
    isDeveloperMode: boolean;
    displayFormat?: boolean;
}

export function ExportNetworkForm({ open, isDeveloperMode, displayFormat = true }: Readonly<ExportNetworkFormProps>) {
    const intl = useIntl();
    const [formatsWithParameters, setFormatsWithParameters] = useState<Record<string, ExportFormatProperties>>({});
    const [parameters, setParameters] = useState<Parameter[]>();
    const [availableCompressions, setAvailableCompressions] = useState<CompressionType[]>(compressions);
    const { setValue, getValues, subscribe } = useFormContext();

    const exportDestination = useWatch({ name: EXPORT_DESTINATION });
    const folderItem = useWatch({ name: DIRECTORY_ITEM }) as DirectoryItemSchema;

    useEffect(() => {
        const unsubscribe = subscribe({
            name: [`${EXPORT_FORMAT}`],
            formState: {
                values: true, // Subscribe to field value changes
            },
            callback: () => {
                // When an export format changes, reset export parameters
                setValue(EXPORT_PARAMETERS, emptyObj);
                const exportFormat = getValues(EXPORT_FORMAT);
                // get corresponding parameters of the selected format
                setParameters(formatsWithParameters[exportFormat]?.parameters);
                // update compression
                setAvailableCompressions(exportFormat === CGMES_FORMAT ? onlyZipCompression : compressions);
                if (defaultGzipFormats.includes(exportFormat)) {
                    setValue(EXPORT_COMPRESSION, CompressionType.GZIP);
                } else {
                    setValue(EXPORT_COMPRESSION, CompressionType.ZIP);
                }
            },
        });
        return () => unsubscribe();
    }, [setValue, subscribe, getValues, formatsWithParameters]);

    useEffect(() => {
        if (open) {
            getAvailableExportFormats().then((formats) => {
                const availableFormats = isDeveloperMode
                    ? formats
                    : Object.fromEntries(Object.entries(formats).filter(([key]) => key === XIIDM_FORMAT));

                const formatsWithDefaultParameters = Object.fromEntries(
                    Object.entries(availableFormats).map(([key, format]) => [
                        key,
                        {
                            ...format,
                            parameters: getDefaultValuesForExtensionsParameter(format.parameters),
                        },
                    ])
                );
                setFormatsWithParameters(formatsWithDefaultParameters);
            });
        }
    }, [open, isDeveloperMode]);

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
