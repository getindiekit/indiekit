const _ = require('lodash');

const config = require(process.env.PWD + '/app/config');
const memos = require(process.env.PWD + '/app/lib/memos');
const micropub = require(process.env.PWD + '/app/lib/micropub');
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
  // Determine post type
  // TODO: Infer type by `type` using multer field object
  const type = 'photo';
  const typeConfig = _.find(pub['post-types'], {type});

  // Photos
  /**
   * Turns out async/await doesn’t work so great with forEach loops. Use
   * asynchronous `await Promise.all(files.map(async file => {…}))` or
   * synchronous `for (const file of files) {…}` instead.
   * (Asynchronous pattern trips up Micropub.rocks! validator)
   * @see https://stackoverflow.com/a/37576787/11107625
   */
  for (const file of files) { /* eslint-disable no-await-in-loop */
    // Provide additional properties for file path templates
    const properties = utils.deriveFileProperties(file);

    // Render destination path
    const filePath = render(typeConfig.path.file, properties);

    // Prepare location and new memo
    const location = config.url + filePath;
    const memo = {file: filePath, url: location};

    // Upload file to GitHub
    try {
      const response = await store.github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${properties.filename} uploaded\nwith ${config.name}`
      });

      if (response) {
        memos.update('create', memo);
        return micropub.response('create_pending', location);
      }
    } catch (error) {
      return micropub.error('server_error', error);
    }
  } /* eslint-enable no-await-in-loop */
};
