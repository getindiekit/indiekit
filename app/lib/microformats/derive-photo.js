const path = require('path');

const config = require(process.env.PWD + '/app/config');
const render = require(process.env.PWD + '/app/lib/render');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Combines referenced and attached photos into one object which can be used in
 * a microformats2 object. Attached photos are uploaded to GitHub.
 *
 * @memberof microformats
 * @module derivePhotoProperty
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
    /**
     * @ignore: Turns out async/await doesn’t work so great with forEach loops.
     * Use asynchronous `await Promise.all(files.map(async file => {…}))` or
     * synchronous `for (const file of files) {…}` instead. (Asynchronous
     * pattern trips up Micropub.rocks! validator)
     * @see https://stackoverflow.com/a/37576787/11107625
     */
    for (const file of files) { /* eslint-disable no-await-in-loop */
      // Provide additional properties for file path templates
      const fileProperties = utils.deriveFileProperties(file);
      const fileContext = {...properties, ...referencedPhotos, ...fileProperties};

      // Render publish and destination paths
      const filePath = render(typeConfig.path.file, fileContext);
      const fileName = path.basename(filePath);

      // Create post on GitHub
      await store.github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${fileName} uploaded\nwith ${config.name}`
      });

      combinedPhotos.push({
        value: filePath
      });
    } /* eslint-enable no-await-in-loop */
  }

  return combinedPhotos;
};
