/**
 * Accept form-encoded and JSON data, convert it to a microformats2 object
 * and process the resulting data so that it can be published to a destination.
 *
 * @module functions/micropub
 */
const path = require('path');

const {DateTime} = require('luxon');
const fetch = require('node-fetch');
const slugify = require('slugify');

const appConfig = require(__basedir + '/app/config.js');
const pubDefaults = appConfig.defaults;
const cache = require(__basedir + '/app/functions/cache');
const history = require(__basedir + '/app/functions/history');
const github = require(__basedir + '/app/functions/github');
const microformats = require(__basedir + '/app/functions/microformats');
const render = require(__basedir + '/app/functions/render');
const utils = require(__basedir + '/app/functions/utils');

/**
 * Converts form-encoded body to microformats2 object. Adapted from
 * {@link https://github.com/voxpelli/node-micropub-express node-micropub-express}
 * by {@link https://kodfabrik.se Pelle Wessman}
 *
 * @copyright (c) 2016, Pelle Wessman
 * @param {String} body Form-encoded body
 * @return {Object} mf2 microformats2 object
 */
const convertFormEncodedToMf2 = body => {
  const reservedProperties = Object.freeze([
    'access_token',
    'h',
    'action',
    'url'
  ]);

  const result = {
    type: body.h ? ['h-' + body.h] : ['h-entry'],
    properties: {},
    mp: {}
  };

  if (body.h) {
    delete body.h;
  }

  for (let key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      const isReservedProperty = reservedProperties.indexOf(key) !== -1;
      const isExtendedProperty = key.indexOf('mp-') === 0;

      let value = body[key];
      value = utils.decodeFormEncodedString(value);

      if (isReservedProperty) {
        result[key] = value;
      } else {
        let targetProperty;

        if (isExtendedProperty) {
          key = key.substr(3);
          targetProperty = result.mp;
        } else {
          targetProperty = result.properties;
        }

        targetProperty[key] = [].concat(value);
      }
    }
  }

  utils.removeEmptyObjectKeys(result);

  return result;
};

/**
 * Returns a slugified string based on microformats2 object
 *
 * @param {Object} mf2 microformats2 object
 * @param {String} separator Slug separator
 * @returns {Array} Slug
 */
const getSlug = (mf2, separator) => {
  let slug;
  const hasSlug = ((mf2 || {}).mp || {}).slug;
  const hasTitle = ((mf2 || {}).properties || {}).name;

  if (hasSlug) {
    slug = mf2.mp.slug[0];
  }

  if (hasTitle) {
    slug = slugify(mf2.properties.name[0], {
      replacement: separator,
      lower: true
    });
  }

  slug = String(Math.floor(Math.random() * 90000) + 10000);

  return new Array(slug);
};

/**
 * Returns an ISO formatted date
 *
 * @param {Object} mf2 microformats2 object
 * @returns {Array} ISO formatted date
 */
const getDate = mf2 => {
  let date;

  try {
    const published = mf2.properties.published[0];
    date = published.toISO();
  } catch (error) {
    date = DateTime.local().toISO();
  }

  return new Array(date);
};

/**
 * Returns an array of photo objects
 *
 * @param {Array} property microformats2 `photo` property
 * @returns {Array} Photos
 */
const getPhotos = property => {
  if (property) {
    const photo = [];

    property.forEach(item => {
      if (typeof item === 'object') {
        photo.push(item);
      } else {
        item = {value: item};
        photo.push(item);
      }
    });

    return photo;
  }

  return [];
};

/**
 * Returns content (HTML, else object value, else property value)
 *
 * @param {Array} property microformats2 `contents` property
 * @returns {Array} Content
 */
const getContent = property => {
  if (property) {
    const content = property[0].html || property[0].value || property[0];
    return new Array(content);
  }

  return null;
};

/**
 * Returns an object containing error information
 *
 * @param {String} id Identifier
 * @param {String} desc Description
 * @returns {Object} Error object
 */
const errorResponse = (id, desc) => {
  let code;

  switch (id) {
    case ('not_supported'):
      code = 404;
      desc = desc || 'Request is not currently supported';
      break;
    case ('forbidden'):
      code = 403;
      desc = desc || 'User does not have permission to perform request';
      break;
    case ('unauthorized'):
      code = 401;
      desc = desc || 'No access token provided in request';
      break;
    case ('insufficient_scope'):
      code = 401;
      desc = desc || 'Scope of access token does not meet requirements for request';
      break;
    case ('invalid_request'):
      code = 400;
      desc = desc || 'Request is missing required parameter, or there was a problem with value of one of the parameters provided';
      break;
    default:
      id = 'server_error';
      code = 500;
      desc = desc || 'Server error';
  }

  return {
    code,
    body: {
      error: id,
      error_description: desc
    }
  };
};

/**
 * Returns an object containing success information
 *
 * @param {String} id Identifier
 * @param {String} location Location of post
 * @returns {Object} Success object
 */
const successResponse = (id, location) => {
  let code;
  let desc;

  switch (id) {
    case ('create'):
      code = 201;
      desc = `Post created at ${location}`;
      break;
    case ('create_pending'):
      code = 202;
      desc = `Post will be created at ${location}`;
      break;
    case ('update'):
      code = 200;
      desc = `Post updated at ${location}`;
      break;
    case ('update_created'):
      code = 201;
      desc = `Post updated and moved to ${location}`;
      break;
    case ('delete'):
      code = 200;
      desc = `Post deleted from ${location}`;
      break;
    case ('delete_undelete'):
      code = 201;
      desc = `Post undeleted from ${location}`;
      break;
    default:
      code = 200;
      desc = 'Success';
  }

  return {
    code,
    location,
    body: {
      success: id,
      success_description: desc
    }
  };
};

/**
 * Returns an object containing information about this application
 *
 * @param {String} query Identifier
 * @param {Object} pubConfig Publication configuration
 * @param {String} appUrl URL of application
 * @returns {Object} Query object
 */
const queryResponse = async (query, pubConfig, appUrl) => {
  const mediaEndpoint = pubConfig['media-endpoint'] || `${appUrl}/media`;
  const syndicateTo = pubConfig['syndicate-to'] || [];

  if (query.q === 'config') {
    return {
      code: 200,
      body: {
        'media-endpoint': mediaEndpoint,
        'syndicate-to': syndicateTo
      }
    };
  }

  if (query.q === 'source') {
    const {properties} = query;
    let html;
    let mf2;

    try {
      const response = await fetch(query.url);
      html = await response.text();
    } catch (error) {
      throw new Error(error.message);
    }

    if (properties) { // Respond only with requested properties
      mf2 = await microformats.getProperties(html);

      const selected = Object.keys(mf2.properties)
        .filter(key => properties.includes(key))
        .reduce((obj, key) => {
          obj[key] = mf2.properties[key];
          return obj;
        }, {});

      mf2 = selected;
    } else {
      mf2 = await microformats.getProperties(html);
    }

    return {
      code: 200,
      body: mf2
    };
  }

  if (query.q === 'syndicate-to') {
    return {
      code: 200,
      body: {
        'syndicate-to': syndicateTo
      }
    };
  }

  return errorResponse('invalid_request');
};

/**
 * Creates post data by merging submitted and derived information about a post
 *
 * @param {Object} pubConfig Publication configuration
 * @param {String} body Body content (contains microformats2 object)
 * @param {String} files File attachments
 * @returns {Object} New mf2 object
 */
const createPostData = async (pubConfig, body, files) => {
  const {properties} = body;
  const slugSeparator = pubConfig['slug-separator'] || pubDefaults['slug-separator'];

  // Update content, date and slug properties
  properties.content = getContent(properties.content);
  properties.photo = getPhotos(properties.photo);
  properties.published = getDate(body);
  properties.slug = getSlug(body, slugSeparator);

  if (files) {
    /**
     * Turns out async/await doesn’t work so great with forEach loops. Use
     * asynchronous `await Promise.all(files.map(async file => {…}))` or
     * synchronous `for (const file of files) {…}` instead.
     * (Asynchronous pattern trips up Micropub.rocks! validator)
     * @see https://stackoverflow.com/a/37576787/11107625
     */
    for (const file of files) { /* eslint-disable no-await-in-loop */
      const fileext = path.extname(file.originalname);
      let filename = String(Math.floor(Math.random() * 90000) + 10000);
      filename += fileext;

      // @todo Infer type by `type` using multer field object
      const typeConfig = pubConfig['post-types'][0].photo || pubDefaults['post-types'][0].photo;
      const fileProperties = {
        filetype: 'photo',
        filename,
        fileext
      };
      const fileContext = {...properties, ...fileProperties};
      const filePath = render.string(typeConfig.file, fileContext);

      console.log(`Uploading ${filename}`);

      const githubResponse = await github.createFile(filePath, file.buffer, {
        message: `:framed_picture: ${filename} uploaded with ${appConfig.name}`
      });

      if (githubResponse) {
        properties.photo.push({
          value: filePath
        });
      }
    } /* eslint-enable no-await-in-loop */

    return body;
  }

  return body;
};

/**
 * Creates a post
 *
 * @param {Object} pubConfig Publication configuration
 * @param {String} body Body content (contains microformats2 object)
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
const createPost = async (pubConfig, body, files) => {
  try {
    // Get post data (original mf2 plus ammendments)
    const postData = await createPostData(pubConfig, body, files);
    const context = postData.properties;

    // Determine post type
    const type = microformats.getType(postData);
    const typeName = utils.capitalizeFirstLetter(type);
    const typeConfig = pubConfig['post-types'][0][type] || pubDefaults['post-types'][0][type];

    // Set publish and destination paths
    const postPath = render.string(typeConfig.post, context);
    const urlPath = render.string(typeConfig.url, context);

    // Render template (fetch configured from remote/cache, else use default)
    let template;
    const templatePathConfig = pubConfig['post-types'][0][type].template;
    const templatePathCached = path.join('templates', `${type}.njk`);
    const templatePathDefault = pubDefaults['post-types'][0][type].template;

    if (templatePathConfig) {
      template = await cache.fetch(templatePathConfig, templatePathCached);
    } else {
      template = templatePathDefault;
    }

    // Create post on GitHub
    const content = render.string(template, context);
    const githubResponse = await github.createFile(postPath, content, {
      message: `:robot: ${typeName} created with ${appConfig.name}`
    });

    // Update history and send success reponse
    const location = pubConfig.url + urlPath;
    const historyEntry = {
      post: postPath,
      url: location
    };

    if (githubResponse) {
      history.update('create', historyEntry);
      return successResponse('create_pending', location);
    }

    throw new Error(`Unable to create ${location}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Gets post to inspect its properties
 *
 * @param {String} url URL path to post
 * @returns {Object} mf2
 */
const getPost = async url => {
  try {
    const response = await fetch(url);

    if (response) {
      const html = await response.text();
      return microformats.getProperties(html);
    }

    throw new Error(`Unable to connect to ${url}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates a post
 *
 * @param {String} url URL path to post
 * @param {String} content Content to update
 * @returns {Object} Response
 */
const updatePost = async (url, content) => {
  const repoPath = utils.filePathFromUrl(url);
  const typeName = null; // @todo Determine post type
  const githubResponse = github.updateFile(repoPath, content, {
    message: `:robot: ${typeName} updated with ${appConfig.name}`
  });
  if (githubResponse) {
    /* @todo If path has changed, return 'update_created' */
    return successResponse('update', url);
  }

  throw new Error(`Unable to update ${url}`);
};

/**
 * Deletes a post
 *
 * @param {String} url URL of published post
 * @returns {Object} Response
 */
const deletePost = async url => {
  let repoPath;
  let entries;

  try {
    const getHistory = await history.read();
    entries = getHistory.entries;
  } catch (error) {
    throw new Error('No history available');
  }

  if (entries) {
    entries.forEach(entry => {
      if (entry.create.url === url) {
        repoPath = entry.create.post;
      }
    });
  }

  try {
    const githubResponse = await github.deleteFile(repoPath, {
      message: `:robot: Post deleted with ${appConfig.name}`
    });
    if (githubResponse) {
      return successResponse('delete', url);
    }
  } catch (error) {
    throw new Error(`Unable to delete ${url}`);
  }
};

module.exports = {
  convertFormEncodedToMf2,
  getSlug,
  getDate,
  getPhotos,
  getContent,
  errorResponse,
  successResponse,
  queryResponse,
  createPost,
  getPost,
  updatePost,
  deletePost
};
