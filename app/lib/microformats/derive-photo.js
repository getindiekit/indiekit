const render = require(process.env.PWD + '/app/lib/render');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Combines referenced and attached photos into one object which can be used in
 * a microformats2 object. Attached photos are uploaded to GitHub.
 *
 * @memberof microformats
 * @module derivePhoto
 * @param {Object} mf2 microformats2 object
 * @param {String} files Photos attached as multipart data
 * @param {Object} typeConfig Post type configuration
 * @returns {Promise} Array of photo obejcts
 */
module.exports = async (mf2, files, typeConfig) => {
  let referencedPhotos;
  const combinedPhotos = [];
  let properties;

  if (mf2) {
    referencedPhotos = mf2.properties.photo;
    properties = mf2.properties;
  }

  // Ensures property is consistently formatted as an array of objects
  if (referencedPhotos) {
    referencedPhotos.forEach(item => {
      if (typeof item === 'object') {
        combinedPhotos.push(item);
      } else {
        combinedPhotos.push({
          value: item
        });
      }
    });
  }

  if (files) {
    for (const file of files) {
      // Provide additional properties for file path templates
      const fileProperties = utils.deriveFileProperties(file);
      const fileContext = {...properties, ...referencedPhotos, ...fileProperties};

      // Render destination path available to templates
      const filePath = render(typeConfig.media.url || typeConfig.media.path, fileContext);

      combinedPhotos.push({
        value: filePath
      });
    }
  }

  if (combinedPhotos.length >= 1) {
    return combinedPhotos;
  }
};
