const {DateTime} = require('luxon');
const slugify = require('slugify');

const appConfig = require(__basedir + '/app/config.js');
const config = require(__basedir + '/.cache/config.json');
const format = require(__basedir + '/app/functions/format');
const github = require(__basedir + '/app/functions/github');
const microformats = require(__basedir + '/app/functions/microformats');
const utils = require(__basedir + '/app/functions/utils');

const repoUrl = `https://github.com/${appConfig.github.user}/${appConfig.github.repo}/blob/master/`;

/**
 * Converts form-encoded body to microformats2 object
 *
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
 * Gets a slugified string based on microformats2 object
 *
 * @param {String} mf2 microformats2 object
 * @param {String} separator Slug separator
 * @returns {String} Slug
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

  slug = Math.floor(Math.random() * 90000) + 10000;
  return [slug];
};

/**
 * Returns an ISO formatted date
 *
 * @param {String} mf2 microformats2 object
 * @returns {String} ISO formatted date
 */
exports.getDate = function (mf2) {
  try {
    const published = mf2.properties.published[0];
    return new Array(published.toISO());
  } catch (error) {
    return new Array(DateTime.local().toISO());
  }
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
 * @param {String} appUrl URL of application
 * @returns {Object} Query object
 */
exports.queryResponse = function (query, appUrl) {
  let code;
  let body;

  const mediaEndpoint = config['media-endpoint'] || `${appUrl}/media`;
  const syndicateTo = config['syndicate-to'] || [];

  switch (query) {
    case ('config'):
      code = 200;
      body = {
        'media-endpoint': mediaEndpoint,
        'syndicate-to': syndicateTo
      };
      break;
    case ('source'):
      return module.exports.errorResponse('not_supported');
    case ('syndicate-to'):
      code = 200;
      body = {
        'syndicate-to': syndicateTo
      };
      break;
    default:
      return module.exports.errorResponse('invalid_request');
  }

  return {
    code,
    body
  };
};

/**
 * Creates a post
 *
 * @param {String} mf2 microformats2 object
 * @returns {String} Location of created post
 */
exports.createPost = async function (mf2) {
  // Add date and slug values to microformats2 object
  const slugSeparator = config['slug-separator'] || '-';
  const postData = mf2.properties;
  const postDate = module.exports.getDate(mf2);
  const postSlug = module.exports.getSlug(mf2, slugSeparator);
  postData.published = postDate;
  postData.slug = postSlug;

  // Determine post type
  const postType = microformats.getType(mf2);

  // Format paths and templates
  const postConfig = config['post-types'][0][postType];
  const path = format.string(postConfig.path, postData);
  const content = format.template(`templates/${postType}.njk`, postData);

  // Push file to GitHub
  const githubResponse = await github.createFile(path, content, postType);

  try {
    if (!githubResponse) {
      throw new Error('No response from GitHub');
    }

    return repoUrl + path;
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
};

/**
 * Updates a post
 *
 * @param {String} path Path to post
 * @param {String} content Content to update
 * @returns {Object} Response
 */
exports.updatePost = async function (path, content) {
  console.log(`Update post at ${path}`);

  return github.updateFile(path, content).then(response => {
    if (response.ok) {
      // TODO: If path has changed, return 'update_created'
      return module.exports.successResponse('update', repoUrl + path);
    }

    throw response.error;
  }).catch(error => {
    console.error('GitHub:', error);
  });
};

/**
 * Deletes a post
 *
 * @param {String} path Path to post
 * @returns {Object} Response
 */
exports.deletePost = async function (path) {
  console.log(`Delete post at ${path}`);

  return github.deleteFile(path).then(response => {
    if (response.ok) {
      return module.exports.successResponse('delete', repoUrl + path);
    }

    throw response.error;
  }).catch(error => {
    console.error('GitHub:', error);
  });
};
