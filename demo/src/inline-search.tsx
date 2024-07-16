/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import {
    ElementSearchInput,
    EquipmentItem,
    EquipmentType,
    equipmentStyles,
} from '../../src';

export function InlineSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateSearchTerm = (newSearchTerm: string) => {
        setIsLoading(true);
        setSearchTerm(newSearchTerm);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const intl = useIntl();

    return (
        <ElementSearchInput
            onSearchTermChange={updateSearchTerm}
            onSelectionChange={(element: any) => {
                console.log(element);
            }}
            elementsFound={
                searchTerm
                    ? [
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
                      ]
                    : []
            }
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
    );
}

export default InlineSearch;
