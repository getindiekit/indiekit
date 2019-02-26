const path = require('path');

const appConfig = require(__basedir + '/config.js');
const github = require(__basedir + '/lib/github');
const render = require(__basedir + '/lib/render');

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
  const photo = mf2.properties.photo || [];
  const {properties} = mf2;

  // Ensures property is consistently formatted as an array of objects
  if (photo) {
    photo.forEach(item => {
      if (typeof item === 'object') {
        photo.push(item);
      } else {
        photo.push({
          value: item
        });
      }
    });
  }

  if (files) {
    /**
     * Turns out async/await doesn’t work so great with forEach loops. Use
     * asynchronous `await Promise.all(files.map(async file => {…}))` or
     * synchronous `for (const file of files) {…}` instead.
     * (Asynchronous pattern trips up Micropub.rocks! validator)
     * @see https://stackoverflow.com/a/37576787/11107625
     */
    for (const [i, file] of files.entries()) { /* eslint-disable no-await-in-loop */
      // Provide additional properties for file path templates
      const fileext = path.extname(file.originalname);
      const basename = i + 1;
      const filename = `${basename.padStart(2, '0')}${fileext}`;
      const fileProperties = {
        originalname: file.originalname,
        filename,
        fileext
      };
      const fileContext = {...properties, ...photo, ...fileProperties};

      // Render publish and destination paths
      const filePath = render(typeConfig.file, fileContext);

      // Create post on GitHub
      const githubResponse = await github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${filename} uploaded with ${appConfig.name}`
      });

      if (githubResponse) {
        photo.push({
          value: filePath
        });
      }
    } /* eslint-enable no-await-in-loop */
  }

  return photo;
};
