import languages from "iso-639-1";

/**
 * Get a language name
 * @param {string} string - ISO 639-1 language code
 * @returns {string} Native language name
 * @example language('de') => Deutsch
 */
export const languageName = (string) => languages.getName(string);

/**
 * Get a language’s native name
 * @param {string} string - ISO 639-1 language code
 * @returns {string} Native language name
 * @example language('de') => Deutsch
 */
export const languageNativeName = (string) => languages.getNativeName(string);
