/**
 * Discover, parse and transform microformats2 objects
 *
 * @module microformats
 */
module.exports = {
  deriveContentProperty: require(process.env.PWD + '/app/lib/microformats/derive-content-property'),
  derivePhotoProperty: require(process.env.PWD + '/app/lib/microformats/derive-photo-property'),
  derivePuplishedProperty: require(process.env.PWD + '/app/lib/microformats/derive-published-property'),
  deriveSlug: require(process.env.PWD + '/app/lib/microformats/derive-slug'),
  deriveType: require(process.env.PWD + '/app/lib/microformats/derive-type'),
  formEncodedToMf2: require(process.env.PWD + '/app/lib/microformats/form-encoded-to-mf2'),
  htmlToMf2: require(process.env.PWD + '/app/lib/microformats/html-to-mf2'),
  urlToMf2: require(process.env.PWD + '/app/lib/microformats/url-to-mf2')
};
