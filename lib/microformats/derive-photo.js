/**
 * Combines referenced and attached photos into one object which can be used in
 * a microformats2 object. Attached photos are uploaded to GitHub.
 *
 * @exports derivePhoto
 * @param {Object} mf2 microformats2 object
 * @returns {Promise} Array of photo obejcts
 */
module.exports = async mf2 => {
  const photos = [];
  const {photo} = mf2.properties;

  // Ensures property is consistently formatted as an array of objects
  if (photo) {
    photo.forEach(item => {
      if (typeof item === 'object') {
        photos.push(item);
      } else {
        photos.push({
          value: item
        });
      }
    });
  }

  return photos;
};
