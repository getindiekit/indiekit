const path = require('path');

const {IndieKitError} = require(process.env.PWD + '/app/errors');
const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const render = require(process.env.PWD + '/app/lib/render');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Creates a media file
 *
 * @memberof media
 * @module create
 * @param {Object} pub Publication configuration
 * @param {Object} file File object
 * @returns {String} Location of created file
 */
const create = async (pub, file) => {
  logger.info('media.create', {file});

  // Determine post type from media type
  const type = utils.deriveMediaType(file);
  const typeConfig = pub['post-types'][type];

  // Provide additional properties for file path templates
  const fileProperties = utils.deriveFileProperties(file);

  // Render destination path
  const mediaPath = render(typeConfig.media.path, fileProperties);
  const mediaUrl = render(typeConfig.media.url || typeConfig.media.path, fileProperties);
  const mediaName = path.basename(mediaPath);

  // Prepare location and activity record
  const url = new URL(mediaUrl, config.url);
  const location = url.href;
  const recordData = {
    media: {
      path: mediaPath,
      url: mediaUrl
    }
  };

  // Upload file to GitHub
  await github.createFile(mediaPath, file.buffer, {
    message: `:framed_picture: Uploaded ${mediaName}`
  }).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  record.set(location, recordData);
  return location;
};

module.exports = {
  create
};
