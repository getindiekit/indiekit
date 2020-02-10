const Path = require('path');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');
const render = require(process.env.PWD + '/lib/render');
const store = require(process.env.PWD + '/lib/store');
const utils = require(process.env.PWD + '/lib/utils');

/**
 * Creates a media file.
 *
 * @exports create
 * @param {Object} req Request
 * @param {Object} options Options
 * @returns {String} Location of created file
 */
const create = async (req, options) => {
  options = options || {};
  const file = options.file || req.file;
  const {pub} = req.app.locals;

  if (!file || file.truncated || !file.buffer) {
    throw new IndieKitError({
      status: 400,
      error: 'Invalid request',
      error_description: 'No file included in request'
    });
  }

  // Derive type
  const type = await utils.deriveMediaType(file);

  // Get type config
  const typeConfig = pub['post-types'][type];

  // Derive properties
  const properties = await utils.deriveFileProperties(file);

  // Render publish path and public url
  const path = render(typeConfig.media.path, properties);
  const basename = Path.basename(path);
  let url = render(typeConfig.media.url || typeConfig.media.path, properties);
  url = utils.derivePermalink(config.pub.url, url);

  // Create record
  const mediaData = {
    upload: {
      basename,
      path,
      url
    }
  };

  // Upload media file to GitHub
  const response = await github.createFile(path, file.buffer, {
    message: req.__mf('{icon} %s uploaded\nwith {app}', basename, {
      app: config.name,
      icon: ':framed_picture:'
    })
  });

  if (response) {
    store.set(url, mediaData, 'media');
    return mediaData;
  }
};

module.exports = {
  create
};
