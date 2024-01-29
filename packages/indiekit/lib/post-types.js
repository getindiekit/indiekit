import _ from "lodash";

/**
 * Get merged preset and custom post types
 * @param {object} publication - Publication configuration
 * @param {object} publication.postTypes - Publication post types
 * @param {object} [publication.preset] - Publication preset
 * @returns {object} Merged configuration
 */
export const getPostTypes = ({ postTypes, preset }) => {
  if (preset?.postTypes) {
    postTypes = _.merge(postTypes, preset.postTypes);
  }

  // Add fallback values to post type if not provided
  for (const type of Object.keys(postTypes)) {
    const { fields, name, requiredFields } = postTypes[type];
    postTypes[type].type = type;
    postTypes[type].name = name || _.upperFirst(type);
    postTypes[type].fields = fields || [];
    postTypes[type].requiredFields = requiredFields || [];
  }

  return postTypes;
};
