const slugify = require('slug');

/**
 * Derives slug (using `mp-slug` value, slugified name else a random number)
 *
 * @memberof microformats
 * @module derviveSlug
 * @param {Object} mf2 microformats2 object
 * @param {String} separator Slug separator
 * @returns {Array} Array containing slug value
 */
module.exports = (mf2, separator) => {
  let slug = mf2['mp-slug'];
  const {name} = mf2.properties;
  const random = String(Math.floor(Math.random() * 90000) + 10000);

  if (slug) {
    return slug;
  }

  if (name) {
    slug = slugify(name[0], {
      replacement: separator,
      lower: true
    });

    return new Array(slug);
  }

  return new Array(random);
};
