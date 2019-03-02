const slugify = require('slug');

const utils = require(process.env.PWD + '/app/lib/utils');

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
  const random = utils.createRandomString();

  if (slug) {
    return slug;
  }

  if (name) {
    const excerpt = utils.excerptString(name[0], 5);
    slug = slugify(excerpt, {
      replacement: separator,
      lower: true
    });

    return new Array(slug);
  }

  return new Array(random);
};
