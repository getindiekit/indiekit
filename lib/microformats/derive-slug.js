const slugify = require('slug');

const utils = require(process.env.PWD + '/lib/utils');

/**
 * Derives slug (using `mp-slug` value, slugified name else a random number).
 *
 * @exports derviveSlug
 * @param {Object} mf2 microformats2 object
 * @param {String} separator Slug separator
 * @returns {Array} Array containing slug value
 */
module.exports = (mf2, separator) => {
  // Use provided slug…
  let {slug} = mf2.properties;
  if (slug && slug[0] !== '') {
    return slug;
  }

  // …else, slugify name…
  const {name} = mf2.properties;
  if (name && name[0] !== '') {
    const excerpt = utils.excerptString(name[0], 5);
    slug = slugify(excerpt, {
      replacement: separator,
      lower: true
    });
    slug = new Array(slug);

    return slug;
  }

  // …else, failing that, create a random string
  const random = utils.createRandomString();
  slug = new Array(random);

  return slug;
};
