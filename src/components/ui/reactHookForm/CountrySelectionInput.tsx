/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { AutocompleteInput, AutocompleteInputProps } from './autocompleteInputs';
import { useLocalizedCountries } from '../../../hooks';
import { GsLang } from '../../../utils';

interface CountrySelectionInputProps extends Omit<AutocompleteInputProps, 'options' | 'getOptionLabel'> {}

export function CountrySelectionInput(props: Readonly<CountrySelectionInputProps>) {
    const { locale } = useIntl();
    const { translate, countryCodes } = useLocalizedCountries(locale as GsLang);

    return (
        <AutocompleteInput
            options={countryCodes}
            // TODO: the way Option is managed in AutocompleteInput is confusing, maybe make AutocompleteInput more generic in the future
            getOptionLabel={(countryCode) => translate(countryCode as string)}
            {...props}
        />
    );
}
