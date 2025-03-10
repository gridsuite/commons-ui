import { supportedLocales as supportedLocalesDatetimeformat } from '@formatjs/intl-datetimeformat/supported-locales.generated';
import { supportedLocales as supportedLocalesDisplaynames } from '@formatjs/intl-displaynames/supported-locales.generated';
import { supportedLocales as supportedLocalesListformat } from '@formatjs/intl-listformat/supported-locales.generated';
import { supportedLocales as supportedLocalesNumberformat } from '@formatjs/intl-numberformat/supported-locales.generated';
import { supportedLocales as supportedLocalesPluralrules } from '@formatjs/intl-pluralrules/supported-locales.generated';
import { supportedLocales as supportedLocalesRelativetimeformat } from '@formatjs/intl-relativetimeformat/supported-locales.generated';
import type { SupportedLocales } from './supported-locales';

// order of locales not guaranteed ; real content may differ from type because it's manually maintained
export const supportedLocales = [
    ...new Set([
        ...supportedLocalesDatetimeformat,
        ...supportedLocalesDisplaynames,
        ...supportedLocalesListformat,
        ...supportedLocalesNumberformat,
        ...supportedLocalesPluralrules,
        ...supportedLocalesRelativetimeformat,
    ]),
] as readonly SupportedLocales[];
