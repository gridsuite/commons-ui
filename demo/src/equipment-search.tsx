/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import {
    ElementSearchDialog,
    EquipmentItem,
    equipmentStyles,
    EquipmentType,
    useElementSearch,
} from '../../src/index';

interface AnyElementInterface {
    id: string;
    key: string;
    label: string;
    type: EquipmentType;
}

const equipmentsToReturn: AnyElementInterface[] = [
    {
        id: 'test1',
        key: 'test1',
        label: 'label1',
        type: EquipmentType.LINE,
    },
    {
        id: 'test2',
        key: 'test2',
        label: 'label2',
        type: EquipmentType.GENERATOR,
    },
];

const searchEquipmentPromise = () => {
    return new Promise<AnyElementInterface[]>((resolve) => {
        setTimeout(() => {
            resolve(equipmentsToReturn);
        }, 300);
    });
};

export function EquipmentSearchDialog() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { elementsFound, isLoading, searchTerm, updateSearchTerm } =
        useElementSearch({
            fetchElements: searchEquipmentPromise,
        });

    const intl = useIntl();

    return (
        <>
            <Button onClick={() => setIsSearchOpen(true)}>SEARCH</Button>
            <ElementSearchDialog
                open={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearchTermChange={updateSearchTerm}
                onSelectionChange={(element: any) => {
                    console.log(element);
                }}
                elementsFound={elementsFound}
                renderElement={(props: any) => (
                    <EquipmentItem
                        styles={equipmentStyles}
                        {...props}
                        key={props.element.key}
                    />
                )}
                searchTerm={searchTerm}
                loading={isLoading}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option1, option2) =>
                    option1.id === option2.id
                }
                renderInput={(displayedValue, params) => (
                    <TextField
                        autoFocus
                        {...params}
                        label={intl.formatMessage({
                            id: 'element_search/label',
                        })}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: <Search color="disabled" />,
                        }}
                        value={displayedValue}
                    />
                )}
            />
        </>
    );
}

export default EquipmentSearchDialog;
