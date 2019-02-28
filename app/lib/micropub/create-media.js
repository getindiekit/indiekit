const path = require('path');
const {DateTime} = require('luxon');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const history = require(process.env.PWD + '/app/lib/history');
const render = require(process.env.PWD + '/app/lib/render');
const response = require(process.env.PWD + '/app/lib/micropub/response');

/**
 * Creates a new post
 *
 * @memberof micropub
 * @module createMedia
 * @param {Object} publication Publication configuration
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
module.exports = async (publication, files) => {
  // Determine post type
  // @todo Infer type by `type` using multer field object
  const type = 'photo';
  const typeConfig = publication['post-types'][0][type];

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
    const filePath = render(typeConfig.file, fileContext);
    const urlPath = filePath;

    // Prepare location and history entry
    const location = config.url + urlPath;
    const historyEntry = {file: filePath, url: location};

    // Upload file to GitHub
    try {
      const githubResponse = await github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${filename} uploaded\nwith ${config.name}`
      });

      if (githubResponse) {
        history.update('create', historyEntry);
        return response.success('create_pending', location);
      }
    } catch (error) {
      return response.error('server_error', error);
    }
  } /* eslint-enable no-await-in-loop */
};
