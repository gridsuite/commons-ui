/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Article as ArticleIcon,
    Calculate as CalculateIcon,
    Hub as HubIcon,
    NoteAlt as NoteAltIcon,
    OfflineBolt as OfflineBoltIcon,
    Photo as PhotoIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Settings as SettingsIcon,
    TableView as TableViewIcon,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { ElementType } from '../types/elementType';
import type { SxStyle } from '../styles';

export function getFileIcon(type: ElementType, style: SxStyle) {
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
        case ElementType.NETWORK_VISUALIZATIONS_PARAMETERS:
        case ElementType.PCC_MIN_PARAMETERS:
            return <SettingsIcon sx={style} />;
        case ElementType.SPREADSHEET_CONFIG:
            return <CalculateIcon sx={style} />;
        case ElementType.SPREADSHEET_CONFIG_COLLECTION:
            return <TableViewIcon sx={style} />;
        case ElementType.DIAGRAM_CONFIG:
            return <HubIcon sx={style} />;
        case ElementType.WORKSPACE:
            return <DashboardIcon sx={style} />;
        case ElementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return undefined;
        default:
            console.warn(`unknown type [${type}]`);
    }
    return undefined;
}
