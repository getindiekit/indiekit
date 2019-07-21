/* eslint no-await-in-loop: warn */
const path = require('path');

const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const render = require(process.env.PWD + '/app/lib/render');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Creates a new post
 *
 * @memberof micropub
 * @module createMedia
 * @param {Object} pub Publication configuration
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
module.exports = async (pub, files) => {
  /**
   * @ignore: Turns out async/await doesn’t work so great with forEach loops.
   * Use asynchronous `await Promise.all(files.map(async file => {…}))` or
   * synchronous `for (const file of files) {…}` instead. (Asynchronous
   * pattern trips up Micropub.rocks! validator)
   * @see https://stackoverflow.com/a/37576787/11107625
   */
  for (const file of files) {
    // Determine post type from media type
    const type = utils.deriveMediaType(file);
    const typeConfig = pub['post-types'][type];

    // Provide additional properties for file path templates
    const fileProperties = utils.deriveFileProperties(file);

    // Render destination path
    const filePath = render(typeConfig.file.path, fileProperties);
    const fileUrl = render(typeConfig.file.url || typeConfig.file.path, fileProperties);
    const fileName = path.basename(filePath);

    // Prepare location and activity record
    const url = new URL(fileUrl, config.url);
    const location = url.href;
    const recordData = {
      file: {
        path: filePath,
        url: fileUrl
      }
    };

    // Upload file to GitHub
    try {
      const response = await store.github.createFile(filePath, file.buffer, {
        message: `:framed_picture: Uploaded ${fileName}\nwith ${config.name}`
      });

      if (response) {
        record.create(location, recordData);
        logger.info('micropub.createMedia %s', location, {recordData});
        return utils.success('create', location);
      }
    } catch (error) {
      logger.error('micropub.createMedia', {error});
      return utils.error('server_error', `Unable to create ${location}. ${error.message}`);
    }
  }
};
