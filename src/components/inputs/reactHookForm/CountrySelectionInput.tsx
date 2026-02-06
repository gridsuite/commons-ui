/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AutocompleteInput, AutocompleteInputProps } from './autocompleteInputs';
import { useLocalizedCountries } from '../../../hooks';
import { useCustomFormContext } from './provider';

interface CountrySelectionInputProps extends Omit<AutocompleteInputProps, 'options' | 'getOptionLabel'> {}

export function CountrySelectionInput(props: Readonly<CountrySelectionInputProps>) {
    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language!);

    return (
        <AutocompleteInput
            options={countryCodes}
            // TODO: the way Option is managed in AutocompleteInput is confusing, maybe make AutocompleteInput more generic in the future
            getOptionLabel={(countryCode) => translate(countryCode as string)}
            {...props}
        />
    );
}
