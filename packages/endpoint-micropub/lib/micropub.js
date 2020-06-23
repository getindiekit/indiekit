/**
 * Return Micropub action to perform
 *
 * @param {string} scope Token scope
 * @param {string} action Requested Micropub action
 * @param {string} url URL of the object being acted on
 * @returns {string} Micropub action
 */
export const getAction = (scope, action, url) => {
  if (url) {
    if (!action) {
      throw new Error(`Need an action to perform on ${url}`);
    }

    if (scope === action) {
      return action;
    }
  } else if (scope === 'create') {
    return 'create';
  }

  throw new Error(`URL required to perform ${action} action`);
};

/**
 * Return queryable publication config
 *
 * @param {object} config Publication config
 * @returns {object} Queryable config
 */
export const getConfig = config => {
  const postTypes = config['post-types'] || [];

  return {
    categories: config.categories || [],
    'syndicate-to': config['syndicate-to'] || [],
    'media-endpoint': config['media-endpoint'],
    'post-types': postTypes.map(postType => ({
      type: postType.type,
      name: postType.name
    }))
  };
};

/**
 * Reserved body property names
 *
 * @see https://www.w3.org/TR/micropub/#reserved-properties
 */
export const reservedProperties = Object.freeze([
  'access_token',
  'h',
  'action',
  'url'
]);
