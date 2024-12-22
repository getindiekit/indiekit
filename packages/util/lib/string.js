import { randomBytes, createHash } from "node:crypto";

import slugifyString from "@sindresorhus/slugify";

/**
 * Excerpt a string
 * @param {string} string - String to excerpt
 * @param {number} value - Maximum number of words
 * @param {string} locale - Locale
 * @returns {string} Excerpted string
 */
export const excerpt = (string, value = 100, locale = "en") => {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  const segments = segmenter.segment(string);

  let excerpt = "";
  let n = 0;
  let words = 0;
  [...segments].map((segment) => {
    words = segment.isWordLike ? n++ : n;
    if (words < value) {
      excerpt += segment.segment;
    }

    return excerpt;
  });

  if (words > value) {
    excerpt += "…";
  }

  return excerpt;
};

/**
 * Generate MD5 hashed string
 * @param {string} string - String
 * @returns {string} MD5 hashed string
 */
export const md5 = (string) => createHash("md5").update(string).digest("hex");

/**
 * Generate SHA1 hashed string
 * @param {string} string - String
 * @returns {string} SHA1 hashed string
 */
export const sha1 = (string) => createHash("sha1").update(string).digest("hex");

/**
 * Generate cryptographically random string
 * @param {number} [length] - Length of string
 * @returns {string} Random string
 */
export const randomString = (length = 16) =>
  randomBytes(length).toString("base64url").slice(0, length);

/**
 * Slugify a string
 * @param {string} string - String to slugify
 * @param {object} [options] - Slugify options
 * @returns {string|undefined} Slugified string
 * @example slugify('Foo bar baz', { separator: '_'} ) => 'foo_bar_baz'
 */
export const slugify = (string, options) => {
  if (typeof string === "string") {
    const slug = slugifyString(string, {
      customReplacements: [
        ["'", ""],
        ["’", ""],
      ],
      decamelize: false,
      separator: "-",
      ...options,
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
