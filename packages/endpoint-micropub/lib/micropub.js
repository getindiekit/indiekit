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
