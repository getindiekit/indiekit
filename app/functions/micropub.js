/**
 * Accept form-encoded and JSON data, convert it to a microformats2 object
 * and process the resulting data so that it can be published to a destination.
 *
 * @module functions/micropub
 */
const {DateTime} = require('luxon');
const slugify = require('slugify');

const appConfig = require(__basedir + '/app/config.js');
const cache = require(__basedir + '/app/functions/cache');
const github = require(__basedir + '/app/functions/github');
const microformats = require(__basedir + '/app/functions/microformats');
const render = require(__basedir + '/app/functions/render');
const utils = require(__basedir + '/app/functions/utils');

const repoUrl = `https://github.com/${appConfig.github.user}/${appConfig.github.repo}/blob/master/`;

/**
 * Converts form-encoded body to microformats2 object. Adapted from
 * {@link https://github.com/voxpelli/node-micropub-express node-micropub-express}
 * by {@link https://kodfabrik.se Pelle Wessman}
 *
 * @copyright (c) 2016, Pelle Wessman
 * @param {String} body Form-encoded body
 * @return {Object} mf2 microformats2 object
 */
exports.convertFormEncodedToMf2 = function (body) {
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
exports.getSlug = function (mf2, separator) {
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
exports.getDate = function (mf2) {
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
exports.getPhotos = function (property) {
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
};

/**
 * Returns content (HTML, else object value, else property value)
 *
 * @param {Array} property microformats2 `contents` property
 * @returns {Array} Content
 */
exports.getContent = function (property) {
  const content = property[0].html || property[0].value || property[0];
  return new Array(content);
};

/**
 * Returns an object containing error information
 *
 * @param {String} id Identifier
 * @param {String} desc Description
 * @returns {Object} Error object
 */
exports.errorResponse = function (id, desc) {
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
exports.successResponse = function (id, location) {
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
exports.queryResponse = async function (query, pubConfig, appUrl) {
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
    /* @todo Currently returns markdown with no mf2 properties */
    const properties = await module.exports.getPost(query.url);
    return {
      code: 200,
      body: {
        properties
      }
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

  return module.exports.errorResponse('invalid_request');
};

/**
 * Creates a post
 *
 * @param {String} mf2 microformats2 object
 * @param {Object} pubConfig Publication configuration
 * @returns {String} Location of created post
 */
exports.createPost = async function (mf2, pubConfig) {
  const prop = mf2.properties;

  // Determine date and slug properties
  const slugSeparator = pubConfig['slug-separator'] || '-';
  prop.published = module.exports.getDate(mf2);
  prop.slug = module.exports.getSlug(mf2, slugSeparator);

  // Normalise content and photo properties
  if (prop.content) {
    prop.content = module.exports.getContent(prop.content);
  }

  if (prop.photo) {
    prop.photo = module.exports.getPhotos(prop.photo);
  }

  // Render publish and destination path
  const type = microformats.getType(mf2);
  const typeConfig = pubConfig['post-types'][0][type];
  const path = render.string(typeConfig.path, prop);
  const url = render.string(typeConfig.url, prop);

  // Render template
  const remoteTemplatePath = pubConfig['post-types'][0][type].template;
  const cachedTemplatePath = `templates/${type}.njk`;
  const template = await cache.fetchFile(remoteTemplatePath, cachedTemplatePath);
  const content = render.string(template, prop);

  // Create post on GitHub
  const githubResponse = await github.createFile(path, content, type);
  if (githubResponse) {
    return module.exports.successResponse('create_pending', pubConfig.url + url);
  }

  throw new Error(githubResponse.error);
};

/**
 * Gets post to inspect its properties
 *
 * @param {String} path Path to post
 * @returns {Object} Response
 */
exports.getPost = async function (path) {
  const githubResponse = await github.getFile(path);
  if (githubResponse) {
    return githubResponse.content;
  }

  throw new Error(githubResponse.error);
};

/**
 * Updates a post
 *
 * @param {String} path Path to post
 * @param {String} content Content to update
 * @returns {Object} Response
 */
exports.updatePost = async function (path, content) {
  const githubResponse = github.updateFile(path, content);
  if (githubResponse) {
    /* @todo If path has changed, return 'update_created' */
    return module.exports.successResponse('update', repoUrl + path);
  }

  throw new Error(githubResponse.error);
};

/**
 * Deletes a post
 *
 * @param {String} path Path to post
 * @returns {Object} Response
 */
exports.deletePost = async function (path) {
  const githubResponse = await github.deleteFile(path);
  if (githubResponse) {
    return module.exports.successResponse('delete', path);
  }

  throw new Error(githubResponse.error);
};
