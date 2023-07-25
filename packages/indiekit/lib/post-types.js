import _ from "lodash";

/**
 * Get merged preset and custom post types
 * @param {object} publication - Publication configuration
 * @param {Array} publication.postTypes - Publication post types
 * @param {object} publication.preset - Publication preset
 * @returns {object} Merged configuration
 */
export const getPostTypes = ({ postTypes, preset }) => {
  if (preset?.postTypes && postTypes) {
    return _.values(
      _.merge(_.keyBy(preset.postTypes, "type"), _.keyBy(postTypes, "type")),
    );
  }

  return postTypes;
};
