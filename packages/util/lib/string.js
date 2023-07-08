import { randomBytes } from "node:crypto";
import slugifyString from "@sindresorhus/slugify";

/**
 * Generate cryptographically random string
 * @param {number} [length] - Length of string
 * @returns {string} Random string
 */
export const randomString = (length = 16) =>
  randomBytes(length).toString("base64url").slice(0, length);

/**
 * Slugify a string
 * @param {string} string - String to excerpt
 * @param {string} [separator] - Character used to separate words
 * @returns {string|undefined} Slugified string
 * @example slugify('Foo bar baz', '_') => 'foo_bar_baz'
 */
export const slugify = (string, separator = "-") => {
  if (typeof string === "string") {
    const slug = slugifyString(string, {
      customReplacements: [
        ["'", ""],
        ["’", ""],
      ],
      decamelize: false,
      separator,
    });
    return slug;
  }
};

/**
 * Substitute variables enclosed in { } braces with data from object
 * @param {string} string - String to parse
 * @param {object} object - Properties to use
 * @returns {string} String with substituted
 */
export const supplant = (string, object) => {
  const replacer = function (match, p1) {
    const r = object[p1];

    if (typeof r === "string" || typeof r === "number") {
      return r;
    }

    return match;
  };

  return string.replaceAll(/{([^{}]*)}/g, replacer);
};
