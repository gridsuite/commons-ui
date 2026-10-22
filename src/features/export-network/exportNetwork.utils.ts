/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { MAX_CHAR_DESCRIPTION } from '../../utils';
import {
    DESCRIPTION,
    DIRECTORY_ITEM,
    DIRECTORY_ITEM_ID,
    directoryItemSchema,
    EXPORT_COMPRESSION,
    EXPORT_DESTINATION,
    EXPORT_FORMAT,
    EXPORT_PARAMETERS,
    FILE_NAME,
    Parameter,
} from '../../components';
import { NetworkExportInfos } from './exportNetwork.types';

export enum ExportDestinationType {
    GRID_EXPLORE = 'gridExplore',
    MY_COMPUTER = 'myComputer',
}

export enum CompressionType {
    ZIP = 'zip',
    GZIP = 'gzip',
}

export const onlyZipCompression = [CompressionType.ZIP];
export const CGMES_FORMAT = 'CGMES';
export const XIIDM_FORMAT = 'XIIDM';
export const BIIDM_FORMAT = 'BIIDM';
export const JIIDM_FORMAT = 'JIIDM';
export const defaultGzipFormats = [XIIDM_FORMAT, BIIDM_FORMAT, JIIDM_FORMAT];

export const separator = '/';

export const emptyObj = {};

export const exportNetworkFormSchema = yup.object().shape({
    [FILE_NAME]: yup.string().required(),
    [EXPORT_DESTINATION]: yup.string().oneOf(Object.values(ExportDestinationType)).required(),
    [DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION).optional(),
    [DIRECTORY_ITEM]: directoryItemSchema.nullable().when([EXPORT_DESTINATION], {
        is: ExportDestinationType.GRID_EXPLORE,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
    }),
    [EXPORT_FORMAT]: yup.string().required('exportStudyErrorMsg'),
    [EXPORT_COMPRESSION]: yup.string().required('exportCompressionErrorMsg'),
    [EXPORT_PARAMETERS]: yup.object(),
});

export type ExportNetworkFormData = yup.InferType<typeof exportNetworkFormSchema>;

export const emptyExportNetworkFormData = {
    [FILE_NAME]: '',
    [EXPORT_DESTINATION]: ExportDestinationType.GRID_EXPLORE,
    [DIRECTORY_ITEM]: null,
    [DESCRIPTION]: '',
    [EXPORT_FORMAT]: '',
    [EXPORT_COMPRESSION]: CompressionType.ZIP,
    [EXPORT_PARAMETERS]: emptyObj,
};

const STRING_LIST = 'STRING_LIST';

// we check if the param is for extension, if it is, we select all possible values by default.
// the only way for the moment to check if the param is for extension, is by checking his type is name.
// TODO to be removed when extensions param default value corrected in backend to include all possible values
export function getDefaultValuesForExtensionsParameter(parameters: Parameter[]): Parameter[] {
    return parameters.map((parameter) => {
        if (
            parameter.type === STRING_LIST &&
            (parameter.name?.endsWith('included.extensions') || parameter.name?.endsWith('included-extensions'))
        ) {
            return {
                ...parameter,
                defaultValue: parameter.possibleValues,
            };
        }
        return parameter;
    });
}

export function exportNetworkFormToDto(form: ExportNetworkFormData): NetworkExportInfos {
    const exportToGridExplore = form[EXPORT_DESTINATION] !== ExportDestinationType.MY_COMPUTER;
    return {
        selectedFormat: form[EXPORT_FORMAT],
        selectedCompression: form[EXPORT_COMPRESSION].toUpperCase(),
        fileName: form[FILE_NAME],
        exportToGridExplore,
        parentDirectoryUuid: exportToGridExplore ? form[DIRECTORY_ITEM]?.[DIRECTORY_ITEM_ID] : undefined,
        description: form[DESCRIPTION],
    };
}
