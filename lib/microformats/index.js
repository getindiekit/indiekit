/**
 * Discover, parse and transform microformats2 objects
 *
 * @module microformats
 */
module.exports = {
  deriveContent: require(process.env.PWD + '/lib/microformats/derive-content'),
  derivePhoto: require(process.env.PWD + '/lib/microformats/derive-photo'),
  derivePostType: require(process.env.PWD + '/lib/microformats/derive-post-type'),
  derivePuplished: require(process.env.PWD + '/lib/microformats/derive-published'),
  deriveSlug: require(process.env.PWD + '/lib/microformats/derive-slug'),
  formEncodedToMf2: require(process.env.PWD + '/lib/microformats/form-encoded-to-mf2'),
  htmlToMf2: require(process.env.PWD + '/lib/microformats/html-to-mf2'),
  urlToMf2: require(process.env.PWD + '/lib/microformats/url-to-mf2')
};
