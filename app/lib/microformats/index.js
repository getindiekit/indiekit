/**
 * Discover, parse and transform microformats2 objects
 *
 * @module microformats
 */
module.exports = {
  deriveData: require(__basedir + '/lib/microformats/derive-data'),
  deriveType: require(__basedir + '/lib/microformats/derive-type'),
  formEncodedToMf2: require(__basedir + '/lib/microformats/form-encoded-to-mf2'),
  htmlToMf2: require(__basedir + '/lib/microformats/html-to-mf2'),
  urlToMf2: require(__basedir + '/lib/microformats/url-to-mf2')
};
