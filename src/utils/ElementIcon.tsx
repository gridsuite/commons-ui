/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Article as ArticleIcon,
    NoteAlt as NoteAltIcon,
    OfflineBolt as OfflineBoltIcon,
    Photo as PhotoIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { ElementType } from './ElementType';
import { SxProps, Theme } from '@mui/material';

export function getFileIcon(type: ElementType, style: SxProps<Theme>) {
    switch (type) {
        case ElementType.STUDY:
            return <PhotoLibraryIcon sx={style} />;
        case ElementType.CASE:
            return <PhotoIcon sx={style} />;
        case ElementType.CONTINGENCY_LIST:
            return <OfflineBoltIcon sx={style} />;
        case ElementType.MODIFICATION:
            return <NoteAltIcon sx={style} />;
        case ElementType.FILTER:
            return <ArticleIcon sx={style} />;
        case ElementType.VOLTAGE_INIT_PARAMETERS:
        case ElementType.SECURITY_ANALYSIS_PARAMETERS:
        case ElementType.LOADFLOW_PARAMETERS:
        case ElementType.SENSITIVITY_PARAMETERS:
        case ElementType.SHORT_CIRCUIT_PARAMETERS:
            return <SettingsIcon sx={style} />;
        case ElementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return;
        default:
            console.warn('unknown type [' + type + ']');
    }
}
