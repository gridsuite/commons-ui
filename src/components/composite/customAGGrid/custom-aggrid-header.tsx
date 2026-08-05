/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { ComponentType, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Tooltip } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { CustomHeaderProps } from 'ag-grid-react';
import { CustomAggridSort } from './custom-aggrid-sort';
import { CustomMenu, CustomMenuProps } from './custom-aggrid-menu';
import { MuiStyles } from '../../../utils';
import { CustomAggridFilterParams, SortParams } from './custom-aggrid-types';
import { useCustomAggridSort } from './hooks/use-custom-aggrid-sort';
import { CustomAggridFilter } from './custom-aggrid-filters/custom-aggrid-filter';

const styles = {
    displayName: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    invalidIcon: {
        display: 'flex',
        alignItems: 'center',
        ml: 0.5,
    },
    titleContainer: {
        minWidth: 0,
    },
    actions: {
        flex: '0 0 auto',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
} as const satisfies MuiStyles;

interface CustomHeaderComponentProps<F extends CustomAggridFilterParams, T> extends CustomHeaderProps {
    displayName: string;
    sortParams?: SortParams;
    menu?: CustomMenuProps<T>;
    forceDisplayFilterIcon: boolean;
    filterComponent: ComponentType<F>;
    filterComponentParams: F;
    isInvalid?: boolean;
}

export function CustomHeaderComponent<F extends CustomAggridFilterParams, T>({
    column,
    displayName,
    sortParams,
    menu,
    forceDisplayFilterIcon,
    filterComponent,
    filterComponentParams,
    api,
    isInvalid,
}: CustomHeaderComponentProps<F, T>) {
    const [isHoveringColumnHeader, setIsHoveringColumnHeader] = useState(false);

    const { handleSortChange } = useCustomAggridSort(column.getId(), sortParams, api);
    const isSortable = !!sortParams;
    const handleClickHeader = () => {
        handleSortChange();
    };

    const handleCloseFilter = () => {
        setIsHoveringColumnHeader(false);
    };

    const handleMouseEnter = useCallback(() => {
        setIsHoveringColumnHeader(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHoveringColumnHeader(false);
    }, []);

    return (
        <Grid container onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ width: '100%' }}>
            <Grid container alignItems="center" wrap="nowrap" sx={{ width: '100%' }}>
                <Grid
                    container
                    sx={{
                        cursor: isSortable ? 'pointer' : 'default',
                        ...styles.titleContainer,
                        flex: forceDisplayFilterIcon ? '0 1 auto' : undefined,
                    }}
                    flexBasis={forceDisplayFilterIcon ? 'auto' : '100%'}
                >
                    <Grid
                        container
                        sx={{
                            overflow: 'hidden',
                            minWidth: 0,
                        }}
                        onClick={handleClickHeader}
                    >
                        <Grid container sx={styles.displayName} alignItems="center" wrap="nowrap">
                            <Grid>{displayName}</Grid>
                            {isInvalid && (
                                <Grid sx={styles.invalidIcon}>
                                    <Tooltip
                                        title={<FormattedMessage id="spreadsheet/column/invalid-without-loadflow" />}
                                    >
                                        <WarningAmber fontSize="small" color="warning" />
                                    </Tooltip>
                                </Grid>
                            )}
                            {sortParams && (
                                <Grid>
                                    <CustomAggridSort colId={column.getId()} sortParams={sortParams} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={styles.actions}>
                    {filterComponent && (
                        <CustomAggridFilter
                            filterComponent={filterComponent}
                            filterComponentParams={{ ...filterComponentParams, colId: column.getId(), api }}
                            isHoveringColumnHeader={isHoveringColumnHeader}
                            forceDisplayFilterIcon={forceDisplayFilterIcon}
                            handleCloseFilter={handleCloseFilter}
                        />
                    )}
                    {menu && <CustomMenu {...menu} />}
                </Grid>
            </Grid>
        </Grid>
    );
}
