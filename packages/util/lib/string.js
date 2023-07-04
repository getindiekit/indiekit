import slugifyString from "@sindresorhus/slugify";

/**
 * Slugify a string
 * @param {string} string - String to excerpt
 * @param {string} [separator] - Character used to separate words
 * @returns {string} Slugified string
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

  return string.replace(/{([^{}]*)}/g, replacer);
};
