import type { DateTimeFormat as DateTimeFormatPolyfill } from '@formatjs/intl-datetimeformat';
import { shouldPolyfill as shouldPolyfillDatetimeformat } from '@formatjs/intl-datetimeformat/should-polyfill';
import { shouldPolyfill as shouldPolyfillDisplaynames } from '@formatjs/intl-displaynames/should-polyfill';
import { shouldPolyfill as shouldPolyfillDurationformat } from '@formatjs/intl-durationformat/should-polyfill';
import { shouldPolyfill as shouldPolyfillEnumerator } from '@formatjs/intl-enumerator/should-polyfill';
import { shouldPolyfill as shouldPolyfillGetcanonicallocales } from '@formatjs/intl-getcanonicallocales/should-polyfill';
import { shouldPolyfill as shouldPolyfillListformat } from '@formatjs/intl-listformat/should-polyfill';
import { shouldPolyfill as shouldPolyfillLocale } from '@formatjs/intl-locale/should-polyfill';
import { shouldPolyfill as shouldPolyfillNumberformat } from '@formatjs/intl-numberformat/should-polyfill';
import { shouldPolyfill as shouldPolyfillPluralrules } from '@formatjs/intl-pluralrules/should-polyfill';
import { shouldPolyfill as shouldPolyfillRelativetimeformat } from '@formatjs/intl-relativetimeformat/should-polyfill';
import { shouldPolyfill as shouldPolyfillSegmenter } from '@formatjs/intl-segmenter/should-polyfill';
import { match } from '@formatjs/intl-localematcher';

// TODO locale -> string[]

/**
 * https://formatjs.github.io/docs/polyfills
 * <br/>Provide developers with access to newest ECMA-402 Intl APIs with multiple polyfills that are fully tested using the [Official ECMAScript Conformance Test Suite](https://github.com/tc39/test262).
 * @param locale The lang to test check
 */
/* Tests: This library is [test262](https://github.com/tc39/test262/tree/master/test/intl402/Intl/supportedValuesOf)-compliant.
 *
 * /!\ There is dependencies between polyfills, so an order is to be respected!
 * - [Intl.getCanonicalLocales](https://formatjs.github.io/docs/polyfills/intl-getcanonicallocales)
 *     - [Intl.Locale](https://formatjs.github.io/docs/polyfills/intl-locale)
 *         - [Intl.DisplayNames](https://formatjs.github.io/docs/polyfills/intl-displaynames)
 *         - [Intl.ListFormat](https://formatjs.github.io/docs/polyfills/intl-listformat)
 *         - [Intl.PluralRules](https://formatjs.github.io/docs/polyfills/intl-pluralrules)
 *             - [Intl.NumberFormat](https://formatjs.github.io/docs/polyfills/intl-numberformat) (ES2020)
 *                 - [Intl.DurationFormat](https://formatjs.github.io/docs/polyfills/intl-durationformat) (require _ListFormat_ & _NumberFormat_)
 *                 - [Intl.RelativeTimeFormat](https://formatjs.github.io/docs/polyfills/intl-relativetimeformat)
 *                 - [Intl.DateTimeFormat](https://formatjs.github.io/docs/polyfills/intl-datetimeformat) (ES2020)
 *                     - [Intl.supportedValuesOf](https://formatjs.github.io/docs/polyfills/intl-supportedvaluesof) (require _NumberFormat_ & _DateTimeFormat_)
 * - [Intl.LocaleMatcher](https://formatjs.github.io/docs/polyfills/intl-localematcher)
 * - [Intl.Segmenter](https://formatjs.github.io/docs/polyfills/intl-segmenter)
 */
export default async function polyfillIntl(locale: string) {
    /*
     * https://formatjs.github.io/docs/polyfills/intl-segmenter/
     * A polyfill for [`Intl.Segmenter`](https://tc39.es/proposal-intl-segmenter).
     * Features: Everything in [intl-segmenter proposal](https://tc39.es/proposal-intl-segmenter)
     */
    if (shouldPolyfillSegmenter()) {
        await import('@formatjs/intl-segmenter/polyfill-force');
    }

    /*
     * https://formatjs.github.io/docs/polyfills/intl-getcanonicallocales/
     */
    // This platform already supports Intl.getCanonicalLocales
    if (shouldPolyfillGetcanonicallocales()) {
        await import('@formatjs/intl-getcanonicallocales/polyfill');
    }
    // Alternatively, force the polyfill regardless of support
    // await import('@formatjs/intl-getcanonicallocales/polyfill-force')

    /*
     * https://formatjs.github.io/docs/polyfills/intl-locale/
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     */
    // This platform already supports Intl.Locale
    if (shouldPolyfillLocale()) {
        await import('@formatjs/intl-locale/polyfill');
    }
    // Alternatively, force the polyfill regardless of support
    // await import('@formatjs/intl-locale/polyfill-force')

    /*
     * https://formatjs.github.io/docs/polyfills/intl-pluralrules/
     * A spec-compliant polyfill for [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules).
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     */
    const unsupportedLocale = shouldPolyfillPluralrules(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-pluralrules/polyfill-force');
    await import(`@formatjs/intl-pluralrules/locale-data/${unsupportedLocale}`);

    /*
     * https://formatjs.github.io/docs/polyfills/intl-listformat/
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     */
    const unsupportedLocale = shouldPolyfillListformat(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-listformat/polyfill-force');
    await import(`@formatjs/intl-listformat/locale-data/${unsupportedLocale}`);

    /*
     * https://formatjs.github.io/docs/polyfills/intl-displaynames/
     * A polyfill for [`Intl.DisplayNames`](https://tc39.es/proposal-intl-displaynames).
     * Features: Everything in [intl-displaynames proposal](https://github.com/tc39/proposal-intl-displaynames).
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     */
    const unsupportedLocale = shouldPolyfillDisplaynames(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-displaynames/polyfill-force');
    await import(`@formatjs/intl-displaynames/locale-data/${locale}`);

    /*
     * https://formatjs.github.io/docs/polyfills/intl-numberformat/
     * A polyfill for ESNext [`Intl.NumberFormat`](https://tc39.es/ecma402/#numberformat-objects)
     *   and [`Number.prototype.toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).
     * Features: Everything in the ES2020 Internationalization API spec ([https://tc39.es/ecma402](https://tc39.es/ecma402)).
     * Requirements: This package requires the following capabilities:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     *   - [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules)
     */
    const unsupportedLocale = shouldPolyfillNumberformat(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-numberformat/polyfill-force');
    await import(`@formatjs/intl-numberformat/locale-data/${unsupportedLocale}`);

    /*
     * https://formatjs.github.io/docs/polyfills/intl-relativetimeformat/
     * Requirements: This package requires the following capabilities:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     *   - [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules)
     *   - If you need `formatToParts` and have to support IE11- or Node 10-, you'd need to polyfill using `@formatjs/intl-numberformat`.
     */
    const unsupportedLocale = shouldPolyfillRelativetimeformat(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-relativetimeformat/polyfill-force');
    await import(`@formatjs/intl-relativetimeformat/locale-data/${unsupportedLocale}`);

    /*
     * https://formatjs.github.io/docs/polyfills/intl-durationformat/
     * Requirements:
     *   - [`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)
     *   - [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    const unsupportedLocale = shouldPolyfillDurationformat(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    // await import('@formatjs/intl-durationformat/polyfill-force')

    /*
     * https://formatjs.github.io/docs/polyfills/intl-datetimeformat/
     * Caution: Right now we only support Gregorian calendar in this polyfill. Therefore we recommend setting `calendar: 'gregory'` in your options to be safe.
     * Caution: Right now this polyfill supports daylight transition until 2100 to reduce the dataset size
     * Features: [dateStyle/timeStyle](https://github.com/tc39/proposal-intl-datetime-style) & [formatRange](https://github.com/tc39/proposal-intl-DateTimeFormat-formatRange)
     * Requirements: This package requires the following capabilities:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     *   - [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
     */
    // import '@formatjs/intl-datetimeformat/polyfill'
    const unsupportedLocale = shouldPolyfillDatetimeformat(locale);
    // This locale is supported
    if (!unsupportedLocale) {
        return;
    }
    // Load the polyfill 1st BEFORE loading data
    await import('@formatjs/intl-datetimeformat/polyfill-force');

    // Parallelize CLDR data loading
    await Promise.all([
        // import('@formatjs/intl-datetimeformat/add-all-tz'), // ALL Timezone from IANA database
        import('@formatjs/intl-datetimeformat/add-golden-tz'), // popular set of timezones from IANA database
        import(`@formatjs/intl-datetimeformat/locale-data/${unsupportedLocale}`),
    ]);

    /* Since JS Engines do not expose default timezone, there's currently no way for us to detect local timezone that a browser is in.
     * Therefore, the default timezone in this polyfill is `UTC`.
     * You can change this by either calling `__setDefaultTimeZone` or always explicitly pass in `timeZone` option for accurate date time calculation.
     */
    // Since `__setDefaultTimeZone` is not in the spec, you should make sure to check for its existence before calling it & after tz data has been loaded
    if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
        (Intl.DateTimeFormat as typeof DateTimeFormatPolyfill).__setDefaultTimeZone('Europe/Paris');
    }

    // TODO Collator detection because no polyfill ?!
    /*
     * https://formatjs.github.io/docs/polyfills/intl-supportedvaluesof/
     * Requirements:
     *   - [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
     *   - [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
     *   - [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    // This platform already supports Intl.supportedValuesOf
    if (shouldPolyfillEnumerator()) {
        await import('@formatjs/intl-enumerator/polyfill');
    }
    // Alternatively, force the polyfill regardless of support
    // await import('@formatjs/intl-enumerator/polyfill-force')
}

/*
 * https://formatjs.github.io/docs/polyfills/intl-localematcher/
 * A spec-compliant ponyfill for [Intl.LocaleMatcher](https://github.com/tc39/proposal-intl-localematcher).
 *  Since this is only stage-1 this package is a ponyfill instead of polyfill.
 * Requirements:
 *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
 *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
 */
export const matchIntl = match;
