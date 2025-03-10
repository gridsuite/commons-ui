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

type ShouldPolyfillBasic = () => boolean;
type ShouldPolyfillWithLocaleSupport =
    | ((locale?: string) => string | undefined)
    | ((locale?: string) => string | true | undefined);
type ShouldPolyfill<Locale extends undefined | string> = Locale extends string
    ? ShouldPolyfillWithLocaleSupport
    : ShouldPolyfillBasic;
type DynamicImport = Promise<{ default: {} }>;

async function doPolyfill(shouldPolyfill: ShouldPolyfillBasic, loadPolyfill: () => DynamicImport): Promise<void>;
async function doPolyfill(
    shouldPolyfill: ShouldPolyfillWithLocaleSupport,
    loadPolyfill: () => DynamicImport,
    loadLocalePolyfill: () => DynamicImport | DynamicImport[],
    loadExtraPolyfill?: () => DynamicImport
): Promise<void>;
async function doPolyfill<Locale extends undefined | string>(
    shouldPolyfill: ShouldPolyfill<Locale>,
    loadPolyfill: () => DynamicImport,
    loadLocalePolyfill?: Locale extends undefined ? never : () => DynamicImport | DynamicImport[],
    loadExtraPolyfill?: Locale extends undefined ? never : () => DynamicImport
) {
    // just check if we should polyfill Intl.*, not if locale supported
    if (shouldPolyfill()) {
        await loadPolyfill(); // Load the polyfill 1st BEFORE loading data
        if (loadLocalePolyfill) {
            const dynamicImports = loadLocalePolyfill();
            await Promise.all([
                ...(loadExtraPolyfill ? [loadExtraPolyfill()] : []),
                Array.isArray(dynamicImports) ? dynamicImports : [dynamicImports],
            ]); // Parallelize data loading
        }
    }
}

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
export default async function polyfillIntl(locale: string /* | string[] */) {
    /*
     * https://formatjs.github.io/docs/polyfills/intl-segmenter/
     * A polyfill for [`Intl.Segmenter`](https://tc39.es/proposal-intl-segmenter).
     * Features: Everything in [intl-segmenter proposal](https://tc39.es/proposal-intl-segmenter)
     */
    await doPolyfill(shouldPolyfillSegmenter, () => import('@formatjs/intl-segmenter/polyfill-force'));

    /*
     * https://formatjs.github.io/docs/polyfills/intl-getcanonicallocales/
     */
    // This platform already supports Intl.getCanonicalLocales
    await doPolyfill(
        shouldPolyfillGetcanonicallocales,
        () => import('@formatjs/intl-getcanonicallocales/polyfill-force')
    );

    /*
     * https://formatjs.github.io/docs/polyfills/intl-locale/
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     */
    // This platform already supports Intl.Locale
    await doPolyfill(shouldPolyfillLocale, () => import('@formatjs/intl-locale/polyfill-force'));

    /*
     * https://formatjs.github.io/docs/polyfills/intl-pluralrules/
     * A spec-compliant polyfill for [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules).
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     */
    await doPolyfill(
        shouldPolyfillPluralrules,
        () => import('@formatjs/intl-pluralrules/polyfill-force'),
        () => import(`@formatjs/intl-pluralrules/locale-data/${locale}`)
    );

    /*
     * https://formatjs.github.io/docs/polyfills/intl-listformat/
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     */
    await doPolyfill(
        shouldPolyfillListformat,
        () => import('@formatjs/intl-listformat/polyfill-force'),
        () => import(`@formatjs/intl-listformat/locale-data/${locale}`)
    );

    /*
     * https://formatjs.github.io/docs/polyfills/intl-displaynames/
     * A polyfill for [`Intl.DisplayNames`](https://tc39.es/proposal-intl-displaynames).
     * Features: Everything in [intl-displaynames proposal](https://github.com/tc39/proposal-intl-displaynames).
     * Requirements:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     */
    await doPolyfill(
        shouldPolyfillDisplaynames,
        () => import('@formatjs/intl-displaynames/polyfill-force'),
        () => import(`@formatjs/intl-displaynames/locale-data/${locale}`)
    );

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
    await doPolyfill(
        shouldPolyfillNumberformat,
        () => import('@formatjs/intl-numberformat/polyfill-force'),
        () => import(`@formatjs/intl-numberformat/locale-data/${locale}`)
    );

    /*
     * https://formatjs.github.io/docs/polyfills/intl-relativetimeformat/
     * Requirements: This package requires the following capabilities:
     *   - [`Intl.getCanonicalLocales`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales)
     *   - [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
     *   - [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules)
     *   - If you need `formatToParts` and have to support IE11- or Node 10-, you'd need to polyfill using `@formatjs/intl-numberformat`.
     */
    await doPolyfill(
        shouldPolyfillRelativetimeformat,
        () => import('@formatjs/intl-relativetimeformat/polyfill-force'),
        () => import(`@formatjs/intl-relativetimeformat/locale-data/${locale}`)
    );

    /*
     * https://formatjs.github.io/docs/polyfills/intl-durationformat/
     * Requirements:
     *   - [`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)
     *   - [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    await doPolyfill(shouldPolyfillDurationformat, () => import('@formatjs/intl-durationformat/polyfill-force'));

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
    await doPolyfill(
        shouldPolyfillDatetimeformat,
        () => import('@formatjs/intl-datetimeformat/polyfill-force'),
        () => import(`@formatjs/intl-datetimeformat/locale-data/${locale}`),
        // () => import('@formatjs/intl-datetimeformat/add-all-tz') // ALL Timezone from IANA database
        () => import('@formatjs/intl-datetimeformat/add-golden-tz') // popular set of timezones from IANA database
    );

    /* Since JS Engines do not expose default timezone, there's currently no way for us to detect local timezone that a browser is in.
     * Therefore, the default timezone in this polyfill is `UTC`.
     * You can change this by either calling `__setDefaultTimeZone` or always explicitly pass in `timeZone` option for accurate date time calculation.
     */
    // Since `__setDefaultTimeZone` is not in the spec, you should make sure to check for its existence before calling it & after tz data has been loaded
    if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
        // eslint-disable-next-line no-underscore-dangle -- formatjs api, not our
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
    await doPolyfill(shouldPolyfillEnumerator, () => import('@formatjs/intl-enumerator/polyfill-force'));
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
