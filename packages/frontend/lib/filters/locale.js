/**
 * Cache of language name formatters, keyed by display locale
 * @type {Record<string, Intl.DisplayNames>}
 */
const formatters = Object.create(null);

/**
 * Get a capitalized language name in a given locale
 * @param {string} code - ISO 639-1 language code
 * @param {string} locale - Locale to display the name in
 * @returns {string} Language name, or an empty string if the code is invalid
 * @example displayName("de", "fr") => Allemand
 */
const displayName = (code, locale) => {
  try {
    const formatter = (formatters[locale] ??= new Intl.DisplayNames([locale], {
      type: "language",
      fallback: "none",
    }));
    const name = formatter.of(code) ?? "";
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return "";
  }
};

/**
 * Get a language name in English
 * @param {string} code - ISO 639-1 language code
 * @returns {string} Language name, or empty string if code is invalid
 * @example languageName("de") => German
 */
export const languageName = (code) => displayName(code, "en");

/**
 * Get a language’s native name
 * @param {string} code - ISO 639-1 language code
 * @returns {string} Native language name, or empty string if code is invalid
 * @example languageNativeName("de") => Deutsch
 */
export const languageNativeName = (code) => displayName(code, code);
