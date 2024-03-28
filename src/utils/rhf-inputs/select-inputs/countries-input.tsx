import { useParameterState } from '../../../hooks/useParameterState';
import { useCallback, useMemo, FunctionComponent } from 'react';
import { Chip } from '@mui/material';
import AutocompleteInput from '../../../components/react-hook-form/autocomplete-input';
import {
    LANG_ENGLISH,
    LANG_FRENCH,
    LANG_SYSTEM,
} from '../../../components/TopBar/topBarConstants';

const supportedLanguages = [LANG_FRENCH, LANG_ENGLISH];

export const PARAM_LANGUAGE = 'language';

export const getSystemLanguage = () => {
    const systemLanguage = navigator.language.split(/[-_]/)[0];
    return supportedLanguages.includes(systemLanguage)
        ? systemLanguage
        : LANG_ENGLISH;
};

export const getComputedLanguage = (language: string) => {
    return language === LANG_SYSTEM ? getSystemLanguage() : language;
};

interface CountryInputProps {
    name: string;
    label: string;
    paramGlobalState: unknown;
    updateParam: (param: unknown) => Promise<unknown>;
}

export const CountriesInput: FunctionComponent<CountryInputProps> = ({
    name,
    label,
    paramGlobalState,
    updateParam,
}) => {
    const [languageLocal] = useParameterState(
        PARAM_LANGUAGE,
        paramGlobalState,
        updateParam
    );
    const countriesListCB = useCallback(() => {
        try {
            return require('localized-countries')(
                require('localized-countries/data/' +
                    getComputedLanguage(languageLocal as string).substr(0, 2))
            );
        } catch (error) {
            // fallback to english if no localised list found
            return require('localized-countries')(
                require('localized-countries/data/en')
            );
        }
    }, [languageLocal]);

    const countriesList = useMemo(() => countriesListCB(), [countriesListCB]);

    const getLabel = (code: string | { id: string; label: string }) => {
        return countriesList.get(code);
    };

    return (
        <AutocompleteInput
            name={name}
            label={label}
            options={Object.keys(countriesList.object())}
            getOptionLabel={getLabel}
            fullWidth
            multiple
            renderTags={(val: any[], getTagsProps: any) =>
                val.map((code: string, index: number) => (
                    <Chip
                        key={code}
                        size={'small'}
                        label={getLabel(code)}
                        {...getTagsProps({ index })}
                    />
                ))
            }
        />
    );
};

export default CountriesInput;
