const path = require('path');

const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const render = require(process.env.PWD + '/app/lib/render');
const store = require(process.env.PWD + '/app/lib/store');
const publication = require(process.env.PWD + '/app/lib/publication');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Saves a file
 *
 * @memberof micropub
 * @module saveFile
 * @param {Object} file File object
 * @returns {String} Location of created post
 */
module.exports = async file => {
  const pub = await publication.resolveConfig(config['pub-config']);

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
      return location;
    }
  } catch (error) {
    logger.error('micropub.saveFile %s', error);
  }
};
