const slugify = require('slug');

const logger = require(process.env.PWD + '/app/logger');
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

  if (slug && slug[0] !== '') {
    logger.info('Slug property provided', slug);
    return slug;
  }

  if (name && name[0] !== '') {
    const excerpt = utils.excerptString(name[0], 5);
    slug = slugify(excerpt, {
      replacement: separator,
      lower: true
    });
    slug = new Array(slug);

    logger.info('Slug generated from name property', slug);
    return slug;
  }

  slug = new Array(random);

  logger.info('Slug generated using random string', slug);
  return slug;
};
