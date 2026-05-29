/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { InputAdornment, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { ChangeEvent, forwardRef, RefObject, useCallback, useImperativeHandle, useRef } from 'react';
import { Search } from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import { type MuiStyles } from '../../../../../utils/styles';

const styles = {
    searchSection: (theme) => ({
        paddingRight: theme.spacing(1),
        alignItems: 'center',
    }),
} as const satisfies MuiStyles;

interface GridSearchProps {
    gridRef: RefObject<AgGridReact | null>;
    disabled?: boolean;
}

export const GridSearch = forwardRef(({ gridRef, disabled }: GridSearchProps, ref) => {
    const intl = useIntl();
    const inputRef = useRef<any>(null);

    const applyQuickFilter = useCallback(
        (filterValue: string) => {
            gridRef.current?.api?.setGridOption('quickFilterText', filterValue);
        },
        [gridRef]
    );

    const resetFilter = useCallback(() => {
        inputRef.current.value = '';
        applyQuickFilter('');
    }, [applyQuickFilter]);

    const getFilterValue = useCallback(() => {
        return inputRef.current.value;
    }, []);

    useImperativeHandle(ref, () => {
        return {
            resetFilter,
            getFilterValue,
        };
    }, [getFilterValue, resetFilter]);

    const handleChangeFilter = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            applyQuickFilter(event.target.value);
        },
        [applyQuickFilter]
    );

    return (
        <TextField
            disabled={disabled}
            size="small"
            placeholder={`${intl.formatMessage({ id: 'filter' })}...`}
            onChange={handleChangeFilter}
            inputRef={inputRef}
            fullWidth
            InputProps={{
                sx: {
                    input: styles.searchSection,
                },
                startAdornment: (
                    <InputAdornment position="start">
                        <Search color={disabled ? 'disabled' : 'inherit'} />
                    </InputAdornment>
                ),
            }}
        />
    );
});
