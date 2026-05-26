/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { MuiStyles } from '../../utils/styles';

/**
 * Styles use in parameter forms
 */
export const parametersStyles = {
    title: (theme) => ({
        padding: theme.spacing(2),
    }),
    minWidthMedium: (theme) => ({
        minWidth: theme.spacing(20),
    }),
    parameterName: (theme) => ({
        fontWeight: 'bold',
        marginTop: theme.spacing(1),
    }),
    controlItem: {
        justifyContent: 'flex-end',
        flexGrow: 1,
    },
    controlParametersItem: {
        justifyContent: 'flex-start',
        flexGrow: 1,
        height: 'fit-content',
        paddingBottom: 4,
    },
    button: (theme) => ({
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(1),
    }),
    subgroupParameters: (theme) => ({
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    }),
    subgroupParametersAccordion: {
        '&:before': {
            display: 'none',
        },
        background: 'none',
    },
    subgroupParametersAccordionSummary: (theme) => ({
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(-90deg)',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(0deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(0),
        },
    }),
    subgroupParametersAccordionDetails: (theme) => ({
        padding: theme.spacing(0),
    }),
    marginTopButton: {
        marginTop: '10px',
        position: 'sticky',
        bottom: 0,
    },
    scrollableGrid: (theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: '85%', // TODO This needs to be refactored
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
    }),
    singleItem: (theme) => ({
        display: 'flex',
        flex: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }),
    firstTextField: (theme) => ({
        marginLeft: theme.spacing(3),
    }),
    secondTextField: (theme) => ({
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(2),
    }),
    singleTextField: (theme) => ({
        display: 'flex',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(1),
    }),
    tooltip: (theme) => ({
        marginLeft: theme.spacing(1),
    }),
    text: (theme) => ({
        display: 'flex',
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    }),
    multipleItems: (theme) => ({
        display: 'flex',
        flex: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }),
    tabWithError: (theme) => ({
        '&.Mui-selected': { color: theme.palette.error.main },
        color: theme.palette.error.main,
    }),
    tabWithErrorIndicator: (theme) => ({
        backgroundColor: theme.palette.error.main,
    }),
    panel: (theme) => ({
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    }),
    adjustExistingLimitsInfo: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }),
    circularProgress: (theme) => ({
        marginRight: theme.spacing(2),
        color: theme.palette.primary.contrastText,
    }),
    icon: (theme) => ({
        width: theme.spacing(3),
    }),
    modificationsTitle: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        overflow: 'hidden',
    }),
} as const satisfies MuiStyles;

export function getTabIndicatorStyle<T extends number | string>(tabIndexesWithError: T[], index: T) {
    return tabIndexesWithError.includes(index) ? parametersStyles.tabWithErrorIndicator : undefined;
}

export function getTabStyle<T extends number | string>(tabIndexesWithError: T[], index: T) {
    return tabIndexesWithError.includes(index) ? parametersStyles.tabWithError : undefined;
}
