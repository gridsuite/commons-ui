/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import DescriptionIcon from '@material-ui/icons/Description';
import PanToolIcon from '@material-ui/icons/PanTool';
import FilterListIcon from '@material-ui/icons/FilterList';
import FilterIcon from '@material-ui/icons/Filter';
import React from 'react';

export const elementType = {
    DIRECTORY: 'DIRECTORY',
    STUDY: 'STUDY',
    FILTER: 'FILTER',
    SCRIPT: 'SCRIPT',
    SCRIPT_CONTINGENCY_LIST: 'SCRIPT_CONTINGENCY_LIST',
    FILTERS_CONTINGENCY_LIST: 'FILTERS_CONTINGENCY_LIST',
};

export function getIconFor(type, theme) {
    switch (type) {
        case elementType.STUDY:
            return <LibraryBooksOutlinedIcon className={theme} />;
        case elementType.SCRIPT_CONTINGENCY_LIST:
            return <DescriptionIcon className={theme} />;
        case elementType.FILTERS_CONTINGENCY_LIST:
            return <PanToolIcon className={theme} />;
        case elementType.FILTER:
            return <FilterListIcon className={theme} />;
        case elementType.SCRIPT:
            return <FilterIcon className={theme} />;
        case elementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return;
        default:
            console.warn('unknown type [' + type + ']');
    }
}
