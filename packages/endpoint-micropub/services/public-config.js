/**
 * Return publicly accessible configuation values.
 *
 * @param {object} config Publication configuration
 * @returns {object} Public publication configuration
 * @see https://indieweb.org/Micropub-extensions#Query_for_Supported_Vocabulary
 */
export const publicConfig = config => {
  const postTypes = config['post-types'];

  // Return only `type` and `key` for each configured post type
  config['post-types'] = postTypes.map(postType => ({
    type: postType.type,
    name: postType.name
  }));

  return config;
};
