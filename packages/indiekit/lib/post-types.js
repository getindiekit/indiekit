import _ from "lodash";

/**
 * Get merged preset and custom post types
 * @param {object} publication - Publication configuration
 * @param {Array[object]} publication.postTypes - Publication post types
 * @param {object} [publication.preset] - Publication preset
 * @returns {object} Merged configuration
 */
export const getPostTypes = ({ postTypes, preset }) => {
  postTypes = _.keyBy(postTypes, "type");

  if (preset?.postTypes) {
    const presetPostTypes = _.keyBy(preset.postTypes, "type");

    postTypes = _.merge(postTypes, presetPostTypes);
  }

  // Add fallback values to post type if not provided
  for (const key of Object.keys(postTypes)) {
    const { fields, name, requiredFields, type } = postTypes[key];
    postTypes[key].name = name || _.upperFirst(type);
    postTypes[key].fields = fields || [];
    postTypes[key].requiredFields = requiredFields || [];
  }

  return _.values(postTypes);
};
