/**
 * Discover, parse and transform microformats2 objects
 *
 * @module microformats
 */
module.exports = {
  deriveContentProperty: require(__basedir + '/lib/microformats/derive-content-property'),
  derivePhotoProperty: require(__basedir + '/lib/microformats/derive-photo-property'),
  derivePuplishedProperty: require(__basedir + '/lib/microformats/derive-published-property'),
  deriveSlug: require(__basedir + '/lib/microformats/derive-slug'),
  deriveType: require(__basedir + '/lib/microformats/derive-type'),
  formEncodedToMf2: require(__basedir + '/lib/microformats/form-encoded-to-mf2'),
  htmlToMf2: require(__basedir + '/lib/microformats/html-to-mf2'),
  urlToMf2: require(__basedir + '/lib/microformats/url-to-mf2')
};
