const path = require('path');
const _ = require('lodash');
const {DateTime} = require('luxon');

const config = require(process.env.PWD + '/app/config');
const memos = require(process.env.PWD + '/app/lib/memos');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const render = require(process.env.PWD + '/app/lib/render');
const store = require(process.env.PWD + '/app/lib/store');

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
  // @todo Infer type by `type` using multer field object
  const type = 'photo';
  const typeConfig = _.find(pub['post-types'], {type});

  // Update properties
  const properties = {
    published: DateTime.local().toISO(),
    slug: String(Math.floor(Math.random() * 90000) + 10000)
  };

  // Photos
  // @todo Abstract code into shared function
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
    const basename = String(i + 1);
    const filename = `${basename.padStart(2, '0')}${fileext}`;
    const fileProperties = {
      originalname: file.originalname,
      filename,
      fileext
    };
    const fileContext = {...properties, ...fileProperties};

    // Render publish and destination paths
    // @todo Media items can have seperate file and url paths
    const filePath = render(typeConfig.path.file, fileContext);
    const urlPath = filePath;

    // Prepare location and new memo
    const location = config.url + urlPath;
    const memo = {file: filePath, url: location};

    // Upload file to GitHub
    try {
      const response = await store.github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${filename} uploaded\nwith ${config.name}`
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
